"""
원격플러그인 피시 (UNPLUG 원격 PC방) 핵심 도메인 ORM 모델 모듈입니다.
사이트 설정, 서비스 게임 카탈로그, 공지/필수 주의사항, FAQ, 접속기 릴리스, 다운로드 로그 테이블을 정의합니다.
"""

from typing import Any

from sqlalchemy import JSON, Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampSoftDeleteMixin


class SiteConfig(Base, TimestampSoftDeleteMixin):
    """포털 사업자 마스터 정보 및 상단 히어로 실시간 지표를 관리하는 테이블입니다."""

    __tablename__ = "site_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    brand_name: Mapped[str] = mapped_column(String(100), nullable=False)
    brand_sub_name: Mapped[str] = mapped_column(String(100), nullable=False)
    company_name: Mapped[str] = mapped_column(String(100), nullable=False)
    ceo_name: Mapped[str] = mapped_column(String(60), nullable=False)
    business_reg_no: Mapped[str] = mapped_column(String(40), nullable=False)
    mail_order_reg_no: Mapped[str] = mapped_column(String(80), nullable=False)
    company_address: Mapped[str] = mapped_column(String(255), nullable=False)
    cs_phone: Mapped[str] = mapped_column(String(40), nullable=False)
    kakao_channel_url: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(120), nullable=False)
    anydesk_download_url: Mapped[str] = mapped_column(String(255), nullable=False)
    stat_partner_pc_count: Mapped[str] = mapped_column(String(30), default="70+")
    stat_service_game_count: Mapped[str] = mapped_column(String(30), default="50+")
    stat_base_minutes_per_10k: Mapped[str] = mapped_column(String(30), default="600분")
    stat_avg_wait_minutes: Mapped[str] = mapped_column(String(30), default="00분")
    extra_meta: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)


class ServiceGame(Base, TimestampSoftDeleteMixin):
    """PC방 프리미엄 혜택이 제공되는 서비스 게임 카탈로그 테이블입니다."""

    __tablename__ = "service_games"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    game_code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    genre: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    thumbnail_url: Mapped[str] = mapped_column(String(255), nullable=False)
    support_status: Mapped[str] = mapped_column(
        String(30), default="available", nullable=False
    )  # available | direct | restricted
    badge_label: Mapped[str] = mapped_column(String(60), default="PC방 프리미엄")
    benefit_summary: Mapped[str] = mapped_column(String(255), default="집에서 PC방 혜택 동일 적용")
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=100, nullable=False)


class NoticeItem(Base, TimestampSoftDeleteMixin):
    """접속기 정상 종료 방법, 20분 의무 사용, 원격지원 등 필수 공지 및 주의사항 테이블입니다."""

    __tablename__ = "notice_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    badge_text: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    steps_json: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    cta_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=10, nullable=False)


class FaqItem(Base, TimestampSoftDeleteMixin):
    """자주 묻는 질문(FAQ) 아코디언 항목을 관리하는 테이블입니다."""

    __tablename__ = "faq_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(40), default="일반", nullable=False)
    question: Mapped[str] = mapped_column(String(255), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=10, nullable=False)


class ClientRelease(Base, TimestampSoftDeleteMixin):
    """원격 접속기(unplug_setup.exe) 배포 버전 및 무결성 해시를 관리하는 테이블입니다."""

    __tablename__ = "client_releases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    version: Mapped[str] = mapped_column(String(40), nullable=False)
    filename: Mapped[str] = mapped_column(String(120), nullable=False)
    download_url: Mapped[str] = mapped_column(String(255), nullable=False)
    fallback_cdn_url: Mapped[str] = mapped_column(String(255), nullable=False)
    sha256_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    file_size_label: Mapped[str] = mapped_column(String(40), default="48.6 MB")
    os_support: Mapped[str] = mapped_column(
        String(100), default="Windows 10 / 11 (64-bit)"
    )
    release_notes: Mapped[str] = mapped_column(Text, default="")
    is_latest: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class DownloadLog(Base, TimestampSoftDeleteMixin):
    """접속기 다운로드 및 CTA 버튼 전환 추적 로그 테이블입니다."""

    __tablename__ = "download_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trigger_section: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    release_version: Mapped[str] = mapped_column(String(40), nullable=False)
    client_ip_masked: Mapped[str] = mapped_column(String(64), default="0.0.0.0")
    user_agent: Mapped[str] = mapped_column(String(255), default="")
    referrer: Mapped[str] = mapped_column(String(255), default="")
