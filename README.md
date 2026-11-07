# 원격플러그인 피시 (UNPLUG 원격 PC방) 웹 포털 및 접속기 배포·관리 시스템 (`remote-pc-web`)

집에서도 고성능 PC방 좌석 환경과 프리미엄 혜택을 그대로 이용할 수 있는 **원격 PC방(지피방/홈피씨) 웹 포털 및 접속기(`.exe`) 배포·운영 관리 플랫폼**입니다.

- **벤치마크 기준**:
  - **1순위 메인 타깃**: `https://xn--i89awyn2tbmlqye52ae90ecla.kr/#games` (`원격플러그인피시.kr` — 사이버 HUD 그리드 테마)
  - **2순위 연계 타깃**: `https://unplug.co.kr/` (`UNPLUG 원격 PC방` — 웜 다크 글래스모피즘 테마 및 접속기 배포)
- **마스터 설계 문서**:
  - 아키텍처 및 에이전트 지침서: [`AGENTS.md`](./AGENTS.md)
  - 디자인 및 타이포그래피 명세서: [`DESIGNE.md`](./DESIGNE.md)
  - 섹션·메뉴별 개발 진행 현황: [`markdown/00_메뉴별_개발_진행현황.md`](./markdown/00_메뉴별_개발_진행현황.md)
  - 실무 레퍼런스 가이드: [`_실무레퍼런스/00_작성규칙_및_전체목차_가이드.md`](./_실무레퍼런스/00_작성규칙_및_전체목차_가이드.md)

---

## 1. 주요 기능 및 8대 핵심 섹션 아키텍처

1. **상단 고정 HUD 네비게이션 및 모바일 오버레이 (`HeaderNav`, `MobileMenuOverlay`)**
   - 실시간 가동 상태 인디케이터, 섹션 스무스 스크롤 이동(`#how`, `#games`, `#why`, `#notice`, `#faq`), 스크롤 스파이(`is-active`) 동기화, 접속기 즉시 설치 CTA 및 모바일 전체화면 드로어 메뉴
2. **히어로 섹션 & 실시간 텔레메트리 HUD & 3단계 빠른 시작 (`HeroSection`, `QuickFlowBanner`)**
   - 2D Canvas 실시간 네트워크 노드·연결선·펄스 파티클 배경 (`devicePixelRatio` 및 `prefers-reduced-motion` 대응)
   - 핵심 운영 지표 시각화: `전국 70+ 제휴 PC방`, `50+ 서비스 게임`, `1만원 기준 600분(10시간)`, `접속 대기 시간 00분`
   - 상담·예약·대기 없는 3단계 즉시 시작 플로우 (`1. 접속기 설치 -> 2. 프로그램 내 회원가입 -> 3. 충전 후 즉시 게임`)
3. **이용 순서 4단계 가이드 (`#how` — `HowToUseSection`)**
   - `01 접속기 설치 및 충전` -> `02 전국 빈 좌석 자동 연결` -> `03 집에서 고사양 원격 플레이` -> `04 사용한 시간만 분 단위 자동 차감`
4. **서비스 게임 카탈로그 및 실시간 검색/필터 (`#games` — `GamesCatalogSection`)**
   - `리니지`, `피파온라인`, `메이플스토리`, `로스트아크`, `스페셜포스`, `서든어택`, `슬러거`, `마비노기`, `검은사막`, `디아블로4`, `오버워치2`, `바람의나라` 등 50여 종 인기 게임 반응형 카드 그리드 (데스크톱 6열 / 태블릿 4열 / 모바일 2열)
   - 장르 필터, 한글 초성 실시간 검색, 바로 접속 가능 게임 및 보안 정책 제한 게임(`던파·롤·발로란트 이용 불가`) 안내 배너
5. **서비스 핵심 경쟁력 및 개발·운영 전담팀 (`#why` — `WhyChooseSection`)**
   - `01 자체 기술팀 직접 개발·운영`, `02 365일 24시간 실시간 상담`, `03 렉 없는 자체 스트리밍 최적화` 및 4대 전담 파트(`서비스 개발`, `인프라·최적화`, `서비스 운영`, `고객 지원`) 소개
6. **공지사항·주의사항·원격지원·24시간 고객센터 (`#notice` — `NoticeAndCareSection`)**
   - 접속기 정상 종료 2단계 수칙 (`01 원격PC 종료 및 원격창 닫기` -> `02 접속기에서 로그아웃 버튼 누르기`)
   - 계정 보호를 위한 `20분 의무 사용` (권장 20분 이상, 최소 10분 필수) 안내
   - `AnyDesk` 공식 원격지원 프로그램 안내 및 24시간 연중무휴 고객센터(`010-3470-8716`, 카카오톡 실시간 상담) 원클릭 연결
