"""
원격플러그인 피시 (UNPLUG 원격 PC방) 포털 부트스트랩, 게임, 공지사항, FAQ, 릴리스, 다운로드 추적 스키마 모듈입니다.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SiteConfigSchema(BaseModel):
    """사업자 마스터 프로필 및 히어로 스탯 응답 스키마입니다."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    brand_name: str
    brand_sub_name: str
    company_name: str
    ceo_name: str
    business_reg_no: str
    mail_order_reg_no: str
    company_address: str
    cs_phone: str
    kakao_channel_url: str
    contact_email: str
    anydesk_download_url: str
    stat_partner_pc_count: str
    stat_service_game_count: str
    stat_base_minutes_per_10k: str
    stat_avg_wait_minutes: str


class ServiceGameSchema(BaseModel):
    """서비스 게임 카탈로그 항목 스키마입니다."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    game_code: str
    title: str
    genre: str
    thumbnail_url: str
    support_status: str
    badge_label: str
    benefit_summary: str
    is_featured: bool
    display_order: int


class NoticeStepSchema(BaseModel):
    """공지사항 내 단계별 가이드(예: 접속기 정상 종료 2단계) 스키마입니다."""

    step_no: str
    title: str
    description: str


class NoticeItemSchema(BaseModel):
    """공지사항 및 필수 주의사항 스키마입니다."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    badge_text: str
    title: str
    summary: str
    steps_json: list[dict[str, Any]]
    cta_label: str | None = None
    cta_url: str | None = None
    is_pinned: bool
    display_order: int


class FaqItemSchema(BaseModel):
    """자주 묻는 질문(FAQ) 항목 스키마입니다."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    question: str
    answer: str
    display_order: int


class ClientReleaseSchema(BaseModel):
    """접속기 설치 파일 릴리스 정보 스키마입니다."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    version: str
    filename: str
    download_url: str
    fallback_cdn_url: str
    sha256_hash: str
    file_size_label: str
    os_support: str
    release_notes: str
    is_latest: bool


class HowToStepSchema(BaseModel):
    """4단계 이용 순서 가이드(#how) 스키마입니다."""

    step_no: str
    badge: str
    title: str
    description: str
    image_url: str


class WhyFeatureSchema(BaseModel):
    """서비스 핵심 경쟁력(#why) 3대 포인트 스키마입니다."""

    num: str
    title: str
    description: str
    highlight: str


class TeamRoleSchema(BaseModel):
    """개발·운영 전담팀 4대 파트 스키마입니다."""

    role_code: str
    title: str
    subtitle: str
    description: str
    icon_url: str


class TelemetryDataSchema(BaseModel):
    """실시간 가동 상태 및 좌석 텔레메트리 스키마입니다."""

    status: str = "ONLINE"
    status_label: str = "실시간 가동"
    partner_stores: str = "70+"
    supported_games: str = "50+"
    minutes_per_10k: str = "600분"
    avg_wait_minutes: str = "00분"
    active_nodes: int = 74
    available_seats: int = 418
    updated_at: datetime


class PortalBootstrapDataSchema(BaseModel):
    """메인 포털 첫 진입 시 단일 호출로 모든 섹션 데이터를 반환하는 통합 스키마입니다."""

    site_config: SiteConfigSchema
    telemetry: TelemetryDataSchema
    latest_release: ClientReleaseSchema
    how_to_steps: list[HowToStepSchema]
    games: list[ServiceGameSchema]
    why_features: list[WhyFeatureSchema]
    team_roles: list[TeamRoleSchema]
    notices: list[NoticeItemSchema]
    faqs: list[FaqItemSchema]


class DownloadTrackRequest(BaseModel):
    """접속기 다운로드 버튼 클릭 전환 이벤트 기록 요청 스키마입니다."""

    trigger_section: str = Field(
        default="hero_cta",
        description="클릭 발생 위치 (header_nav, hero_cta, quick_flow, download_section, floating_bar)",
    )
    referrer: str = Field(default="", description="유입 레퍼러 URL")


class AdminLoginRequest(BaseModel):
    """관리자 로그인 요청 스키마입니다."""

    username: str = Field(..., min_length=2, max_length=60, description="관리자 아이디")
    password: str = Field(..., min_length=4, max_length=120, description="관리자 비밀번호")


class AdminLoginResponse(BaseModel):
    """관리자 로그인 성공 시 반환되는 토큰 스키마입니다."""

    access_token: str
    token_type: str = "bearer"
    username: str
    expires_in_minutes: int
