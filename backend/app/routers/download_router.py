"""
원격 접속기(unplug_setup.exe) 패키지 다운로드, 전환 추적 로그 기록 및 엑셀(.xlsx) 리포트 출력 라우터 모듈입니다.
"""

from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import FileResponse, RedirectResponse, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db_session
from app.models.portal import DownloadLog, ServiceGame
from app.schemas.common import ApiResponse
from app.schemas.portal import DownloadTrackRequest
from app.services.portal_service import record_download_event
from app.utils.hash_and_excel import build_download_stats_workbook

router = APIRouter(prefix="/api/downloads", tags=["접속기 다운로드 및 전환 분석 API"])
settings = get_settings()


@router.post(
    "/track",
    response_model=ApiResponse[dict[str, Any]],
    summary="접속기 다운로드 CTA 클릭 전환 이벤트 기록",
    description="헤더, 히어로, 하단 다운로드 배너, 플로팅 바 등 위치별 다운로드 클릭 전환 로그를 저장합니다.",
)
async def track_client_download(
    body: DownloadTrackRequest,
    request: Request,
    session: AsyncSession = Depends(get_db_session),
) -> ApiResponse[dict[str, Any]]:
    """다운로드 버튼 클릭 이벤트를 데이터베이스에 기록합니다."""
    client_ip = request.client.host if request.client else "0.0.0.0"
    user_agent = request.headers.get("user-agent", "")
    referrer = body.referrer or request.headers.get("referer", "")
    result = await record_download_event(
        session=session,
        trigger_section=body.trigger_section,
        client_ip=client_ip,
        user_agent=user_agent,
        referrer=referrer,
    )
    return ApiResponse(success=True, data=result)


@router.get(
    "/client",
    summary="원격플러그인 피시 접속기(unplug_setup.exe) 설치 파일 다운로드",
    description="로컬 스토리지에 설치 파일이 존재하면 직접 스트리밍하고, 없을 경우 공식 배포 CDN(https://unplug.co.kr/down/unplug_setup.exe)으로 안전하게 리다이렉트합니다.",
)
async def download_client_installer(
    request: Request,
    source: str = Query(default="direct_download", description="다운로드 트리거 출처"),
    session: AsyncSession = Depends(get_db_session),
) -> Response:
    """접속기 설치 파일을 전송하거나 공식 CDN으로 307 리다이렉트합니다."""
    client_ip = request.client.host if request.client else "0.0.0.0"
    user_agent = request.headers.get("user-agent", "")
    referrer = request.headers.get("referer", "")
    tracked = await record_download_event(
        session=session,
        trigger_section=source,
        client_ip=client_ip,
        user_agent=user_agent,
        referrer=referrer,
    )

    local_file = Path(settings.client_installer_local_path)
    if local_file.is_file():
        return FileResponse(
            path=str(local_file),
            filename=settings.client_installer_filename,
            media_type="application/octet-stream",
        )
    return RedirectResponse(url=tracked["fallback_cdn_url"], status_code=307)


@router.get(
    "/stats.xlsx",
    summary="접속기 다운로드 전환 통계 및 서비스 게임 카탈로그 엑셀(.xlsx) 다운로드",
    description="일자별/섹션별 다운로드 로그와 50종 서비스 게임 카탈로그가 포함된 엑셀 워크북을 생성하여 반환합니다.",
)
async def export_download_stats_excel(
    session: AsyncSession = Depends(get_db_session),
) -> Response:
    """openpyxl을 사용하여 다운로드 로그 및 게임 목록 엑셀 파일을 스트리밍 반환합니다."""
    logs_res = await session.scalars(
        select(DownloadLog).order_by(DownloadLog.id.desc()).limit(500)
    )
    games_res = await session.scalars(
        select(ServiceGame)
        .where(ServiceGame.deleted_at.is_(None))
        .order_by(ServiceGame.display_order.asc())
    )
    logs_data = [
        {
            "id": item.id,
            "trigger_section": item.trigger_section,
            "release_version": item.release_version,
            "client_ip_masked": item.client_ip_masked,
            "referrer": item.referrer,
            "created_at": item.created_at.isoformat(),
        }
        for item in logs_res.all()
    ]
    games_data = [
        {
            "game_code": g.game_code,
            "title": g.title,
            "genre": g.genre,
            "support_status": g.support_status,
            "badge_label": g.badge_label,
            "benefit_summary": g.benefit_summary,
        }
        for g in games_res.all()
    ]
    workbook_bytes = build_download_stats_workbook(logs_data, games_data)
    return Response(
        content=workbook_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="unplug_portal_stats.xlsx"'
        },
    )

