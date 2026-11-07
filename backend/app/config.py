"""
원격플러그인 피시 (UNPLUG 원격 PC방) 백엔드 환경 설정 모듈입니다.
.env 또는 시스템 환경변수에서 마스터 프로필, 데이터베이스, 캐시, 보안 설정을 로드합니다.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 전역 환경 설정 클래스입니다."""

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # 1. 애플리케이션 기본 설정
    app_env: str = "development"
    app_port: int = 8000
    app_secret_key: str = "unplug-remote-pc-secret-key-2026-secure-token"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # 2. 사업자 및 서비스 마스터 프로필 기본값
    brand_name: str = "원격플러그인 피시"
    brand_sub_name: str = "UNPLUG 원격 PC방"
    company_name: str = "언플러그"
    ceo_name: str = "차수빈"
    business_reg_no: str = "240-18-02372"
    mail_order_reg_no: str = "제 2025-김해장유-0356 호"
    company_address: str = "경상남도 김해시 대청로 210번길 24"
    cs_phone: str = "010-3470-8716"
    kakao_channel_url: str = "https://pf.kakao.com/_Ypsan"
    contact_email: str = "pueen123@naver.com"
    anydesk_download_url: str = "https://anydesk.com/ko/downloads"

    # 3. 접속기 다운로드 설정
    client_installer_filename: str = "unplug_setup.exe"
    client_installer_version: str = "v2.4.0"
    client_installer_local_path: str = "./storage/releases/unplug_setup.exe"
    client_installer_fallback_url: str = "https://unplug.co.kr/down/unplug_setup.exe"
    client_installer_sha256: str = (
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    )

    # 4. 데이터베이스 및 캐시 설정 (기본값: 로컬 무설치 구동을 위한 SQLite 비동기 엔진)
    database_url: str = "sqlite+aiosqlite:///./remote_pc_web.db"
    redis_url: str = "redis://localhost:6379/0"

    # 5. 관리자 초기 계정 설정
    admin_initial_username: str = "admin"
    admin_initial_password: str = "unplug2026!@"
    jwt_access_token_expire_minutes: int = 720

    @property
    def cors_origin_list(self) -> list[str]:
        """쉼표로 구분된 CORS 허용 오리진 문자열을 리스트로 변환합니다."""
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    """캐싱된 전역 설정 인스턴스를 반환합니다."""
    return Settings()
