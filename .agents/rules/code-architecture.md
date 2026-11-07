# 선제적 모듈 분할, 디자인 시스템 및 아키텍처 규칙 (Code Architecture)

## 1. 추후 리팩토링이 필요 없는 선제적 분할 작성 원칙 (Pre-Split Modularity)
코드를 한 파일에 길게 작성한 뒤 나중에 쪼개는 **"선 구현 후 리팩토링" 방식을 전면 금지**한다. 처음 코드를 생성할 때부터 역할별로 파일을 나누어 작성하여 리팩토링 소요 자체를 원천 차단한다:

### 1.1. 파일 및 함수 크기 엄격 상한선
- **페이지 엔트리 및 라우터 (`page.tsx`, `router.py`)**: **권장 150행 이내** (최대 250행 초과 금지 — 하위 섹션 컴포넌트와 서비스 조합만 수행)
- **개별 UI 컴포넌트 (`.tsx`)**: **권장 200~250행 이내** (최대 400행 절대 초과 금지)
- **비즈니스 서비스 및 훅 (`.py`, `.ts`)**: **권장 200행 이내** (최대 350행 절대 초과 금지)
- **단일 함수 / 메서드 본문**: **권장 40행 이내** (최대 80행 초과 시 즉시 내부 헬퍼 함수로 분리)

### 1.2. 프론트엔드 최초 생성 시 필수 분할 단위
원격 PC방 포털(`remote-pc-web`) 화면을 구현할 때 단일 `index.html`이나 거대한 단일 `page.tsx`에 몰아넣지 않고, 반드시 처음부터 아래 단위로 파일을 분리하여 생성한다:
- **`app/page.tsx` (또는 `pages/HomePage.tsx`)**: 전체 페이지 레이아웃 골격 및 섹션 배치만 담당 (150행 이내)
- **`components/layout/`**:
  - `HeaderNav.tsx`: 상단 고정 HUD / 플로팅 네비게이션 바, 브랜드 상태 표시, 스크롤 스파이 활성 링크, 접속기 설치 버튼
  - `MobileMenuOverlay.tsx`: 모바일 전체화면 오버레이 메뉴 및 닫기/섹션 이동 핸들러
  - `SiteFooter.tsx`: 사업자 정보(상호, 대표, 사업자번호, 소재지, 통신판매업), 고객센터 안내, 클라이언트 설치 CTA
  - `FloatingConsultBar.tsx`: 우측 하단 고정 실시간 상담 위젯(이용 가능/불가 게임 알림 배지, 카카오톡 빠른상담, 24시간 전화 연결)
- **`components/background/`**:
  - `NetworkCanvasBg.tsx`: HTML5 Canvas 2D 기반 실시간 네트워크 노드·연결선·펄스 파티클 배경 (`devicePixelRatio` 및 `prefers-reduced-motion` 완벽 대응)
  - `CyberGridOverlay.tsx`: 배경 그리드, 스캔라인 및 스캔 스윕 CSS 레이어
- **`components/sections/`**:
  - `HeroSection.tsx`: 메인 헤드라인, 실시간 가동 지표 HUD(`70+ 제휴 PC방`, `50+ 게임`, `600분/1만원`, `0분 대기`), 즉시 설치 CTA
  - `QuickFlowBanner.tsx`: 무상담·무예약·무대기 선언 배너 및 3단계(`접속기 설치 -> 회원가입 -> 충전 후 게임`) 요약 플로우
  - `HowToUseSection.tsx` (`#how`): 이용 순서 4단계(`접속기 설치/충전`, `좌석 자동 연결`, `집에서 원격 플레이`, `분 단위 자동 차감`) 스텝 카드 그리드
  - `GamesCatalogSection.tsx` (`#games`): 주요 서비스 게임(리니지, 피파온라인, 메이플스토리, 로스트아크 등 50+종) 카드 그리드, 장르 필터, 한글 초성 검색, 지원/제한 게임 안내 배너
  - `WhyChooseSection.tsx` (`#why`): 3대 핵심 경쟁력(`자체 기술팀`, `365일 실시간 상담`, `렉 없는 자체 최적화`) 및 개발·운영 4대 전담팀 소개 카드
  - `NoticeAndCareSection.tsx` (`#notice`): 접속기 정상 종료 2단계 수칙, 20분 의무 사용 규정, `AnyDesk` 원격지원 프로그램 안내, 24시간 고객센터 직통 카드
  - `FaqSection.tsx` (`#faq`): 자주 묻는 질문 아코디언 리스트 및 검색/필터
  - `DownloadCtaSection.tsx` (`#download`): 하단 접속기 패키지 다운로드 섹션, 설치 안내 모달 연동 및 파일 무결성/버전 표시
