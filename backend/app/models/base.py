"""
SQLAlchemy 2.0 DeclarativeBase 및 공통 감사(Audit)·소프트 삭제(Soft Delete) Mixin 모듈입니다.
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utc_now() -> datetime:
    """현재 UTC 시각을 반환합니다."""
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    """전체 ORM 모델의 최상위 선언형 베이스 클래스입니다."""


class TimestampSoftDeleteMixin:
    """생성일시, 수정일시, 활성 여부 및 소프트 삭제 일시를 관리하는 공통 Mixin입니다."""

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None, nullable=True
    )

