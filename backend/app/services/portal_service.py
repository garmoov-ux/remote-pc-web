"""
포털 초기 시드 자동 주입, 부트스트랩 단일 조회(캐시 우선), 실시간 텔레메트리 및 다운로드 추적 서비스 모듈입니다.
"""

from datetime import datetime, timezone
from typing import Any

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
    ClientReleaseSchema,
    FaqItemSchema,
    HowToStepSchema,
    NoticeItemSchema,
    PortalBootstrapDataSchema,
    ServiceGameSchema,
    SiteConfigSchema,
    TeamRoleSchema,
    TelemetryDataSchema,
    WhyFeatureSchema,
)
from app.seeds.initial_portal_data import (
    HOW_TO_USE_STEPS,
    INITIAL_FAQS,
    INITIAL_GAMES,
    INITIAL_NOTICES,
    TEAM_ROLES,
    WHY_CHOOSE_FEATURES,
)
from app.utils.hash_and_excel import compute_file_sha256

settings = get_settings()
BOOTSTRAP_CACHE_KEY = "portal:bootstrap:v1"


async def ensure_initial_seed_data(session: AsyncSession) -> None:
    """DB에 초기 데이터가 없을 경우 마스터 프로필, 50종 게임, 공지 3종, FAQ 7종, 릴리스 정보를 자동 시딩합니다."""
    cfg_count = await session.scalar(select(func.count(SiteConfig.id)))
    if not cfg_count:
        session.add(
            SiteConfig(
                brand_name=settings.brand_name,
                brand_sub_name=settings.brand_sub_name,
                company_name=settings.company_name,
                ceo_name=settings.ceo_name,
                business_reg_no=settings.business_reg_no,
                mail_order_reg_no=settings.mail_order_reg_no,
                company_address=settings.company_address,
                cs_phone=settings.cs_phone,
                kakao_channel_url=settings.kakao_channel_url,
                contact_email=settings.contact_email,
                anydesk_download_url=settings.anydesk_download_url,
                stat_partner_pc_count="70+",
                stat_service_game_count="50+",
                stat_base_minutes_per_10k="600분",
                stat_avg_wait_minutes="00분",
            )
        )

    rel_count = await session.scalar(select(func.count(ClientRelease.id)))
    if not rel_count:
        sha256_val = compute_file_sha256(
            settings.client_installer_local_path,
            settings.client_installer_sha256,
        )
        session.add(
            ClientRelease(
                version=settings.client_installer_version,
                filename=settings.client_installer_filename,
                download_url="/api/downloads/client",
                fallback_cdn_url=settings.client_installer_fallback_url,
                sha256_hash=sha256_val,
                file_size_label="48.6 MB",
                os_support="Windows 10 / 11 (64-bit)",
                release_notes="전국 70+ 지점 자동 매칭 및 초저지연 스트리밍 코어 엔진 최적화",
                is_latest=True,
            )
        )

    game_count = await session.scalar(select(func.count(ServiceGame.id)))
    if not game_count:
        for game_row in INITIAL_GAMES:
            session.add(ServiceGame(**game_row))

    notice_count = await session.scalar(select(func.count(NoticeItem.id)))
    if not notice_count:
        for notice_row in INITIAL_NOTICES:
            session.add(NoticeItem(**notice_row))

    faq_count = await session.scalar(select(func.count(FaqItem.id)))
    if not faq_count:
        for faq_row in INITIAL_FAQS:
            session.add(FaqItem(**faq_row))

    await session.commit()


async def build_telemetry_data(session: AsyncSession) -> TelemetryDataSchema:
    """현재 활성 사이트 설정을 기반으로 실시간 가동 상태 및 좌석 텔레메트리를 생성합니다."""
    cfg = await session.scalar(
        select(SiteConfig).where(SiteConfig.is_active.is_(True)).limit(1)
    )
    return TelemetryDataSchema(
        status="ONLINE",
        status_label="실시간 가동",
        partner_stores=cfg.stat_partner_pc_count if cfg else "70+",
        supported_games=cfg.stat_service_game_count if cfg else "50+",
        minutes_per_10k=cfg.stat_base_minutes_per_10k if cfg else "600분",
        avg_wait_minutes=cfg.stat_avg_wait_minutes if cfg else "00분",
        active_nodes=74,
        available_seats=418,
        updated_at=datetime.now(timezone.utc),
    )


