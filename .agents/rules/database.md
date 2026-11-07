# 데이터베이스, SQLAlchemy 2.0 비동기 및 Alembic 마이그레이션 규칙 (Database Rules)

## 1. 표준 테이블 기본 컬럼 및 Soft Delete 원칙
- 모든 핵심 도메인 테이블(`games`, `notices`, `faqs`, `partner_branches`, `client_releases`, `site_configs`, `admin_users` 등)은 `app/models/base.py`의 `TimestampSoftDeleteMixin`을 상속하여 아래 표준 컬럼을 반드시 포함한다:
  - `id`: 기본키 (`BigInteger` 또는 `UUID`)
  - `created_at`: 생성 일시 (`DateTime(timezone=True)`, `server_default=func.now()`)
  - `updated_at`: 수정 일시 (`DateTime(timezone=True)`, `onupdate=func.now()`)
  - `is_deleted`: 논리 삭제 여부 (`Boolean`, `default=False`, 인덱스 포함)
  - `deleted_at`: 논리 삭제 일시 (`DateTime(timezone=True)`, `nullable=True`)
- 접속기 다운로드 로그(`download_logs`) 및 관리자 감사 로그(`audit_logs`)는 물리적 `DELETE` 쿼리를 금지하며, 통계 및 보안 추적을 위해 불변(Immutable) 상태로 보존한다.

## 2. SQLAlchemy 2.0 비동기(`AsyncSession`) 필수 수칙
- `async_sessionmaker` 설정 시 커밋 후 속성 접근 시 발생하는 `MissingGreenlet` 예외를 원천 차단하기 위해 반드시 `expire_on_commit=False`를 지정한다.
- 비동기 환경에서 암묵적 지연 로딩(Lazy Loading)은 금지한다. 연관 엔티티가 필요한 경우 쿼리 작성 시 `selectinload()` 또는 `joinedload()`로 명시적 즉시 로딩(Eager Loading)을 수행한다.
- 모든 쿼리는 `SQLAlchemy 2.0` 표준인 `select(Model).where(...)` 구문을 사용하며, 레거시 `session.query(Model)` 구문은 사용하지 않는다.

## 3. PostgreSQL 16 JSONB 스키마 및 인덱스 규칙
- 사이트 테마/운영 설정(`site_configs.config_data`), 게임별 추가 메타데이터(`games.extra_meta` — 장르 태그, 권장 사양, PC방 혜택 요약), 접속기 릴리스 노트(`client_releases.release_meta`)는 `PostgreSQL JSONB` 타입으로 선언한다.
- 모든 `JSONB` 데이터 저장 시 향후 스키마 변경에 안전하게 대응할 수 있도록 `schema_version` (예: `1`)을 포함한다.
- 노출 순서(`display_order`)와 활성화 여부(`is_active`)로 정렬·필터링되는 테이블(`games`, `faqs`, `notices`)에는 복합 인덱스(`ix_games_active_order` 등)를 생성한다.

## 4. Alembic 마이그레이션 운용 원칙
- 데이터베이스 스키마 변경 시 수동 DDL(`ALTER TABLE` 직접 실행)에 의존하지 않고, 반드시 `Alembic` 리비전을 생성하여 이력을 관리한다.
- 마이그레이션 생성 명령: `uv run alembic revision --autogenerate -m "<도메인_변경_한글_요약>"`
- 생성된 마이그레이션 파일(`migrations/versions/*.py`)은 적용(`uv run alembic upgrade head`) 전에 반드시 `upgrade()`와 `downgrade()` 함수를 검토하여 의도치 않은 컬럼/테이블 삭제가 없는지 확인한다.

