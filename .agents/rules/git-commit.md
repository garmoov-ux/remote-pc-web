# Git 커밋 규칙 (Git Commit Convention)

## 1. 커밋 메시지 포맷
커밋 메시지는 항상 아래의 Conventional Commits 형식을 따른다:
`<type>(<scope>): <간결한 한 줄 요약 (한국어)>`

## 2. 허용되는 Type 목록
- **`feat`**: 새로운 기능 및 섹션 추가 (예: `feat(games): 서비스 게임 50종 카탈로그 그리드 및 초성 검색 추가`)
- **`fix`**: 버그 수정 (예: `fix(nav): 모바일 오버레이 메뉴 열림 시 배경 스크롤 잠금 오류 수정`)
- **`docs`**: README, AGENTS.md, DESIGNE.md, 아키텍처 문서 수정
- **`refactor`**: 기능 변경 없는 코드 구조 개선 및 파일 분할
- **`perf`**: Canvas 파티클 렌더링 최적화, 이미지 WebP 변환, 쿼리 튜닝
- **`style`**: 코드 포맷팅, 린트 수정
- **`test`**: pytest 및 Playwright E2E 테스트 코드 추가·수정
- **`chore`**: 빌드 설정, 패키지 매니저, 로컬 스킬/규칙/MCP 구성 등

## 3. 금지 사항 및 푸시 전 필수 검증
- 한 커밋에 여러 독립적인 작업을 섞지 말고, 섹션/도메인/기능 단위로 분리하여 커밋한다.
- 빌드 산출물(`.next/`, `dist/`, `node_modules/`, `.venv/`, `__pycache__/`), 대용량 설치 바이너리(`*.exe`, `*.msi`, `*.zip`), `.env`는 커밋에 절대 포함하지 않는다.
- `git push` 실행 전 반드시 `git status -s`를 확인하여 `.env` 파일이나 임시 크레덴셜이 스테이징되지 않았는지 검증한다.

## 4. 윈도우(Windows) Git 환경 표준 설정
- 기본 브랜치는 항상 `main`으로 통일한다 (`git init -b main` 또는 `git branch -M main`).
- 한글 파일명 및 폴더명(`_실무레퍼런스`, `markdown` 등)이 8진수(`\355...`)로 깨지지 않도록 `git config core.quotepath false`를 유지한다.
- 윈도우 260자 경로 제한 에러를 방지하기 위해 `git config core.longpaths true`를 적용한다.
- 윈도우(CRLF)와 Docker 리눅스 컨테이너(LF) 간 줄바꿈 충돌 방지를 위해 루트의 `.gitattributes` 규칙을 준수한다.

