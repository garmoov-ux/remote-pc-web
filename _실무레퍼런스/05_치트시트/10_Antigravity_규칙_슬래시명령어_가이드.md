# Antigravity 커스텀 규칙(Rules), 파일 비대화 방지, 훅(Hooks) 및 슬래시 명령어 실무 가이드

- **기준일**: 2026-10-25
- **짝꿍 스킬**: `agy-customizations`, `antigravity-guide`, `impl-validator`
- **적용 대상**: Antigravity의 핵심 커스터마이징 축인 ① 규칙(`GEMINI.md` / `AGENTS.md` / `.agents/rules/*.md`), ② 파일 비대화 방지 아키텍처 규칙, ③ 내장 슬래시 명령어(`/plan`, `/grill-me`, `/boost`, `/goal`, `/teamwork`, `/compact` 등), ④ 생명주기 훅(`hooks.json`), ⑤ 서브에이전트 분업 및 CLI(`agy`)/IDE 동기화 방법을 정리한 가이드입니다.

---

## 1. Antigravity 5대 커스터마이징 요소 역할 구분

### 1.1. 규칙 (Rules)
- **설정 경로**: `<프로젝트>/AGENTS.md`, `<프로젝트>/GEMINI.md`, `.agents/rules/*.md`, `%USERPROFILE%\.gemini\config\GEMINI.md`
- **작동 시점**: 해당 폴더 작업 시 항상 자동 적용됩니다.
- **핵심 용도**: 한국어 응답 강제, 단일 파일 300~500줄 제한, 엑셀 기본 서식(행높이 25, 폰트 10, 모든 테두리), Python `uv` 및 Git 커밋 컨벤션 등 상시 준수 사항을 고정합니다.

### 1.2. 스킬 (Skills)
- **설정 경로**: `.agents/skills/<스킬명>/SKILL.md` 또는 `%USERPROFILE%\.agents\skills\<스킬명>\SKILL.md`
- **작동 시점**: 특정 도메인 작업 시 온디맨드(On-Demand)로 로드됩니다.
- **핵심 용도**: WXT 확장앱 설계, 엑셀 고급 서식 스크립트, FastAPI 템플릿, 역공학(REA) 등 상세 매뉴얼과 보조 스크립트를 제공합니다.

### 1.3. MCP 서버 (Model Context Protocol)
- **설정 경로**: `%USERPROFILE%\.gemini\config\mcp_config.json`
- **작동 시점**: AI가 외부 도구를 호출할 때(Lazy/Eager Load) 작동합니다.
- **핵심 용도**: 브라우저 자동 조작(`Playwright`), DB 쿼리 실행(`PostgreSQL`/`SQLite`), 최신 공식 문서 조회(`Context7`), 바이너리 역공학(`REA`) 등 실행 도구를 연결합니다.

### 1.4. 생명주기 훅 (Hooks)
- **설정 경로**: `.agents/hooks.json` 또는 `%USERPROFILE%\.gemini\config\hooks.json`
- **작동 시점**: 도구 실행 직전(`PreToolUse`) 또는 직후(`PostToolUse`)에 자동 개입합니다.
- **핵심 용도**: 위험 명령어(`DROP TABLE`, `rm -rf`) 사전 차단, 파일 수정 직후 코드 포매터(`ruff`, `biome`) 자동 실행에 사용합니다.

### 1.5. 슬래시 명령어 (Slash Commands)
- **설정 경로**: 채팅창에 `/명령어` 직접 입력
- **작동 시점**: 사용자가 명시적으로 호출할 때 작동합니다.
- **핵심 용도**: 단계별 설계(`/plan`), 역질문 기획 인터뷰(`/grill-me`), 심층 검증(`/boost`), 목표 달성 자율 주행(`/goal`), 다중 에이전트 협업(`/teamwork`), 문맥 압축(`/compact`)을 수행합니다.

---

## 2. 상시 적용되는 `GEMINI.md` / `AGENTS.md` 표준 템플릿

