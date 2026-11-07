# DESIGNE.md - 원격 PC방 웹 포털 및 접속기 배포 시스템 디자인 명세서

- **작성 기준일**: 2026-11-07
- **벤치마크 기준**:
  - **1순위 메인 테마 (Cyber-HUD Access Grid)**: `https://xn--i89awyn2tbmlqye52ae90ecla.kr/` (`원격플러그인피시.kr`)
  - **2순위 확장 테마 (Warm Dark Glassmorphism)**: `https://unplug.co.kr/` (`UNPLUG 원격 PC방`)
- **적용 원칙**: 이모지(Emoji) 전면 사용 금지, 한글 단어 보존(`word-break: keep-all`), 고해상도 2D Canvas 네트워크 파티클 및 저사양/모션 민감 환경(`prefers-reduced-motion`) 완벽 대응

---

## 1. 타이포그래피 시스템 (`Pretendard Variable` + 테크니컬 디스플레이 조화)

### 1.1 폰트 패밀리 역할 분리
1. **기본 한글 및 본문 표준 폰트 (`Pretendard Variable`)**:
   - 시스템 전체 한글 헤딩, 본문, 게임 타이틀, 주의사항, FAQ, 관리자 화면은 **`Pretendard Variable` (`Pretendard`)**을 최우선 적용합니다.
   - 선언: `font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', system-ui, sans-serif;`
2. **디스플레이 수치 및 HUD 강조 폰트 (`Orbitron` + `Pretendard Variable`)**:
   - 히어로 스탯(`70+`, `50+`, `600'`, `00'`), 스텝 번호(`01`~`04`), 섹션 숫자 인덱스에는 기하학적 디스플레이 폰트(`Orbitron`)와 `Pretendard Variable`(`font-weight: 800~900`)을 조합합니다.
3. **고정폭 코드 및 텔레메트리 폰트 (`JetBrains Mono` + `Pretendard Variable`)**:
   - 게임 코드 배지(`G-01` ~ `G-12`), 섹션 번호 태그, 전화번호 및 상태 인디케이터에는 고정폭 숫자가 정렬되는 `JetBrains Mono` 및 `tabular-nums` 속성을 적용합니다.

### 1.2 타입 스케일 및 행간 규격
- **히어로 메인 타이틀 (`h1`)**: `clamp(2.6rem, 6.4vw, 5.2rem)`, 웨이트 `900`, 행간 `1.05`, 자간 `-0.01em`
- **섹션 메인 타이틀 (`h2.sec-h`)**: `clamp(1.8rem, 4vw, 3.0rem)`, 웨이트 `800~900`, 행간 `1.15`
- **카드/스텝 서브 타이틀 (`h3`, `h4`)**: `18px ~ 20px`, 웨이트 `700`, 행간 `1.35`
- **본문 텍스트 (`body`, `p`)**: `15px ~ 16.5px`, 웨이트 `400~500`, 행간 `1.65`, `word-break: keep-all`
- **보조 캡션 및 배지 (`badge`, `meta`)**: `11px ~ 13px`, 웨이트 `600`, 행간 `1.4`

---

## 2. 듀얼 테마 컬러 토큰 시스템 (Theme Tokens)

관리자 설정 또는 테마 토글에 따라 즉시 전환할 수 있도록 CSS 변수 기반의 2가지 검증된 테마 토큰을 정의합니다.

### 2.1 기본 테마: 사이버 HUD 그리드 (`theme-cyber-hud` — `원격플러그인피시.kr` 표준)
고성능 게이밍 하드웨어와 즉각적인 좌석 매칭 속도를 시각화하는 다크 사이버펑크 HUD 팔레트입니다.

- **배경 표면 (Surfaces)**:
  - `--bg-void`: `#0A0A0F` (전체 페이지 기본 딥 보이드 배경)
  - `--bg-panel`: `#101019` (스텝 카드, 게임 카드, 공지 패널 기본 배경)
  - `--bg-panel-alt`: `#14141F` (보조 카드 및 호버 표면)
  - `--border-line`: `#202032` (`1px` 기본 구조선 및 그리드 분할선)
- **네온 시그니처 포인트 (Neon Accents)**:
  - `--accent-cyan`: `#00E5FF` (주 브랜드 포인트, HUD 좌측 액센트 바, 주 다운로드 버튼 배경 및 글로우)
  - `--accent-magenta`: `#FF2E97` (보조 포인트, 핵심 슬로건 강조, 하단 다운로드 CTA 및 게임 카드 호버 보더)
  - `--accent-lime`: `#B4FF39` (실시간 가동 상태 점, `600분` 가성비 지표, 지원 게임 수 강조)
  - `--accent-amber`: `#FFB020` (의무 사용 시간 등 주의/안내 강조)
  - `--kakao-yellow`: `#FEE500` (카카오톡 상담 전용 버튼 배경, 텍스트 `#191919`)
- **텍스트 계층 (Text Hierarchy)**:
  - `--text-white`: `#EFF3FF` (헤딩 및 최우선 강조 텍스트)
  - `--text-body`: `#D7DBE7` (기본 본문 텍스트)
  - `--text-muted`: `#7C82A0` (보조 설명, 라벨, 푸터 메타데이터)

### 2.2 보조 테마: 웜 다크 글래스모피즘 (`theme-warm-glass` — `unplug.co.kr` 호환)
부드러운 블러 글래스와 오렌지-핑크 그라데이션을 결합한 프리미엄 라운지 스타일 팔레트입니다.

