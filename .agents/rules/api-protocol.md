# API / JSON-RPC 게이트웨이 및 접속기 다운로드 프로토콜 규칙 (API Protocol Rules)

## 1. 하이브리드 엔드포인트 역할 분리
프론트엔드 포털, 접속기 다운로드 트래킹, 관리자 CMS 간의 응집도를 위해 백엔드 엔드포인트를 아래 4개 영역으로 명확히 분리한다:
1. **`/api/portal/*` (`portal_router.py`)**: 공개 포털 초기 렌더링에 필요한 통합 데이터 조회(`GET /api/portal/bootstrap` — 사이트 설정, 실시간 가동 지표, 서비스 게임 목록, 이용 단계, 공지/주의사항, FAQ, 최신 접속기 릴리스 정보)를 고속 응답(Redis 캐시 연동)으로 제공한다.
2. **`/api/downloads/*` (`download_router.py`)**: 접속기 설치 파일(`unplug_setup.exe` 또는 자체 설치 파일) 다운로드 스트리밍/리다이렉트(`GET /api/downloads/client`), 전환 이벤트 로깅(`POST /api/downloads/track`), 최신 버전 및 SHA-256 체크섬 조회(`GET /api/downloads/latest`)를 처리한다.
3. **`/api/rpc` (`rpc_router.py` + `routers/rpc/*`)**: 관리자 CMS 및 동적 오퍼레이션(`{"op": "<domain>.<method>", "params": {...}}` — `games.list`, `games.save`, `games.reorder`, `notices.save`, `faqs.save`, `releases.publish`, `stats.summary`)을 처리한다.
4. **`/api/auth/*` (`auth_router.py`)**: 관리자 로그인(`/login`), 로그아웃(`/logout`), 현재 세션 확인(`/me`)을 처리한다.

## 2. 표준 JSON 응답 엔벨로프 (Response Envelope)
모든 API 및 RPC 응답은 프론트엔드 공통 클라이언트(`apiClient.ts`, `rpcClient.ts`)가 일관되게 파싱할 수 있도록 아래 구조를 준수한다:
- **성공 응답**:
  ```json
  {
    "ok": true,
    "data": {},
    "meta": { "page": 1, "size": 50, "total": 52 }
  }
  ```
- **실패 응답**:
  ```json
  {
    "ok": false,
    "error": {
      "code": "DOWNLOAD_FILE_NOT_FOUND",
      "message": "요청하신 접속기 설치 파일을 찾을 수 없습니다. 고객센터로 문의해 주세요.",
      "details": null
    }
  }
  ```

## 3. `/api/rpc` 디스패처 선제적 분할 원칙
- 단일 `rpc_router.py` 파일 내부에 `if op == ... elif op == ...` 형태로 수십 개의 오퍼레이션을 나열하는 것을 엄격히 금지한다.
- 반드시 `app/routers/rpc/<domain>_rpc.py` 파일별로 도메인 핸들러를 분리 작성하고, `app/routers/rpc/registry.py`의 핸들러 맵(`RPC_HANDLERS: dict[str, RpcHandler]`)에 등록하여 각 파일이 150행을 넘지 않도록 유지한다.

## 4. 에러 메시지 100% 한글화 및 오프라인 폴백 원칙
- 클라이언트 화면(토스트 알림, 모달 경고창, 폼 검증 메시지)에 전달되는 모든 `error.message`는 사용자가 즉시 이해할 수 있는 정중한 한국어 문장으로 작성한다.
- 백엔드 서버 점검이나 일시적 네트워크 단절 시에도 랜딩 포털의 핵심 기능(게임 목록 조회, 이용 방법 확인, 접속기 다운로드, 고객센터 안내)이 중단되지 않도록 프론트엔드 `constants/portalData.ts` 폴백 시드 데이터를 기본 내장한다.

