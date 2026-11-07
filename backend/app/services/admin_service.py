"""
관리자 인증(JWT 발급/검증) 및 JSON-RPC 2.0 기반 포털 콘텐츠(게임, 공지, FAQ, 릴리스, 다운로드 통계) 관리 서비스 모듈입니다.
"""

import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import portal_cache
from app.models.portal import (
    ClientRelease,
    DownloadLog,
    FaqItem,
    NoticeItem,
    ServiceGame,
    SiteConfig,
)
from app.schemas.portal import (
    AdminLoginResponse,
    ClientReleaseSchema,
    FaqItemSchema,
    NoticeItemSchema,
    ServiceGameSchema,
    SiteConfigSchema,
)

settings = get_settings()
JWT_ALGORITHM = "HS256"


def verify_admin_credentials(username: str, password: str) -> bool:
    """관리자 아이디와 비밀번호를 타이밍 공격 안전 비교(hmac.compare_digest)로 검증합니다."""
    user_ok = hmac.compare_digest(username.strip(), settings.admin_initial_username)
    pw_hash_input = hashlib.sha256(password.encode("utf-8")).hexdigest()
    pw_hash_expected = hashlib.sha256(
        settings.admin_initial_password.encode("utf-8")
    ).hexdigest()
    pass_ok = hmac.compare_digest(pw_hash_input, pw_hash_expected)
    return user_ok and pass_ok


def create_admin_jwt_token(username: str) -> AdminLoginResponse:
    """관리자용 JWT 액세스 토큰을 생성합니다."""
    expire_minutes = settings.jwt_access_token_expire_minutes
    exp = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    payload = {
        "sub": username,
        "role": "admin",
        "exp": exp,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, settings.app_secret_key, algorithm=JWT_ALGORITHM)
    return AdminLoginResponse(
        access_token=token,
        token_type="bearer",
        username=username,
        expires_in_minutes=expire_minutes,
    )


def verify_admin_jwt_token(token: str) -> dict[str, Any] | None:
    """전달된 JWT 액세스 토큰의 서명과 만료 여부를 검증합니다."""
    try:
        decoded = jwt.decode(
            token, settings.app_secret_key, algorithms=[JWT_ALGORITHM]
        )
        if decoded.get("role") != "admin":
            return None
        return decoded
    except Exception:
        return None


