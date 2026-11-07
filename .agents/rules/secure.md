# 보안, 환경변수(`.env`) 및 접속기 배포 무결성 규칙 (Security & Environment Rules)

## 1. `.env` 환경변수 및 민감 정보 관리 규칙
- **소스코드 하드코딩 절대 금지**: DB 접속 계정(`DATABASE_URL`), Redis URL(`REDIS_URL`), 관리자 세션/JWT 서명 시크릿(`SECRET_KEY`), 외부 전환 추적 키, 개인키(`.pem`, `.key`)는 소스코드에 절대 하드코딩하지 않고 반드시 `.env` 파일에서 불러온다.
- **Git 추적 차단 및 `.env.example` 동기화 의무**:
  - 실제 설정값이 담긴 `.env`, `.env.local`, `.env.production` 파일은 `.gitignore`에 의해 Git 추적에서 완전히 제외되어야 한다.
  - 코드에 새로운 환경변수가 추가되거나 변경될 때는 반드시 루트의 [`.env.example`](file:///F:/Data/Workspace/remote-pc-web/.env.example)에 **변수명, 안전한 예시(더미) 값, 한글 설명 주석**을 즉시 동기화한다.
- **`pydantic-settings` 중앙 집중 검증 (`backend/app/config.py`)**:
  - 백엔드 비즈니스 코드 곳곳에서 `os.getenv()`를 직접 호출하는 것을 금지한다.
  - 반드시 `app/config.py`의 `Settings(BaseSettings)` 클래스를 통해서만 환경변수를 주입받으며, 서버 기동 시점에 필수 환경변수 누락 여부와 데이터 타입을 엄격히 검증한다.
- **프론트엔드 공개 변수 격리**:
  - 브라우저 번들에 포함되는 프론트엔드 환경변수(`VITE_*` 또는 `NEXT_PUBLIC_*`)에는 API 엔드포인트(`NEXT_PUBLIC_API_BASE_URL`), 접속기 다운로드 기본 경로, 공개 고객센터 연락처 등 공개되어도 무방한 값만 선언하며, 서버 비밀키나 DB 접속 정보는 절대 포함하지 않는다.

## 2. 접속기 설치 파일(`.exe`) 배포 및 링크 보안
- 접속기 설치 파일 다운로드 제공 시 파일 버전(`version`), 파일 크기(`file_size`), `SHA-256` 해시값을 함께 관리하여 위변조 여부를 검증할 수 있게 한다.
- 외부 링크(`https://pf.kakao.com/...`, `https://anydesk.com/...`)를 새 탭(`target="_blank"`)으로 열 때는 탭내핑(Tabnabbing) 공격 방지를 위해 반드시 `rel="noopener noreferrer"` 속성을 명시한다.
- 다운로드 API(`/api/downloads/*`)에는 IP 기반 레이트 리밋(Rate Limiting)을 적용하여 악성 트래픽으로 인한 대역폭 고갈을 방지한다.

## 3. 관리자 인증 및 데이터베이스 안전
- 관리자 비밀번호는 평문 저장을 절대 금지하며 **`Argon2id`** 단방향 해시만 DB에 저장한다.
- 관리자 로그인 5회 연속 실패 시 Redis 카운터 및 TTL(15분)을 활용해 계정을 자동 잠금 처리한다.
- 문자열 포맷팅 SQL 쿼리(`f"SELECT ... WHERE id = '{val}'"`)를 절대 금지하며, 반드시 `SQLAlchemy 2.0` 파라미터 바인딩을 사용한다.
- `DROP TABLE`, `TRUNCATE`, `rm -rf` 같은 파괴적인 명령어는 사용자에게 명시적으로 승인받기 전엔 실행하지 않는다.

