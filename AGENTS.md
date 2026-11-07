# AGENTS.md - 원격 PC방 웹 포털 및 접속기 배포·관리 시스템 마스터 지침서

- **작성 기준일**: 2026-11-07
- **레퍼런스 기준**: [`_실무레퍼런스`](file:///F:/Data/Workspace/remote-pc-web/_실무레퍼런스/00_작성규칙_및_전체목차_가이드.md) 및 [`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md) 전 영역 표준 준수 (한글 주석·한글 문서화 필수, 이모지 전면 금지, 선제적 모듈 분할로 사후 리팩토링 원천 차단)
- **벤치마크 분석 대상**:
  - **1순위 메인 타깃**: `https://xn--i89awyn2tbmlqye52ae90ecla.kr/#games` (`원격플러그인피시.kr` — 원격플러그인 피시 원격 PC방 // ACCESS GRID)
  - **2순위 연계 타깃**: `https://unplug.co.kr/` (`UNPLUG 원격 PC방` — 접속기 패키지 배포 및 상세 운영 안내)

---

## 0. 기본 서비스 및 사업자 마스터 프로필 (Service Master Profile)

본 원격 PC방 웹 포털의 상단 헤더, 고객센터 섹션, 하단 푸터, 접속기 다운로드 안내에는 아래 마스터 정보를 기본 시드 데이터로 적용하며, 환경변수(`.env`) 및 관리자 설정(`site_configs`)에서 코드 수정 없이 변경할 수 있도록 설계합니다.

- **서비스 브랜드명**: 원격플러그인 피시 (UNPLUG 원격 PC방)
- **상호 / 대표자**: 언플러그 / 차수빈
- **사업자등록번호**: `240-18-02372`
- **통신판매업신고번호**: `제 2025-김해장유-0356 호`
- **사업장 소재지**: 경상남도 김해시 대청로 210번길 24
- **24시간 고객센터 전화 / 문자**: `010-3470-8716` (365일 연중무휴 실시간 대응)
- **카카오톡 실시간 상담 채널**: `https://pf.kakao.com/_Ypsan`
- **대표 이메일**: `pueen123@naver.com`
- **접속기 설치 파일 기본 경로**: `/api/downloads/client` (기본 파일명 `unplug_setup.exe`, 외부 CDN 폴백 `https://unplug.co.kr/down/unplug_setup.exe`)
- **원격지원 도구 안내**: `AnyDesk` 공식 접속기 (`https://anydesk.com/ko/downloads`)

---

## 1. 핵심 커스터마이징 및 엔지니어링 절대 원칙

### 1.1. 디자인 시스템 및 타이포그래피 ([`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md) + `Pretendard Variable`)
모든 UI/UX 설계와 컴포넌트 스타일링은 워크스페이스 루트의 **[`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md)**를 기준으로 구현합니다.
- **표준 웹폰트 (`Pretendard Variable`)**:
  - 전 화면의 한글 헤딩, 본문, 게임 캡션, 주의사항, FAQ, 관리자 화면은 **`Pretendard Variable` (`Pretendard`)**을 기본 폰트로 적용합니다 (`word-break: keep-all`).
  - 히어로 스탯 수치(`70+`, `50+`, `600분`, `0분`)와 섹션 인덱스 번호는 디스플레이/고정폭 폰트(`Orbitron`, `JetBrains Mono`)와 조화롭게 결합합니다.
- **사이버 HUD 다크 그리드 & 웜 글래스 듀얼 테마 토큰**:
  - **Void (`#0A0A0F`) & Panel (`#101019`)**: 몰입감 높은 딥 다크 게이밍 배경과 챔퍼(Chamfer) 컷팅 패널
  - **Cyan (`#00E5FF`) & Magenta (`#FF2E97`) & Lime (`#B4FF39`)**: HUD 테두리 글로우, 홀로그램 샤인 다운로드 CTA 버튼, 실시간 가동 인디케이터 포인트
  - **Canvas 2D 네트워크 파티클 & 스캔라인 배경**: 고해상도 DPI(`devicePixelRatio`) 대응 실시간 노드 연결망 배경을 적용하되, `prefers-reduced-motion: reduce` 환경에서는 즉시 정적 프레임으로 전환합니다.

### 1.2. 선제적 분할 작성 및 한글 주석·문서화 원칙 ([`common.md`](file:///F:/Data/Workspace/remote-pc-web/.agents/rules/common.md), [`code-architecture.md`](file:///F:/Data/Workspace/remote-pc-web/.agents/rules/code-architecture.md))
- **추후 리팩토링이 필요 없는 선제적 분할 작성 (Pre-Split Modularity)**:
  - 일단 한 파일에 길게 작성한 뒤 나중에 분리하는 "선 작성 후 리팩토링" 방식을 전면 금지합니다.
  - 최초 코드 작성 시점부터 프론트엔드는 `page.tsx`(150행 이내 조립 전용), `components/layout/`, `components/background/`, `components/sections/`(히어로, 이용안내, 게임카탈로그, 서비스특징, 공지/고객센터, FAQ, 다운로드 개별 파일 분리), `components/admin/`, `hooks/`, `services/`, `constants/`, `types/`로 나누어 생성합니다.
  - 백엔드(`FastAPI`)는 `models/`, `schemas/`, `routers/`(150행 이내), `services/`, `utils/`로 처음부터 분할 작성합니다.
- **한글 주석 및 한글 문서화 의무화**:
  - 모든 `.py`, `.ts`, `.tsx` 파일 상단 모듈 요약, 클래스/함수 독스트링(Docstring / JSDoc), 비즈니스 로직 인라인 주석, FastAPI OpenAPI 명세(`summary`, `description`)는 **반드시 한국어(한글)**로 작성합니다.
  - **이모지(Emoji) 전면 금지**: 문서, 코드 주석, 커밋 메시지, 화면 UI 어디에도 이모지를 사용하지 않으며, 정교한 SVG 벡터 아이콘만 사용합니다.
  - **브라우저 기본 다이얼로그(`alert`, `confirm`, `prompt`) 전면 금지**: 모든 알림·설치 안내·관리자 확인 창은 반드시 커스텀 UI 모달(`AppDialogModal.tsx`)로만 구현합니다.
  - **섹션/메뉴별 개발 진행 현황 상시 기록 ([`markdown/00_메뉴별_개발_진행현황.md`](file:///F:/Data/Workspace/remote-pc-web/markdown/00_메뉴별_개발_진행현황.md))**: 각 섹션·기능·관리자 모듈 작업이 완료될 때마다 반드시 루트 경로의 `markdown/00_메뉴별_개발_진행현황.md` 파일에 완료 여부와 작업 이력을 즉시 갱신합니다.

---

## 2. 구현 대상 8대 핵심 도메인 및 섹션 아키텍처

1. **상단 고정 HUD 네비게이션 및 모바일 오버레이 (`HeaderNav`, `MobileMenuOverlay`)**
   - **역할**: 브랜드 아이덴티티(`원격플러그인 피시` + `실시간 가동` 상태 점), 5대 핵심 섹션 스무스 스크롤 이동(`#how` 원격PC방, `#games` 서비스게임, `#why` 서비스특징, `#notice` 공지사항, `#faq` 자주 묻는 질문), 스크롤 스파이(`is-active`) 하이라이트, 우측 `접속기 설치` 즉시 다운로드 버튼 및 모바일 전체화면 드로어 메뉴를 제공합니다.
2. **히어로 섹션 & 실시간 텔레메트리 HUD & 무상담 3단계 배너 (`HeroSection`, `QuickFlowBanner`)**
   - **역할**: `"PC방 그 사양 그대로, 자리만 내 방으로"` 핵심 가치 전달, 상담·예약·대기 없이 즉시 연결되는 3단계 플로우(`1. 접속기 설치 -> 2. 프로그램 내 회원가입 -> 3. 충전 후 즉시 게임`), 4대 핵심 운영 지표(`전국 70+ 제휴 PC방`, `50+ 서비스 게임`, `1만원 기준 600분`, `대기 시간 00분`)를 시각화합니다.
3. **원격PC방 4단계 이용 순서 가이드 (`HowToUseSection` — `#how`)**
   - **역할**: 초보자도 문의 없이 1분 만에 시작할 수 있도록 4단계 작동 시퀀스(`01 접속기 설치 및 충전`, `02 전국 빈 좌석 자동 연결`, `03 집에서 고사양 원격 플레이`, `04 사용한 시간만 분 단위 자동 차감`)를 시각적 일러스트/프리뷰 카드와 함께 안내합니다.
4. **서비스 게임 카탈로그 및 실시간 검색/필터 (`GamesCatalogSection` — `#games`)**
   - **역할**: PC방 프리미엄 혜택이 그대로 적용되는 주요 인기 게임(`리니지`, `피파온라인`, `메이플스토리`, `로스트아크`, `스페셜포스`, `서든어택`, `슬러거`, `마비노기`, `검은사막`, `디아블로4`, `오버워치2`, `바람의나라` 등 50여 종)을 고밀도 반응형 카드 그리드(데스크톱 6열 / 태블릿 4열 / 모바일 2열)로 제공합니다.
   - **확장 기능**: 장르 탭 필터(`전체`, `MMORPG`, `스포츠/FPS`, `액션/기타`), 한글 초성 실시간 검색, 지원 가능 게임(`로스트아크·메이플 바로접속`) 및 보안 정책상 제한 게임(`던파·롤·발로란트 이용 불가`) 명확 고지 배너를 포함합니다.
5. **서비스 핵심 경쟁력 및 개발·운영 전담팀 (`WhyChooseSection` — `#why`)**
   - **역할**: 전국 70여 개 제휴 지점이 연결된 3대 핵심 경쟁력(`01 자체 기술팀 직접 개발·운영`, `02 365일 24시간 실시간 상담`, `03 렉 없는 자체 스트리밍 최적화`)과 4대 전담 파트(`서비스 개발`, `인프라·최적화`, `서비스 운영`, `고객 지원`)를 소개하여 서비스 신뢰도를 높입니다.
6. **공지사항·필수 주의사항·원격지원·24시간 고객센터 (`NoticeAndCareSection` — `#notice`)**
   - **역할**: 이용자 과실로 인한 시간 차감이나 계정 문제를 예방하는 핵심 운영 수칙과 즉각적인 고객지원 채널을 제공합니다.
   - **필수 수칙 3종**:
     1. **접속기 정상 종료 방법 (2단계)**: `01 원격PC 종료 및 원격창 닫기` -> `02 접속기에서 로그아웃 버튼 누르기`
     2. **20분 의무 사용 안내**: 계정 보호를 위한 권장 20분 이상 사용(최소 10분 필수) 안내
     3. **원격지원 프로그램 (`AnyDesk`)**: 원격 기술 지원 요청 시 AnyDesk 설치 후 9~10자리 번호 전달 안내
   - **24시간 고객센터 카드**: 대표 번호(`010-3470-8716`), 문자 상담, 카카오톡 실시간 상담(`https://pf.kakao.com/_Ypsan`) 원클릭 연결을 제공합니다.
7. **자주 묻는 질문 아코디언 (`FaqSection` — `#faq`)**
   - **역할**: 무상담 즉시 시작 여부, 원격PC방의 정확한 원리, 렉/끊김 최적화, 요금 및 보너스 시간 체계(`1만원 기준 600분(10시간) 충전`, 대량 충전 보너스, 분 단위 차감, 무약정), 장애 대응 방법을 아코디언 UI와 검색 필터로 제공합니다.
8. **접속기 패키지 다운로드·플로팅 상담 바·관리자 CMS (`DownloadCtaSection`, `FloatingConsultBar`, `AdminCms`)**
   - **역할**: 하단 접속기 설치 패키지 다운로드 카드, 설치 전 체크리스트 모달(실행 중인 게임 종료 안내, 파일 버전/해시 안내), 우측 하단 고정 실시간 상담 위젯(카카오톡 + 전화 연결), 그리고 관리자가 게임 목록·공지사항·FAQ·접속기 버전·다운로드 통계를 웹에서 관리할 수 있는 백엔드 API 및 관리자 화면을 제공합니다.

---

## 3. 워크스페이스 확정 기술 스택 (Confirmed Tech Stack)

- **프론트엔드 (`frontend/`)**:
  - `React 19 + Next.js 15/16 (App Router) 또는 Vite 6 + TypeScript 5 (strict: true) + Tailwind CSS v4 + lucide-react`
  - **기본 웹폰트**: `Pretendard Variable` (`Pretendard`) + 디스플레이 숫자(`Orbitron`, `JetBrains Mono`)
  - **디자인 토큰**: [`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md) 사이버 HUD 그리드(`#0A0A0F`, `#101019`, `#00E5FF`, `#FF2E97`, `#B4FF39`) & 웜 다크 글래스 듀얼 테마
- **백엔드 (`backend/`)**:
  - `Python 3.12+ (uv)` + **`FastAPI`** (포털 부트스트랩 `/api/portal/*` + 접속기 다운로드/전환 추적 `/api/downloads/*` + 관리자 JSON-RPC `/api/rpc` + 인증 `/api/auth/*`) + `Pydantic v2`
  - **보안 및 인증**: `Argon2id` 비밀번호 해싱, 관리자 JWT/세션 쿠키, 다운로드 레이트 리밋 및 SHA-256 파일 무결성 검증
- **데이터베이스 및 캐시**:
  - **메인 RDBMS**: **`PostgreSQL 16`** + `SQLAlchemy 2.0 (AsyncSession)` + `asyncpg` + `Alembic` (단독 경량 배포 시 `SQLite WAL` 호환 지원)
  - **인메모리 캐시**: **`Redis 7`** (`redis.asyncio` — 포털 부트스트랩 고속 캐시, 실시간 좌석/대기시간 지표 캐시, 다운로드 레이트 리밋, 로그인 실패 잠금 TTL)
- **문서 및 통계 리포트**:
  - **엑셀(`.xlsx`) 및 CSV**: `openpyxl` (일자별 접속기 다운로드 통계, 유입 경로 분석, 서비스 게임 목록 엑셀 다운로드)
- **컨테이너 인프라**:
  - **`Docker Compose`** (`postgres:16-alpine` + `redis:7-alpine` + `backend` + `frontend` + `Caddy/Nginx`)

---

## 4. 선제적 분할(Pre-Split) 디렉터리 구조 표준

파일 비대화로 인한 사후 리팩토링이 발생하지 않도록 처음부터 도메인·역할별로 세분화하여 작성합니다.

```plaintext
remote-pc-web/
├── .env.example                     # 환경변수 표준 템플릿 (한글 주석 포함, .env는 커밋 금지)
├── .gitattributes                   # 윈도우(CRLF) / 리눅스 컨테이너(LF) 줄바꿈 표준화
├── .gitignore                       # Git 추적 제외 규칙 (.env, 빌드 산출물, 대용량 .exe 제외)
├── AGENTS.md                        # 프로젝트 아키텍처 및 에이전트 마스터 지침서 (한글)
├── DESIGNE.md                       # 사이버 HUD & 웜 다크 글래스 디자인 시스템 명세서 (한글)
├── README.md                        # 프로젝트 개요, 기술 스택, 디렉터리 구조, 실행 가이드 (한글)
├── docker-compose.yml               # PostgreSQL 16 + Redis 7 + FastAPI + Frontend 통합 구성
├── markdown/                        # 섹션·메뉴별 개발 진행 현황 및 작업 완료 이력 상시 기록 폴더
│   └── 00_메뉴별_개발_진행현황.md   # 전 섹션·기능 구현 진척도 및 작업 로그 마스터 문서
├── _실무레퍼런스/                   # 스킬, MCP, 기술스택, 오픈소스, 치트시트 마스터 레퍼런스
├── .agents/
│   ├── hooks.json                   # PreToolUse 위험 명령어(DROP TABLE, rm -rf 등) 사전 차단 훅
│   ├── mcp_config.json              # 프로젝트 로컬 MCP 4종 (rea, postgres, redis, docker)
│   ├── rules/                       # 상시 적용 세부 규칙 (7종)
│   │   ├── common.md                # 한글 주석/문서화, 이모지 금지, FastAPI/Pretendard 표준
│   │   ├── code-architecture.md     # 선제적 모듈 분할(리팩토링 방지), 반응형 브레이크포인트, Canvas 최적화
│   │   ├── database.md              # SQLAlchemy 2.0 AsyncSession, JSONB 스키마, Alembic, Soft Delete 규칙
│   │   ├── api-protocol.md          # /api/portal, /api/downloads, /api/rpc 분리 및 표준 응답 엔벨로프
│   │   ├── git-commit.md            # Conventional Commits (<type>(<scope>): 한글요약) 및 윈도우 Git 설정
│   │   ├── secure.md                # .env 환경변수 관리, 접속기 .exe 무결성, 외부 링크 보안 규칙
│   │   └── testing.md               # pytest 및 Playwright E2E 섹션별 검증 원칙
│   ├── scripts/
│   │   └── check_command.py         # hooks.json 연동 위험 명령어 검증 스크립트
│   └── skills/                      # 프로젝트 로컬 전용 스킬 (17종)
│       └── remote-pc-portal-architecture/ # 원격 PC방 웹 포털 전용 도메인 아키텍처 스킬
├── backend/                         # FastAPI 백엔드 서버 (Python 3.12 + uv)
│   ├── app/
│   │   ├── main.py                  # FastAPI 앱 초기화 및 미들웨어/라우터 등록 (150행 이내)
│   │   ├── config.py                # Pydantic Settings 환경설정
│   │   ├── database.py              # PostgreSQL AsyncSession 및 Redis 연결 관리
│   │   ├── models/                  # 도메인별 SQLAlchemy 2.0 모델 분리 (game, notice, faq, release, stats)
│   │   ├── schemas/                 # 도메인별 Pydantic v2 요청/응답 스키마 분리
│   │   ├── routers/                 # 도메인별 API 엔드포인트 분리 (각 파일 150행 이내)
│   │   ├── services/                # 도메인별 비즈니스 로직 및 캐시/트래킹 처리 (각 파일 250행 이내)
│   │   ├── seeds/                   # 초기 50+ 서비스 게임, 4단계 가이드, 주의사항, FAQ 시드 데이터
│   │   └── utils/                   # SHA-256 해시 검증 및 엑셀 통계 출력 유틸리티
│   ├── migrations/                  # Alembic DB 마이그레이션
│   ├── tests/                       # pytest 단위/통합 테스트
│   └── pyproject.toml               # uv 의존성 설정
└── frontend/                        # React 19 / Next.js + Tailwind CSS v4 + Pretendard Variable
    ├── public/
    │   └── images/                  # 히어로 배경, 4단계 스텝 일러스트, 게임 썸네일 에셋
    └── src/
        ├── app/ (또는 pages/)       # 라우트 엔트리 (메인 포털 `/` 및 관리자 `/admin`, 각 150행 이내)
        ├── components/
        │   ├── layout/              # HeaderNav, MobileMenuOverlay, SiteFooter, FloatingConsultBar
        │   ├── background/          # NetworkCanvasBg, CyberGridOverlay
        │   ├── sections/            # HeroSection, QuickFlowBanner, HowToUseSection, GamesCatalogSection, WhyChooseSection, NoticeAndCareSection, FaqSection, DownloadCtaSection
        │   ├── common/              # AppDialogModal, InstallGuideModal, GameStatusBadge
        │   └── admin/               # 게임·공지·FAQ·릴리스 관리 컴포넌트
        ├── hooks/                   # useScrollSpy, useRevealOnScroll, useClientDownload, useGamesFilter
        ├── services/                # FastAPI 백엔드 호출 및 오프라인 폴백 클라이언트
        ├── constants/               # portalData.ts (초기 게임/공지/FAQ/사업자 시드 데이터)
        ├── types/                   # portal.ts (엄격한 TypeScript 인터페이스)
        └── utils/                   # 한글 초성 검색기(choseongSearch.ts), 숫자/날짜 포맷터
```

---

## 5. AI 에이전트 확장 생태계 (공용/프로젝트 Skills & MCP)

에이전트는 작업 도메인에 맞춰 아래 **공용/프로젝트 MCP 서버**와 **공용/프로젝트 스킬(`SKILL.md`)**을 적극적으로 로드하여 활용합니다.

### 5.1. 공용(전역) MCP 서버 및 프로젝트 로컬 MCP ([`.agents/mcp_config.json`](./.agents/mcp_config.json))

| 구분 | MCP 서버명 | 주요 도구 및 설정 | 활용 시점 및 목적 |
| :--- | :--- | :--- | :--- |
| **공용(전역) MCP** | **`context7`** | `resolve-library-id`, `query-docs` | FastAPI, SQLAlchemy 2.0, React 19, Next.js 16, Tailwind CSS v4 등 외부 라이브러리 최신 공식 문서 및 API 스펙 조회 |
| **공용(전역) MCP** | **`playwright`** | `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_take_screenshot` 등 | 원격 PC방 포털 UI 렌더링 확인, 스크롤 스파이/게임 검색/FAQ 아코디언/모바일 메뉴 E2E 셀프 검증, 콘솔 에러 디버깅 |
| **공용(전역) MCP** | **`sequential-thinking`** | `sequentialthinking` | 포털 아키텍처 설계, 반응형 레이아웃 최적화, 복합 상태 및 비동기 트래킹 설계 |
| **프로젝트 로컬 MCP** | **`rea`** | `rea-agents@6.7.0` + Ghidra 12.1.4 | 벤치마크 사이트 번들 및 원격 접속기 클라이언트(`.exe`) 바이너리/프로토콜 역공학 분석 |
| **프로젝트 로컬 MCP** | **`postgres`** | `@modelcontextprotocol/server-postgres` | `PostgreSQL 16` DB(`postgresql://postgres:password@localhost:5432/remote_pc_web`) 테이블 스키마 및 시드 데이터 실시간 검증 |
| **프로젝트 로컬 MCP** | **`redis`** | `@modelcontextprotocol/server-redis` | `Redis 7` (`redis://localhost:6379`) 포털 부트스트랩 캐시, 실시간 좌석 상태 지표 및 레이트 리밋 키 검증 |
| **프로젝트 로컬 MCP** | **`docker`** | `@modelcontextprotocol/server-docker` | 로컬 Docker 컨테이너(`postgres`, `redis`, `backend`, `frontend`) 구동 상태 및 실시간 로그 진단 |

### 5.2. 공용(Built-in / 글로벌) 스킬 및 프로젝트 전용 스킬 ([`.agents/skills/`](./.agents/skills/))

관련 도메인 작업 수행 전 반드시 해당 `SKILL.md`를 열람하여 표준 패턴을 준수합니다.

| 구분 | 스킬 이름 | 경로 / 출처 | 적용 도메인 및 활용 목적 |
| :--- | :--- | :--- | :--- |
| **프로젝트 (핵심 도메인)** | **`remote-pc-portal-architecture`** | [`.agents/skills/remote-pc-portal-architecture/SKILL.md`](./.agents/skills/remote-pc-portal-architecture/SKILL.md) | **원격 PC방 포털 8대 섹션, Canvas 파티클 배경, 50+ 게임 카탈로그, 주의사항/AnyDesk/고객센터, 접속기 다운로드 표준 설계** |
| **프로젝트 (역공학)** | `reverse-engineer-anything` | [`.agents/skills/reverse-engineer-anything/SKILL.md`](./.agents/skills/reverse-engineer-anything/SKILL.md) | 벤치마크 페이지, 스크립트 및 클라이언트 설치 패키지 정밀 역공학 |
| **프로젝트 (Frontend)** | `vercel-react-best-practices` | [`.agents/skills/vercel-react-best-practices/SKILL.md`](./.agents/skills/vercel-react-best-practices/SKILL.md) | React 19 / Next.js 렌더링 최적화, 컴포넌트 분리 및 커스텀 훅 설계 표준 |
| **프로젝트 (Frontend)** | `tailwind-design-system` | [`.agents/skills/tailwind-design-system/SKILL.md`](./.agents/skills/tailwind-design-system/SKILL.md) | Tailwind CSS v4 디자인 토큰, 사이버 HUD / 웜 다크 글래스 테마 및 반응형 그리드 |
| **프로젝트 (Frontend)** | `shadcn-ui` | [`.agents/skills/shadcn-ui/SKILL.md`](./.agents/skills/shadcn-ui/SKILL.md) | 커스텀 모달, 드로어, 아코디언, 탭 컴포넌트 조합 및 웹 접근성 준수 |
| **프로젝트 (Frontend)** | `frontend-design` | [`.agents/skills/frontend-design/SKILL.md`](./.agents/skills/frontend-design/SKILL.md) | 고밀도 게임 카탈로그 그리드, 텔레메트리 HUD 카드 및 히어로 레이아웃 설계 |
| **프로젝트 (Frontend)** | `web-design-guidelines` | [`.agents/skills/web-design-guidelines/SKILL.md`](./.agents/skills/web-design-guidelines/SKILL.md) | 웹 인터페이스 일관성, 타이포그래피(`Pretendard Variable`) 및 스크롤 인터랙션 가이드 |
| **프로젝트 (Frontend)** | `i18n-localization` | [`.agents/skills/i18n-localization/SKILL.md`](./.agents/skills/i18n-localization/SKILL.md) | 전 화면 한글 전용 표기(`word-break: keep-all`) 및 전화번호/시간/요금 포맷 표준화 |
| **프로젝트 (SEO/마케팅)** | `seo-audit` | [`.agents/skills/seo-audit/SKILL.md`](./.agents/skills/seo-audit/SKILL.md) | 원격PC방·지피방 검색엔진 최적화(메타태그, OpenGraph, JSON-LD `WebSite`/`FAQPage` 구조화 데이터) |
| **프로젝트 (Backend)** | `fastapi-templates` | [`.agents/skills/fastapi-templates/SKILL.md`](./.agents/skills/fastapi-templates/SKILL.md) | FastAPI 비동기 라우터, 의존성 주입(`Depends`), 파일 다운로드 및 예외 처리 표준 |
| **프로젝트 (Backend)** | `async-python-patterns` | [`.agents/skills/async-python-patterns/SKILL.md`](./.agents/skills/async-python-patterns/SKILL.md) | `asyncio`, SQLAlchemy 2.0 `AsyncSession`, Redis 캐시 비동기 처리 패턴 |
| **프로젝트 (Backend)** | `sqlalchemy2-alembic` | [`.agents/skills/sqlalchemy2-alembic/SKILL.md`](./.agents/skills/sqlalchemy2-alembic/SKILL.md) | SQLAlchemy 2.0 비동기 ORM 모델링, `JSONB` 메타데이터 및 Alembic 마이그레이션 관리 |
| **프로젝트 (Backend)** | `api-design-principles` | [`.agents/skills/api-design-principles/SKILL.md`](./.agents/skills/api-design-principles/SKILL.md) | `/api/portal`, `/api/downloads`, `/api/rpc` 엔드포인트 및 표준 응답 엔벨로프 설계 |
| **프로젝트 (문서조판)** | `pdf-lib` | [`.agents/skills/pdf-lib/SKILL.md`](./.agents/skills/pdf-lib/SKILL.md) | 이용 가이드 및 매뉴얼 PDF 생성 |
| **프로젝트 (Testing)** | `playwright-best-practices` | [`.agents/skills/playwright-best-practices/SKILL.md`](./.agents/skills/playwright-best-practices/SKILL.md) | Playwright 기반 섹션별 렌더링, 반응형 뷰포트 및 다운로드 CTA E2E 검증 |
| **프로젝트 (Quality)** | `systematic-debugging` | [`.agents/skills/systematic-debugging/SKILL.md`](./.agents/skills/systematic-debugging/SKILL.md) | 에러 로그 분석, 재현 테스트 작성 및 근본 원인(Root Cause) 단계별 추적 |
| **프로젝트 (Infra)** | `docker-best-practices` | [`.agents/skills/docker-best-practices/SKILL.md`](./.agents/skills/docker-best-practices/SKILL.md) | 멀티 스테이지 Dockerfile 및 `docker-compose.yml` 컨테이너 최적화 |
| **공용(Built-in/글로벌)** | `agy-customizations`, `antigravity-guide`, `xlsx`, `pdf`, `docx`, `pptx`, `find-skills`, `git-advanced-workflows` | Built-in / Global | 에이전트 커스터마이징, 오피스 리포트 자동화 및 Git 워크플로우 |