7. **자주 묻는 질문 아코디언 (`#faq` — `FaqSection`)**
   - 무상담 시작 여부, 원격PC방 원리, 스트리밍 최적화, 요금 및 충전 보너스 체계, 365일 장애 대응 아코디언 UI
8. **접속기 패키지 다운로드·플로팅 상담 바·관리자 CMS (`#download`, `FloatingConsultBar`, `AdminCms`)**
   - 하단 설치 패키지(`unplug_setup.exe`) 다운로드 섹션, 우측 하단 고정 실시간 상담 위젯, 백엔드 관리자 CMS API 연동

---

## 2. 기술 스택 (Tech Stack)

| 영역 | 기술 스택 및 표준 도구 |
| :--- | :--- |
| **프론트엔드 (`frontend/`)** | `React 19`, `Next.js 16 (App Router)`, `TypeScript 5 (strict: true)`, `Tailwind CSS v4`, `Pretendard Variable`, `lucide-react` |
| **백엔드 (`backend/`)** | `Python 3.12+ (uv)`, `FastAPI`, `Pydantic v2`, `SQLAlchemy 2.0 (AsyncSession)`, `Alembic`, `Argon2id` |
| **데이터베이스 및 캐시** | `PostgreSQL 16` (단독 경량 배포 시 `SQLite WAL` 호환), `Redis 7` (`redis.asyncio`) |
| **문서 및 리포트** | `openpyxl` (다운로드 통계 및 게임 목록 엑셀 출력), `pdf-lib` |
| **테스트 및 검증** | `pytest`, `pytest-asyncio`, `Playwright E2E` |
| **컨테이너 인프라** | `Docker Compose` (`postgres:16-alpine` + `redis:7-alpine` + `backend` + `frontend`) |

---

## 3. 프로젝트 디렉터리 구조

```plaintext
remote-pc-web/
├── .env.example                     # 환경변수 표준 템플릿 (.env는 Git 추적 제외)
├── .gitattributes                   # 윈도우(CRLF) / 리눅스 컨테이너(LF) 줄바꿈 표준화
├── .gitignore                       # Git 추적 제외 규칙
├── AGENTS.md                        # 프로젝트 아키텍처 및 에이전트 마스터 지침서
├── DESIGNE.md                       # 사이버 HUD & 웜 다크 글래스 디자인 시스템 명세서
├── README.md                        # 프로젝트 개요 및 실행 가이드
├── markdown/
│   └── 00_메뉴별_개발_진행현황.md   # 섹션·메뉴별 개발 진척도 및 작업 이력 기록
├── _실무레퍼런스/                   # 스킬, MCP, 기술스택, 오픈소스, 치트시트 레퍼런스
├── .agents/
│   ├── hooks.json                   # 위험 명령어 사전 차단 PreToolUse 안전 훅
│   ├── mcp_config.json              # 프로젝트 로컬 MCP 4종 (rea, postgres, redis, docker)
│   ├── rules/                       # 상시 적용 세부 규칙 7종 (common, code-architecture 등)
│   ├── scripts/check_command.py     # 안전 훅 검증 스크립트
│   └── skills/                      # 프로젝트 로컬 스킬 17종 (remote-pc-portal-architecture 등)
├── backend/                         # FastAPI 백엔드 서버 (Python 3.12 + uv)
└── frontend/                        # Next.js 16 / React 19 프론트엔드
```

---

## 4. 빠른 시작 가이드 (Quick Start)

### 4.1 환경변수 파일 생성

```powershell
Copy-Item .env.example .env
```

### 4.2 인프라 컨테이너(PostgreSQL 16 & Redis 7) 실행

```powershell
docker compose up -d postgres redis
```

### 4.3 백엔드 서버 실행 (`backend/`)

```powershell
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4.4 프론트엔드 개발 서버 실행 (`frontend/`)

```powershell
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 포털 화면을 확인합니다.

---

## 5. 기본 사업자 및 고객센터 정보

- **서비스명**: 원격플러그인 피시 (UNPLUG 원격 PC방)
- **상호 / 대표자**: 언플러그 / 차수빈
- **사업자등록번호**: `240-18-02372`
- **통신판매업신고번호**: `제 2025-김해장유-0356 호`
- **소재지**: 경상남도 김해시 대청로 210번길 24
- **24시간 고객센터**: `010-3470-8716` (전화 · 문자 · [카카오톡 실시간 상담](https://pf.kakao.com/_Ypsan))
- **이메일**: `pueen123@naver.com`

