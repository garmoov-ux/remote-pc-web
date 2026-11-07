# 공통 개발, 한글 문서화 및 환경 규칙 (Common Rules)

## 1. 한국어(한글) 주석 및 문서 작성 의무화
- **대화 및 설명**: 사용자와의 모든 대화, 에러 원인 분석, 진행 보고서는 한국어를 기본으로 작성한다.
- **소스코드 한글 주석 원칙**:
  - 모든 백엔드(`.py`) 및 프론트엔드(`.ts`, `.tsx`) 파일 상단에는 해당 모듈의 역할을 설명하는 **한글 모듈 주석(또는 Docstring)**을 작성한다.
  - 클래스, 주요 함수, API 라우터(`summary`, `description`), Canvas 파티클 물리 연산, 스크롤 스파이 계산, 접속기 다운로드/전환 추적 로직 등에는 **반드시 한글 독스트링(Docstring / JSDoc)과 한글 인라인 주석**을 작성하여 타 개발자가 코드만 보고도 도메인 규칙을 즉시 이해할 수 있게 한다.
- **문서 한글화 및 최신 동기화 원칙**:
  - `README.md`, `AGENTS.md`, `DESIGNE.md`, 아키텍처 설계서, DB 스키마 명세서, API 문서, 테스트 시나리오 등 프로젝트 내 모든 문서는 **한글로 작성**한다.
  - 신규 도메인 모듈이나 실행 명령어, 환경변수가 추가·변경되면 `README.md`와 `AGENTS.md`를 즉시 한글로 동기화한다.
  - **작업 완료 시 메뉴/섹션별 진행 현황 상시 기록 의무화**: 섹션·메뉴·기능 단위 작업이 끝날 때마다 루트 경로의 [`markdown/00_메뉴별_개발_진행현황.md`](file:///F:/Data/Workspace/remote-pc-web/markdown/00_메뉴별_개발_진행현황.md) 문서 내 **진행 상태 표**와 **작업 완료 이력 로그**를 즉시 최신 상태로 업데이트한다.
- **화면 UI 텍스트 100% 한글 전용 원칙**:
  - 각 섹션의 제목, 배지, 버튼, 탭, 게임 카드 캡션, 주의사항, FAQ, 입력창 플레이스홀더, 안내 문구 등 **화면에 노출되는 모든 텍스트는 한글 전용 원칙**을 기본 준수한다.
- **이모지 금지**: 문서, 코드 주석, 커밋 메시지, UI 텍스트 어디에도 이모지(Emoji)를 사용하지 않는다. 아이콘이 필요한 경우 정교한 인라인 SVG 아이콘(`lucide-react` 또는 커스텀 벡터 SVG)만 사용한다.
- **브라우저 기본 창(`alert`, `confirm`, `prompt`) 전면 금지**: `window.alert`, `window.confirm`, `window.prompt` 등 브라우저 네이티브 다이얼로그는 절대 사용하지 않으며, 모든 안내·확인·입력 동작은 커스텀 모달 컴포넌트(`AppDialogModal.tsx`)로만 제공한다.

## 2. 백엔드·프론트엔드 표준 기술 스택 및 도구
- **백엔드 단일 표준 (`FastAPI`)**:
  - 백엔드 API, 접속기 다운로드/버전 관리 및 관리자 CMS 서버는 반드시 **`Python 3.12+ (uv)` + `FastAPI` + `Pydantic v2` + `SQLAlchemy 2.0 (AsyncSession)` + `Alembic`**을 사용한다.
  - Python 패키지 관리 및 실행은 구형 `pip`, `venv` 대신 반드시 **`uv` (`uv add`, `uv run`)**를 사용한다.
- **데이터베이스 및 인프라 표준**:
  - 메인 RDBMS는 **`PostgreSQL 16`**(경량 로컬 단독 구동 시 `SQLite WAL` 호환), 실시간 좌석/접속자 캐시 및 레이트리밋은 **`Redis 7`**, 컨테이너 인프라는 **`Docker Compose`**를 기본 사용한다.
- **프론트엔드 및 폰트 표준**:
  - 프론트엔드는 **`pnpm` (또는 `npm`) + `React 19 / Next.js` (또는 `Vite 6`) + `TypeScript (strict: true)` + `Tailwind CSS v4`**를 사용한다.
  - 시스템 전체 기본 웹폰트는 **`Pretendard Variable` (`Pretendard`)**을 기본으로 하며, 디스플레이 숫자/텔레메트리 포인트 폰트 및 컬러·곡률·조판은 [`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md)를 엄수한다.
- **윈도우 환경 호환성**: PowerShell 실행 시 UTF-8 인코딩(`[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`)을 항상 고려한다.

## 3. 에이전트 스킬 및 MCP 운용 원칙
- **공용(글로벌) 스킬 (`%USERPROFILE%\.gemini\config\skills\` 및 `%USERPROFILE%\.agents\skills\`)**:
  - 오피스·탐색·Git 6종(`pdf`, `pptx`, `xlsx`, `docx`, `find-skills`, `git-advanced-workflows`) 및 범용 Python 3종(`uv-package-manager`, `python-patterns`, `python-testing-patterns`)을 공용 스킬로 운용한다.
- **프로젝트 로컬 스킬 (`.agents/skills/`)**:
  - 원격 PC방 포털 도메인 및 프레임워크 특화 스킬 17종(`remote-pc-portal-architecture`, `reverse-engineer-anything`, `fastapi-templates`, `sqlalchemy2-alembic`, `async-python-patterns`, `api-design-principles`, `vercel-react-best-practices`, `tailwind-design-system`, `shadcn-ui`, `frontend-design`, `web-design-guidelines`, `i18n-localization`, `seo-audit`, `pdf-lib`, `playwright-best-practices`, `systematic-debugging`, `docker-best-practices`)을 로컬에 격리 운용한다.
- **프로젝트 로컬 MCP (`.agents/mcp_config.json`)**:
  - `rea` (Ghidra 12.1.4 역공학), `postgres` (PostgreSQL MCP), `redis` (Redis MCP), `docker` (Docker MCP) 4종을 프로젝트 로컬 MCP로 연결하여 사용한다.
  - 사용자 승인 없이 임의로 공용 스킬이나 공용 MCP를 추가 설치하지 않는다.

## 4. 엑셀(.xlsx) 및 CSV 데이터 산출물 기본 서식
- 관리자 통계·접속기 다운로드 이력·제휴 PC방 현황 엑셀(`.xlsx`) 생성 시 기본 행높이 25, 맑은 고딕 10pt, 1행 제목 굵게 및 배경색(`#D9E1F2`), 모든 테두리(`#BFBFBF`), 1행 틀 고정(`A2`), 자동 필터, 한글 폭(1.8배) 기준 열 너비 자동 맞춤을 기본 적용한다.
- CSV 입출력 시 윈도우 엑셀 한글 깨짐 방지를 위해 항상 `encoding="utf-8-sig"`를 기본 사용한다.