async def execute_admin_rpc_method(
    session: AsyncSession,
    method: str,
    params: dict[str, Any],
) -> Any:
    """JSON-RPC 2.0 메서드명에 따라 관리자 CMS 작업을 수행하고 포털 캐시를 갱신합니다."""
    if method == "stats.summary":
        total_downloads = await session.scalar(select(func.count(DownloadLog.id))) or 0
        total_games = (
            await session.scalar(
                select(func.count(ServiceGame.id)).where(
                    ServiceGame.deleted_at.is_(None)
                )
            )
            or 0
        )
        recent_logs_res = await session.scalars(
            select(DownloadLog).order_by(DownloadLog.id.desc()).limit(25)
        )
        by_section_res = await session.execute(
            select(DownloadLog.trigger_section, func.count(DownloadLog.id)).group_by(
                DownloadLog.trigger_section
            )
        )
        section_Breakdown = {row[0]: row[1] for row in by_section_res.all()}
        return {
            "total_downloads": total_downloads,
            "total_games": total_games,
            "section_breakdown": section_Breakdown,
            "recent_logs": [
                {
                    "id": log.id,
                    "trigger_section": log.trigger_section,
                    "release_version": log.release_version,
                    "client_ip_masked": log.client_ip_masked,
                    "referrer": log.referrer,
                    "created_at": log.created_at.isoformat(),
                }
                for log in recent_logs_res.all()
            ],
        }

    if method == "game.upsert":
        game_code = str(params.get("game_code", "")).strip()
        if not game_code:
            raise ValueError("게임 코드(game_code)는 필수입니다.")
        existing = await session.scalar(
            select(ServiceGame).where(ServiceGame.game_code == game_code)
        )
        if existing:
            existing.title = str(params.get("title", existing.title))
            existing.genre = str(params.get("genre", existing.genre))
            existing.thumbnail_url = str(
                params.get("thumbnail_url", existing.thumbnail_url)
            )
            existing.support_status = str(
                params.get("support_status", existing.support_status)
            )
            existing.badge_label = str(params.get("badge_label", existing.badge_label))
            existing.benefit_summary = str(
                params.get("benefit_summary", existing.benefit_summary)
            )
            existing.is_featured = bool(
                params.get("is_featured", existing.is_featured)
            )
            existing.deleted_at = None
            existing.is_active = True
            target = existing
        else:
            target = ServiceGame(
                game_code=game_code,
                title=str(params.get("title", "신규 서비스 게임")),
                genre=str(params.get("genre", "MMORPG")),
                thumbnail_url=str(
                    params.get("thumbnail_url", "/images/games/game-01.png")
                ),
                support_status=str(params.get("support_status", "available")),
                badge_label=str(params.get("badge_label", "PC방 프리미엄")),
                benefit_summary=str(
                    params.get("benefit_summary", "집에서 PC방 혜택 동일 적용")
                ),
                is_featured=bool(params.get("is_featured", False)),
                display_order=int(params.get("display_order", 99)),
            )
            session.add(target)
        await session.commit()
        await session.refresh(target)
        portal_cache.invalidate_prefix("portal:")
        return ServiceGameSchema.model_validate(target).model_dump()

    if method == "game.delete":
        game_id = int(params.get("id", 0))
        target = await session.get(ServiceGame, game_id)
        if not target:
            raise ValueError("삭제할 게임을 찾을 수 없습니다.")
        target.deleted_at = datetime.now(timezone.utc)
        target.is_active = False
        await session.commit()
        portal_cache.invalidate_prefix("portal:")
        return {"deleted_id": game_id}

    if method == "release.update":
        release = await session.scalar(
            select(ClientRelease)
            .where(ClientRelease.is_latest.is_(True))
            .order_by(ClientRelease.id.desc())
            .limit(1)
        )
        if not release:
            raise ValueError("활성 릴리스 정보를 찾을 수 없습니다.")
        release.version = str(params.get("version", release.version))
        release.filename = str(params.get("filename", release.filename))
        release.fallback_cdn_url = str(
            params.get("fallback_cdn_url", release.fallback_cdn_url)
        )
        release.sha256_hash = str(params.get("sha256_hash", release.sha256_hash))
        release.file_size_label = str(
            params.get("file_size_label", release.file_size_label)
        )
        release.release_notes = str(params.get("release_notes", release.release_notes))
        await session.commit()
        await session.refresh(release)
        portal_cache.invalidate_prefix("portal:")
        return ClientReleaseSchema.model_validate(release).model_dump()

    if method == "config.update":
        cfg = await session.scalar(
            select(SiteConfig).where(SiteConfig.is_active.is_(True)).limit(1)
        )
        if not cfg:
            raise ValueError("사이트 설정 정보를 찾을 수 없습니다.")
        for field_name in (
            "cs_phone",
            "kakao_channel_url",
            "stat_partner_pc_count",
            "stat_service_game_count",
            "stat_base_minutes_per_10k",
            "stat_avg_wait_minutes",
        ):
            if field_name in params:
                setattr(cfg, field_name, str(params[field_name]))
        await session.commit()
        await session.refresh(cfg)
        portal_cache.invalidate_prefix("portal:")
        return SiteConfigSchema.model_validate(cfg).model_dump()

    if method == "faq.upsert":
        faq_id = params.get("id")
        if faq_id:
            faq = await session.get(FaqItem, int(faq_id))
            if not faq:
                raise ValueError("수정할 FAQ 항목을 찾을 수 없습니다.")
            faq.category = str(params.get("category", faq.category))
            faq.question = str(params.get("question", faq.question))
            faq.answer = str(params.get("answer", faq.answer))
        else:
            faq = FaqItem(
                category=str(params.get("category", "일반")),
                question=str(params.get("question", "")),
                answer=str(params.get("answer", "")),
                display_order=int(params.get("display_order", 20)),
            )
            session.add(faq)
        await session.commit()
        await session.refresh(faq)
        portal_cache.invalidate_prefix("portal:")
        return FaqItemSchema.model_validate(faq).model_dump()

    if method == "notice.upsert":
        notice_id = params.get("id")
        if notice_id:
            notice = await session.get(NoticeItem, int(notice_id))
            if not notice:
                raise ValueError("수정할 공지사항을 찾을 수 없습니다.")
            notice.title = str(params.get("title", notice.title))
            notice.summary = str(params.get("summary", notice.summary))
            notice.badge_text = str(params.get("badge_text", notice.badge_text))
        else:
            notice = NoticeItem(
                category=str(params.get("category", "general")),
                badge_text=str(params.get("badge_text", "공지 // 안내")),
                title=str(params.get("title", "")),
                summary=str(params.get("summary", "")),
                steps_json=params.get("steps_json", []),
                display_order=int(params.get("display_order", 10)),
            )
            session.add(notice)
        await session.commit()
        await session.refresh(notice)
        portal_cache.invalidate_prefix("portal:")
        return NoticeItemSchema.model_validate(notice).model_dump()

    raise KeyError(f"지원하지 않는 RPC 메서드입니다: {method}")
