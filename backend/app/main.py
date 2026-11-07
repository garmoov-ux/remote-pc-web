"""
원격플러그인 피시 (UNPLUG 원격 PC방) FastAPI 메인 애플리케이션 엔트리포인트입니다.
Lifespan에서 데이터베이스 테이블 자동 생성 및 초기 마스터 시드 데이터를 주입합니다.
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import AsyncSessionLocal, engine
from app.models import Base
from app.routers.auth_router import router as auth_router
from app.routers.download_router import router as download_router
from app.routers.portal_router import router as portal_router
from app.routers.rpc_router import router as rpc_router
from app.schemas.common import ApiResponse
from app.services.portal_service import ensure_initial_seed_data

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """애플리케이션 시작 시 테이블 생성 및 초기 시드 데이터 주입을 수행합니다."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await ensure_initial_seed_data(session)
    yield
    await engine.dispose()


app = FastAPI(
    title="원격플러그인 피시 (UNPLUG 원격 PC방) 포털 및 접속기 관리 API",
    description="전국 70+ 제휴 지점 고사양 원격 PC방 웹 포털, 접속기(unplug_setup.exe) 배포·트래킹 및 관리자 CMS 백엔드 서버",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portal_router)
app.include_router(download_router)
app.include_router(auth_router)
app.include_router(rpc_router)


@app.get(
    "/api/health",
    response_model=ApiResponse[dict[str, Any]],
    tags=["시스템 헬스체크"],
    summary="백엔드 서버 상태 및 버전 확인",
)
async def health_check() -> ApiResponse[dict[str, Any]]:
    """백엔드 API 서버의 정상 구동 여부를 반환합니다."""
    return ApiResponse(
        success=True,
        data={
            "status": "healthy",
            "service": settings.brand_name,
            "version": settings.client_installer_version,
        },
    )

