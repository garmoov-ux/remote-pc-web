---
name: sqlalchemy2-alembic
description: FastAPI 및 Python 환경에서 SQLAlchemy 2.0 비동기(Async) 세션 관리, DB 마이그레이션(Alembic) 안전한 스키마 변경, MySQL/SQLite 데이터 유실 방지 스킬.
---

# SQLAlchemy 2.0 & Alembic DB 마이그레이션 스킬

## 핵심 패턴

1. **SQLAlchemy 2.0 AsyncSession 연동**:
   - `async_sessionmaker` 및 `create_async_engine`을 사용하여 비동기 DB 커넥션 풀을 안전하게 관리합니다.
   - `select()` 객체 지향 쿼리를 엄격 준수합니다.

2. **안전한 Alembic DB 마이그레이션**:
   - 스키마 변경 시 기존 테이블 데이터를 파괴(DROP)하지 않고 `alembic revision --autogenerate -m "메시지"`를 통해 변경 이력을 추적합니다.
   - 컬럼 타입 변경 시 데이터 하위 호환성을 유지합니다.

## SQLAlchemy 2.0 Async 예시

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select

engine = create_async_engine("sqlite+aiosqlite:///./test.db", echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_device_by_id(db: AsyncSession, device_id: int):
    stmt = select(DeviceModel).where(DeviceModel.id == device_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
```