### 2.1. 커스터마이징 우선순위
1. **프로젝트 폴더 내 규칙** (`<프로젝트>/AGENTS.md`, `<프로젝트>/GEMINI.md`, `.agents/rules/*.md`) — 최우선 적용
2. **프로젝트 선언 설정** (`skills.json`, `plugins.json`)
3. **내 PC 글로벌 설정** (`%USERPROFILE%\.gemini\config\`)
4. **Antigravity 기본 내장(Built-in) 설정**

개별 규칙 파일은 최대 24KB, 전체 상시 로드 규칙 합계는 20,000 토큰까지 본문이 주입되므로, 긴 코드 예제는 스킬(`SKILL.md`)로 분리하고 규칙 파일에는 핵심 수칙만 명확한 목록으로 작성합니다.

### 2.2. 표준 `GEMINI.md` 템플릿 (코드 비대화 방지 규칙 포함)

```markdown
# 공통 작업 및 코딩 아키텍처 표준 규칙 (GEMINI.md)

## 1. 언어 및 커뮤니케이션 스타일
- 모든 설명, 코드 주석, 보고서(Artifact), 커밋 메시지 요약은 한국어로 작성한다.
- 불필요한 서론을 줄이고 핵심 결론과 실행 가능한 코드/결과물 위주로 간결하게 답변한다.
- 요구사항이 모호할 때는 임의로 추측해서 크게 수정하지 말고 먼저 질문한다.

## 2. 코드 모듈화 및 파일 비대화 방지 (File & Function Size Limits)
단일 파일에 과도한 책임이 집중되어 스파게티 코드가 되는 것을 원천 차단한다:
- UI 컴포넌트 (.tsx, .vue, .html): 권장 300행 이내 (최대 500행 초과 금지 -> 하위 컴포넌트 및 커스텀 훅으로 즉시 분리)
- 비즈니스/서비스 로직 (.ts, .py): 권장 250행 이내 (최대 400행 초과 금지 -> 도메인별 유틸리티/서비스 모듈로 분할)
- 단일 함수 본문: 권장 50행 이내 (최대 100행 초과 시 내부 헬퍼 함수로 추출)
- 이미 500행을 초과한 거대 파일에 새 기능을 인라인으로 덧붙이지 말고, 반드시 별도 파일(components/, hooks/, services/, utils/)로 작성하여 import한다.

## 3. 엑셀(.xlsx) 및 CSV 데이터 산출물 기본 서식
사용자가 별도 서식을 지정하지 않더라도 엑셀(.xlsx) 파일을 생성할 때는 항상 아래 표준을 기본 적용한다:
- 글꼴: 맑은 고딕, 크기 10pt (1행 제목 행은 굵게 및 연한 배경색 #D9E1F2 적용)
- 행 높이: 제목 행과 데이터 행 모두 기본 높이 25 적용
- 테두리: 데이터가 들어가는 모든 셀에 얇은 실선(모든 테두리, #BFBFBF) 적용
- 편의 기능: 1행 틀 고정(freeze_panes = "A2"), 첫 행 자동 필터(auto_filter), 한글 글자 폭(1.8배)을 고려한 열 너비 자동 맞춤 적용
- CSV 입출력: 윈도우 엑셀에서 한글이 깨지지 않도록 읽고 쓸 때 항상 encoding="utf-8-sig"를 기본 사용한다.

## 4. Python, Node.js 및 Git 개발 표준
- Python 패키지 관리 및 실행은 구형 pip/venv 대신 uv (uv add, uv run)를 기본 사용한다.
- 크롬 확장프로그램 및 모노레포는 pnpm + WXT + TypeScript(strict: true) + Zod를 기본 사용한다.
- Git 커밋 메시지는 <type>(<scope>): <한글 커밋 요약> 형식을 엄수한다.
- 기존 코드 수정 시 수정 범위와 무관한 기존 주석이나 독스트링(Docstring)을 임의로 삭제하지 않는다.
```

---

## 3. 내장 슬래시 명령어(`/`) 9종 활용 기준

- **`/plan` (단계별 설계 계획 수립)**:
  - 새 기능을 추가하거나 아키텍처를 변경하기 전, 코드부터 수정하지 않고 수정 대상 파일 목록과 단계별 계획을 먼저 브리핑받고 싶을 때 사용합니다.
- **`/grill-me` (역질문 인터뷰를 통한 기획 확정)**:
  - 아이디어만 있고 세부 조건이 미정일 때 입력하면, AI가 핵심 선택지 질문을 던져 모호한 요구사항과 예외 케이스를 확정해 줍니다.
- **`/boost` (심층 추론 및 다각도 교차 검증)**:
  - 원인을 알 수 없는 통신 버그, 대규모 SQL 쿼리 튜닝, 복잡한 오프스크린 미디어 파이프라인 등 깊이 있는 추론과 검증이 필요한 고난도 작업에 사용합니다.
- **`/goal` (목표 달성 시까지 자율 반복 실행)**:
  - "모든 단위 테스트와 빌드가 통과할 때까지 수정해 줘"처럼 장시간 소요되는 과제를 완료될 때까지 스스로 검증하며 완수하게 할 때 사용합니다.
- **`/teamwork` (다중 자율 에이전트 병렬 협업)**:
  - 백엔드, 프론트엔드, DB, 문서를 여러 에이전트가 역할을 분담하여 동시에 병렬로 진행해야 하는 대규모 프로젝트에 사용합니다.
- **`/learn` (해결한 노하우를 규칙/스킬로 영구 기록)**:
  - AI의 실수를 교정했거나 까다로운 환경 설정을 마쳤을 때 입력하면, 다음 세션에서도 동일한 지식을 유지하도록 영구 반영합니다.
- **`/compact` (대화 문맥 요약 압축 및 컨텍스트 확보)**:
  - 한 기능이 끝나고 커밋한 뒤 대화가 길어졌을 때 입력하여 지금까지의 핵심 맥락만 압축하고 응답 속도를 회복합니다.
- **`/browser` (웹 브라우저 직접 구동 및 화면 검증)**:
  - 로컬 웹 서버나 확장앱 화면을 직접 브라우저로 열어 버튼을 클릭하고 콘솔 에러 및 레이아웃을 확인하게 할 때 사용합니다.
- **`/schedule` (정기 반복 작업 및 타이머 예약)**:
  - 특정 시간 뒤 상태 재점검이나 주기적인 모니터링 작업을 크론(Cron) 또는 타이머로 예약할 때 사용합니다.

---

## 4. 생명주기 훅(`hooks.json`)을 통한 안전장치 구성

### 4.1. 지원하는 6대 이벤트 시점
1. **`SessionStart`**: 새 대화가 시작될 때 최초 1회 실행
2. **`PreToolUse`**: AI가 도구(`run_command`, `edit_file` 등)를 실행하기 직전에 개입하여 허용(`allow`) 또는 차단(`deny`) 결정
3. **`PostToolUse`**: 도구 실행이 완료된 직후 실행 (자동 린트/포매팅 등)
4. **`PreInvocation`**: AI 모델 호출 직전 실행
5. **`PostInvocation`**: AI가 도구 호출을 마친 뒤 실행
6. **`Stop`**: AI가 턴을 종료하려 할 때 실행

### 4.2. 실전 예제: 위험 명령어 사전 차단 (`.agents/hooks.json`)
```json
{
  "safety-gate": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": "python .agents/scripts/check_command.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

호출되는 `.agents/scripts/check_command.py` 스크립트:
```python
import sys
import json

data = json.load(sys.stdin)
cmd = data.get("toolCall", {}).get("args", {}).get("CommandLine", "").lower()

dangerous_keywords = ["drop table", "truncate table", "rm -rf /", "format "]
if any(k in cmd for k in dangerous_keywords):
    print(json.dumps({
        "decision": "deny",
        "reason": "운영 데이터 보호를 위해 위험한 삭제 명령어는 차단되었습니다."
    }))
else:
    print(json.dumps({"decision": "allow"}))
```

---

## 5. CLI(`agy`) 및 Antigravity IDE 통합 운용 팁

- **설정 100% 공유**: 프로젝트 루트의 `AGENTS.md`, `.agents/rules/`, `.agents/skills/`와 글로벌 `%USERPROFILE%\.gemini\config\` 설정은 CLI(`agy`)와 Antigravity IDE 양쪽에서 동일하게 적용됩니다.
- **Antigravity IDE 권장 작업**: 코드 파일을 직접 보며 UI/화면을 구성하거나 여러 소스 파일을 넘나들며 리팩토링할 때, 사이드바에서 `/plan`, `/grill-me`, `/boost` 및 `Ctrl+I` 인라인 편집을 활용합니다.
- **CLI (`agy`) 권장 작업**: 빠른 스크립트 실행, 엑셀/데이터 가공, 파일 일괄 변환, Git 커밋, 도커 빌드 등 터미널 중심 작업을 수행할 때 작업 폴더에서 `agy`를 실행하여 처리합니다.