- **`components/admin/`**:
  - 관리자 전용 대시보드(서비스 게임 추가/수정/노출순서 변경, 공지사항·FAQ 편집, 접속기 `.exe` 버전/다운로드 URL 관리, 일별 다운로드 통계) 컴포넌트 분리
- **`hooks/`**:
  - `useScrollSpy.ts`: 섹션 진입 감지 및 네비게이션 활성 탭(`is-active`) 동기화 훅
  - `useRevealOnScroll.ts`: `IntersectionObserver` 기반 스크롤 리빌 애니메이션(`.rv` -> `.rv.in`) 제어 훅
  - `useClientDownload.ts`: 접속기 다운로드 실행, 전환 이벤트 기록(`/api/rpc` `downloads.record`) 및 설치 안내 모달 오픈 훅
- **`constants/portalData.ts` & `types/portal.ts`**:
  - 초기 시드 데이터(게임 목록, 4단계 가이드, 특징, 주의사항, FAQ, 사업자 정보) 및 TypeScript 엄격 인터페이스 분리

### 1.3. 백엔드(`FastAPI`) 최초 생성 시 필수 분할 단위
단일 `.py` 파일에 모델, 스키마, 라우터, 비즈니스 로직을 섞어 쓰는 것을 금지하며, 도메인 추가 시 처음부터 아래 5개 계층 파일로 나누어 생성한다:
- **`app/models/<domain>.py`**: SQLAlchemy 2.0 비동기 ORM 테이블 모델 정의 (`games`, `notices`, `faqs`, `client_releases`, `download_logs`, `site_configs`)
- **`app/schemas/<domain>.py`**: Pydantic v2 요청(Request)·응답(Response) 스키마 정의
- **`app/routers/<domain>.py`**: FastAPI 엔드포인트 선언, 세션/권한 `Depends` 주입, 서비스 호출만 담당 (직접 SQL 쿼리 작성 금지)
- **`app/services/<domain>_service.py`**: 비즈니스 규칙 검증, DB 트랜잭션 처리, 캐시 갱신 담당
- **`app/utils/`**: 파일 해시(`SHA-256`) 계산기, 엑셀(`.xlsx`) 통계 리포트 생성기 등 순수 유틸리티 분리

---

## 2. 반응형 브레이크포인트 및 레이아웃 규칙
- **데스크톱 와이드 (`>= 1080px`)**:
  - 상단 HUD/아일랜드 네비게이션 전체 메뉴 노출
  - 히어로 섹션 2단 분할(`1.25fr : 0.75fr`), 이용 순서 4열(`grid-cols-4`), 서비스 게임 6열(`grid-cols-6`), 서비스 특징 3열(`grid-cols-3`), 공지/고객센터 2열(`1.25fr : 1fr`) 배치
- **태블릿 (`560px ~ 1079px`)**:
  - 서비스 게임 그리드 4열(`grid-cols-4`) -> 3열 자동 축소
  - `900px` 이하에서 상단 가로 링크를 숨기고 모바일 햄버거 메뉴(`Burger`) 활성화, 히어로/공지/다운로드 섹션 1열 스택 전환, 이용 순서 2열(`grid-cols-2`) 전환
- **모바일 (`< 560px`)**:
  - 서비스 게임 그리드 2열(`grid-cols-2`), 이용 순서 1열(`grid-cols-1`) 전환
  - 우측 하단 플로팅 상담 버튼 컴팩트 모드 전환 및 터치 타겟 최소 `44px x 44px` 보장
  - 한글 단어 중간 잘림 방지를 위해 전 텍스트 요소에 `word-break: keep-all` (`break-keep`) 기본 적용

---

## 3. 디자인 시스템 및 테마 아키텍처 ([`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md) 준수)
- 벤치마크 사이트의 2가지 검증된 비주얼 테마(**테마 1: 사이버 HUD 그리드 테마 `원격플러그인피시.kr`** / **테마 2: 웜 다크 글래스모피즘 테마 `unplug.co.kr`**)를 CSS 변수 토큰으로 체계화하여 [`DESIGNE.md`](file:///F:/Data/Workspace/remote-pc-web/DESIGNE.md)에 정의하고 일관되게 적용한다.
- `prefers-reduced-motion: reduce` 미디어 쿼리를 감지하여 저사양 PC나 모션 민감 사용자 환경에서는 배경 스윕 애니메이션과 Canvas 루프를 즉시 비활성화한다.