- **배경 및 글래스 표면**:
  - `--bg-void`: `#0E0A14` (메인 배경), `--bg-sec-alt`: `#140E1D` (교차 섹션 배경)
  - `--bg-card-solid`: `#171021`, `--bg-card-glass`: `rgba(255, 255, 255, 0.04)` (`backdrop-filter: blur(26px)`)
  - `--border-line`: `rgba(255, 255, 255, 0.09)`
- **그라데이션 포인트**:
  - `--grad-primary`: `linear-gradient(90deg, #F97316, #EC4899)` (웜 오렌지-핑크 메인 그라데이션)
  - `--grad-install`: `linear-gradient(90deg, #2F6FD8, #0AD3EF)` (상단 블루 접속기 설치 버튼)
  - `--accent-pink`: `#F9A8D4`

---

## 3. 지오메트리, 카드 레이아웃 및 인터랙션 원칙

### 3.1 모서리 챔퍼(Chamfer) 및 코너 브래킷 디테일
- **사선 챔퍼 폴리곤 (`clip-path`)**:
  - 상단 HUD 네비게이션 바, 다운로드 버튼(`.arc`), 스텝 카드(`.step`), 게임 카드(`.gcard`), 고객센터 카드(`.cscard`)에는 사선 모서리 컷팅(`clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)`)을 적용하여 날렵한 게이밍 기어 조형미를 구현합니다.
- **코너 브래킷 (`cnr tl`, `cnr br`)**:
  - 주요 스텝 카드 및 게임 카드 모서리에 `2px solid var(--accent-cyan)` 또는 `var(--accent-magenta)` 직각 브래킷 포인트를 배치합니다.

### 3.2 홀로그램 샤인 다운로드 버튼 (`.arc`)
- 접속기 설치 버튼은 시안(`#00E5FF`) 또는 마젠타(`#FF2E97`) 그라데이션 배경 위에 `skewX(-20deg)` 대각선 하이라이트가 3.2초 주기로 흐르는 샤인 애니메이션을 적용합니다.
- 호버 시 `transform: translateY(-2px)` 및 네온 박스 섀도우(`0 0 34px rgba(0, 229, 255, 0.7)`)로 즉각적인 클릭 피드백을 제공합니다.

### 3.3 배경 2D Canvas 네트워크 파티클 & 그리드 스캔라인
- **고정 배경 레이어 (`.bgfx` + `canvas#bg`)**:
  - `44px x 44px` 시안 그리드(`rgba(0, 229, 255, 0.05)`), `4px` 반복 스캔라인, 7초 주기 수직 스캔 스윕(`.sweep`)을 `pointer-events: none`으로 깔아줍니다.
  - Canvas 레이어는 화면 면적 비례 노드(최대 46~80개)를 생성하고, 노드 간 거리가 임계값(`138px ~ 175px`) 이내일 때 거리 반비례 투명도(`alpha`)로 연결선을 렌더링합니다.
- **접근성 및 성능 보호 (`prefers-reduced-motion: reduce`)**:
  - OS 또는 브라우저에서 모션 감소가 설정된 경우 `.sweep`, `.arc::before` 애니메이션을 즉시 끄고, Canvas는 최초 1프레임만 그린 뒤 `requestAnimationFrame` 루프를 종료합니다.

---

## 4. 반응형 그리드 브레이크포인트 표준

- **와이드 데스크톱 (`max-width: 1240px` 컨테이너, 좌우 패딩 `26px`)**:
  - 히어로 섹션: 좌측 메인 카피(`1.25fr`) + 우측 텔레메트리 스탯 카드(`0.75fr`)
  - 이용 순서(`#how`): 4열 그리드 (`grid-template-columns: repeat(4, 1fr)`, `gap: 16px`)
  - 서비스 게임(`#games`): 6열 그리드 (`grid-template-columns: repeat(6, 1fr)`, `gap: 14px`)
  - 서비스 특징(`#why`): 3열 그리드 (`grid-template-columns: repeat(3, 1fr)`, `gap: 16px`)
  - 공지사항 및 고객센터(`#notice`): 2열 분할 (`1.25fr : 1fr`, `gap: 16px`)
  - 하단 다운로드(`#download`): 2열 분할 (`1.15fr : 0.85fr`, `gap: 16px`)
- **태블릿 가로 (`<= 1080px`)**:
  - 서비스 게임 그리드를 6열에서 **4열(`repeat(4, 1fr)`)**로 축소합니다.
- **태블릿 세로 (`<= 900px`)**:
  - 상단 HUD 가로 메뉴와 상단 설치 버튼을 숨기고 **모바일 햄버거 메뉴(`Burger`)**를 노출합니다.
  - 히어로, 서비스 특징, 공지/고객센터, 하단 다운로드, 푸터를 **1열(`1fr`)**로 전환하고, 이용 순서(`#how`)는 **2열(`1fr 1fr`)**로 배치합니다.
- **모바일 (`<= 560px`)**:
  - 서비스 게임을 **2열(`1fr 1fr`)**, 이용 순서를 **1열(`1fr`)**로 배치합니다.
  - 우측 하단 고정 상담 버튼(`.csfix`)을 모바일 화면을 가리지 않도록 컴팩트 아이콘/배지 형태로 축약합니다.

