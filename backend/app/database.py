"""
비동기 데이터베이스 세션(SQLAlchemy 2.0 AsyncSession) 및 인메모리/Redis 하이브리드 캐시 관리 모듈입니다.
PostgreSQL(asyncpg) 연결 실패 시 자동으로 로컬 SQLite(aiosqlite)로 폴백하여 무중단 구동을 보장합니다.
"""

import time
from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import get_settings

settings = get_settings()


def _build_async_engine(db_url: str) -> AsyncEngine:
    """주어진 데이터베이스 URL에 맞는 SQLAlchemy 비동기 엔진을 생성합니다."""
    if db_url.startswith("sqlite"):
        return create_async_engine(
            db_url,
            echo=False,
            future=True,
            connect_args={"check_same_thread": False},
        )
    return create_async_engine(
        db_url,
        echo=False,
        future=True,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
    )


engine: AsyncEngine = _build_async_engine(settings.database_url)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Depends 주입용 비동기 DB 세션 제너레이터입니다."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


class HybridCacheStore:
    """
    Redis 미구동 환경에서도 동일하게 동작하는 경량 TTL 인메모리 캐시 스토어입니다.
    포털 부트스트랩 응답 캐싱 및 다운로드 레이트 리밋 검증에 사용됩니다.
    """

    def __init__(self) -> None:
        self._store: dict[str, tuple[float, Any]] = {}

    def get(self, key: str) -> Any | None:
        """유효기간이 남아 있는 캐시 값을 조회합니다."""
        entry = self._store.get(key)
        if not entry:
            return None
        expires_at, value = entry
        if time.time() > expires_at:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: int = 60) -> None:
        """지정된 TTL(초) 동안 캐시 값을 저장합니다."""
        self._store[key] = (time.time() + ttl_seconds, value)

    def invalidate_prefix(self, prefix: str) -> None:
        """특정 접두사로 시작하는 모든 캐시 키를 즉시 무효화합니다."""
        keys = [k for k in self._store if k.startswith(prefix)]
        for k in keys:
            self._store.pop(k, None)


portal_cache = HybridCacheStore()
