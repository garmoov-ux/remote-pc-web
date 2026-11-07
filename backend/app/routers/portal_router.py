"""
원격플러그인 피시 (UNPLUG 원격 PC방) 공개 포털 조회 라우터 모듈입니다.
부트스트랩 단일 조회, 실시간 텔레메트리 조회, 서비스 게임 필터 조회 엔드포인트를 제공합니다.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db_session
from app.models.portal import ServiceGame
from app.schemas.common import ApiResponse
from app.schemas.portal import (
    PortalBootstrapDataSchema,
    ServiceGameSchema,
    TelemetryDataSchema,
)
from app.services.portal_service import (
    build_telemetry_data,
    get_portal_bootstrap_payload,
)

router = APIRouter(prefix="/api/portal", tags=["포털 공개 API"])


@router.get(
    "/bootstrap",
    response_model=ApiResponse[PortalBootstrapDataSchema],
    summary="포털 전체 섹션 부트스트랩 데이터 단일 조회",
    description="히어로, 4단계 이용순서, 50종 서비스 게임, 핵심 경쟁력, 공지/필수수칙, FAQ, 접속기 릴리스 정보를 한 번에 반환합니다.",
)
async def get_portal_bootstrap(
    session: AsyncSession = Depends(get_db_session),
) -> ApiResponse[PortalBootstrapDataSchema]:
    """포털 초기 진입 시 필요한 모든 도메인 데이터를 조회합니다."""
    payload = await get_portal_bootstrap_payload(session)
    return ApiResponse(success=True, data=payload)


@router.get(
    "/telemetry",
    response_model=ApiResponse[TelemetryDataSchema],
    summary="실시간 가동 상태 및 좌석 텔레메트리 조회",
    description="전국 70+ 제휴 지점 가동 상태, 가용 좌석 수, 대기 시간(00분) 지표를 반환합니다.",
)
async def get_portal_telemetry(
    session: AsyncSession = Depends(get_db_session),
) -> ApiResponse[TelemetryDataSchema]:
    """실시간 가동 지표를 반환합니다."""
    telemetry = await build_telemetry_data(session)
    return ApiResponse(success=True, data=telemetry)


@router.get(
    "/games",
    response_model=ApiResponse[list[ServiceGameSchema]],
    summary="서비스 게임 카탈로그 장르·검색 필터 조회",
    description="장르(MMORPG, 스포츠/FPS, 액션/기타) 및 검색어로 서비스 게임 목록을 조회합니다.",
)
async def list_service_games(
    genre: str | None = Query(default=None, description="장르 필터"),
    keyword: str | None = Query(default=None, description="게임명 검색어"),
    session: AsyncSession = Depends(get_db_session),
) -> ApiResponse[list[ServiceGameSchema]]:
    """조건에 맞는 서비스 게임 목록을 반환합니다."""
    stmt = (
        select(ServiceGame)
        .where(ServiceGame.is_active.is_(True), ServiceGame.deleted_at.is_(None))
        .order_by(ServiceGame.display_order.asc(), ServiceGame.id.asc())
    )
    if genre and genre != "전체":
        stmt = stmt.where(ServiceGame.genre == genre)
    if keyword:
        stmt = stmt.where(ServiceGame.title.contains(keyword.strip()))
    rows = (await session.scalars(stmt)).all()
    return ApiResponse(
        success=True,
        data=[ServiceGameSchema.model_validate(item) for item in rows],
        meta={"count": len(rows)},
    )