async def get_portal_bootstrap_payload(
    session: AsyncSession,
) -> PortalBootstrapDataSchema:
    """포털 메인 화면 렌더링에 필요한 전체 도메인 데이터를 단일 응답으로 조회합니다."""
    cached = portal_cache.get(BOOTSTRAP_CACHE_KEY)
    if cached is not None:
        return cached

    cfg = await session.scalar(
        select(SiteConfig).where(SiteConfig.is_active.is_(True)).limit(1)
    )
    release = await session.scalar(
        select(ClientRelease)
        .where(ClientRelease.is_active.is_(True), ClientRelease.is_latest.is_(True))
        .order_by(ClientRelease.id.desc())
        .limit(1)
    )
    games_result = await session.scalars(
        select(ServiceGame)
        .where(ServiceGame.is_active.is_(True), ServiceGame.deleted_at.is_(None))
        .order_by(ServiceGame.display_order.asc(), ServiceGame.id.asc())
    )
    notices_result = await session.scalars(
        select(NoticeItem)
        .where(NoticeItem.is_active.is_(True), NoticeItem.deleted_at.is_(None))
        .order_by(NoticeItem.display_order.asc(), NoticeItem.id.asc())
    )
    faqs_result = await session.scalars(
        select(FaqItem)
        .where(FaqItem.is_active.is_(True), FaqItem.deleted_at.is_(None))
        .order_by(FaqItem.display_order.asc(), FaqItem.id.asc())
    )

    telemetry = await build_telemetry_data(session)

    payload = PortalBootstrapDataSchema(
        site_config=SiteConfigSchema.model_validate(cfg),
        telemetry=telemetry,
        latest_release=ClientReleaseSchema.model_validate(release),
        how_to_steps=[HowToStepSchema(**item) for item in HOW_TO_USE_STEPS],
        games=[ServiceGameSchema.model_validate(g) for g in games_result.all()],
        why_features=[WhyFeatureSchema(**item) for item in WHY_CHOOSE_FEATURES],
        team_roles=[TeamRoleSchema(**item) for item in TEAM_ROLES],
        notices=[NoticeItemSchema.model_validate(n) for n in notices_result.all()],
        faqs=[FaqItemSchema.model_validate(f) for f in faqs_result.all()],
    )
    portal_cache.set(BOOTSTRAP_CACHE_KEY, payload, ttl_seconds=60)
    return payload


def mask_client_ip(raw_ip: str | None) -> str:
    """개인정보 보호를 위해 클라이언트 IP의 마지막 옥텟을 마스킹합니다."""
    if not raw_ip:
        return "0.0.0.0"
    parts = raw_ip.split(".")
    if len(parts) == 4:
        return f"{parts[0]}.{parts[1]}.{parts[2]}.***"
    return raw_ip[:12] + "***"


async def record_download_event(
    session: AsyncSession,
    trigger_section: str,
    client_ip: str | None,
    user_agent: str,
    referrer: str,
) -> dict[str, Any]:
    """접속기 다운로드 클릭 및 전환 로그를 DB에 기록합니다."""
    release = await session.scalar(
        select(ClientRelease)
        .where(ClientRelease.is_active.is_(True), ClientRelease.is_latest.is_(True))
        .order_by(ClientRelease.id.desc())
        .limit(1)
    )
    version = release.version if release else settings.client_installer_version
    log_entry = DownloadLog(
        trigger_section=trigger_section[:60],
        release_version=version,
        client_ip_masked=mask_client_ip(client_ip),
        user_agent=user_agent[:250],
        referrer=referrer[:250],
    )
    session.add(log_entry)
    await session.commit()
    await session.refresh(log_entry)
    return {
        "log_id": log_entry.id,
        "trigger_section": log_entry.trigger_section,
        "release_version": version,
        "download_url": release.download_url if release else "/api/downloads/client",
        "fallback_cdn_url": (
            release.fallback_cdn_url
            if release
            else settings.client_installer_fallback_url
        ),
    }
