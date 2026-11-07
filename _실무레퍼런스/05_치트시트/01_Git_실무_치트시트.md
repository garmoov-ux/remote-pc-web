# Git 실무 마스터 치트시트 (기초부터 모노레포 커밋 규칙, 고급 기법, 응급 복구 총정리)

- **기준일**: 2026-10-25
- **짝꿍 스킬**: `git-advanced-workflows` (글로벌 설치 완료)
- **적용 대상**: 집과 사무실을 오가며 개발하거나 다중 프로젝트/모노레포를 관리할 때 필요한 모든 Git 명령어, 워크스페이스 표준 커밋 컨벤션(`<type>(<scope>): <한글 요약>`), 표준 `.gitignore` 템플릿, 충돌(Conflict) 해결 절차, 고급 기능(Rebase, Cherry-pick, Worktree, Tag) 및 실수 복구 시나리오를 정리한 레퍼런스입니다.

---

## 1. 새 PC 최초 1회 필수 글로벌 환경설정 (`git config`)

윈도우 환경에서 한글 파일명 깨짐, 줄바꿈(CRLF) 충돌, 긴 경로명 에러를 원천 차단하는 필수 초기 설정입니다.

```bash
# 1. 사용자 이름 및 이메일 등록
git config --global user.name "사용자이름"
git config --global user.email "이메일@example.com"

# 2. [윈도우 필수] 한글 파일명이 \355\225\234... 처럼 8진수로 깨져 보이는 현상 해결
git config --global core.quotepath false

# 3. [윈도우 필수] 윈도우(CRLF)와 리눅스/맥(LF) 줄바꿈 자동 변환 설정
git config --global core.autocrlf true

# 4. [윈도우 필수] 파일 경로가 260자를 넘을 때 발생하는 Filename too long 에러 방지
git config --global core.longpaths true

# 5. 윈도우 자격증명 관리자(Credential Manager)에 GitHub 로그인 정보 영구 저장
git config --global credential.helper manager

# 6. 기본 브랜치 이름을 master 대신 main으로 고정
git config --global init.defaultBranch main

# 7. git pull 할 때 불필요한 병합 커밋이 생기지 않도록 기본 동작 지정
git config --global pull.rebase false

# 8. 단축 명령어(Alias) 등록해 두기 (git lg 만 치면 그래프 로그가 출력됨)
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 HEAD --stat"

# 9. 현재 적용된 전체 설정값 및 설정 파일 위치 확인
git config --list --show-origin
```

---

## 2. 워크스페이스 표준 커밋 메시지 규칙 (Conventional Commits)

`.agents/rules/git-workflow.md`에 정의된 표준 커밋 컨벤션입니다. 타입(Type)과 범위(Scope)는 영문 소문자, 커밋 요약 및 본문은 한글로 작성합니다.

```plaintext
<type>(<scope>): <한글 커밋 요약>

[선택적 본문: 변경 이유 및 상세 내용 (한글)]
```

### 2.1. 허용되는 Type 8종 및 작성 예시
- **`feat` (새로운 기능 추가)**:
  - 예시: `feat(scroll-capture): 화면 및 창 녹화 파이프라인 추가`
  - 예시: `feat(api): 사용자 인증 JWT 토큰 갱신 엔드포인트 추가`
- **`fix` (버그 및 예외 수정)**:
  - 예시: `fix(popup): 미디어 스트림 오류 해결 및 다국어 알림 개선`
  - 예시: `fix(worker): 백그라운드 세션 타임아웃 예외 처리 수정`
- **`docs` (문서 및 README 수정)**:
  - 예시: `docs(reference): 실무 레퍼런스 스킬 및 MCP 가이드 최신화`
- **`refactor` (기능 변경 없는 구조 개선 및 파일 분리)**:
  - 예시: `refactor(scroll-capture): Canvas 슬라이스 추출 로직 모듈 분리`
- **`perf` (성능 및 메모리 최적화)**:
  - 예시: `perf(pdf): JPEG 인코딩 적용으로 PDF 생성 메모리 60% 절감`
- **`style` (코드 포맷팅, 세미콜론 등)**:
  - 예시: `style(ui): Tailwind CSS 클래스 정렬 및 Biome 포맷 적용`
- **`test` (테스트 코드 추가 및 수정)**:
  - 예시: `test(content): 스크롤 타깃 감지 단위 테스트 추가`
- **`chore` (빌드, 패키지, 규칙 설정)**:
  - 예시: `chore(workspace): skills.sh 에이전트 스킬 추가 및 .gitignore 갱신`

---

## 3. 저장소 생성, 복제(Clone) 및 원격(Remote) 관리

### 3.1. 저장소 초기화 및 복제
- **현재 폴더를 Git 저장소로 초기화**:
  - 명령: `git init`
- **GitHub 저장소 통째로 가져오기**:
  - 명령: `git clone https://github.com/계정/저장소.git`
- **현재 빈 폴더 안에 하위 폴더 생성 없이 바로 내용만 복제**:
  - 명령: `git clone https://github.com/계정/저장소.git .`
- **특정 브랜치만 지정하여 복제**:
  - 명령: `git clone -b develop --single-branch <주소>`
- **과거 이력을 제외하고 최신 커밋만 초고속 복제**:
  - 명령: `git clone --depth 1 <주소>`

### 3.2. 원격 저장소(Remote) 연결 및 관리
- **연결된 원격 저장소 주소 확인**:
  - 명령: `git remote -v`
- **로컬 폴더에 GitHub 원격 주소 최초 연결**:
  - 명령: `git remote add origin <주소>`
- **연결된 GitHub 원격 주소 변경**:
  - 명령: `git remote set-url origin <새주소>`
- **원격에서 삭제된 브랜치 잔재를 내 PC 목록에서도 정리**:
  - 명령: `git fetch --all --prune`

---

## 4. 일일 작업 흐름 (상태 확인 -> 스테이징 -> 커밋 -> 동기화)

### 4.1. 상태 확인 및 파일 담기 (`status`, `add`)
```bash
# 전체 상태 자세히 보기 / 한 줄 요약으로 깔끔하게 보기
git status
git status -s

# 수정/생성/삭제된 모든 파일을 스테이지에 담기
git add .

# 특정 파일이나 특정 확장자(예: 모든 .py 파일)만 골라서 담기
git add app/main.py
git add "*.py"

# 한 파일 안에서 일부분(특정 함수만) 골라서 나누어 커밋하고 싶을 때 (대화형 선택)
git add -p 파일명.py
```

### 4.2. 커밋 생성 (`commit`)
```bash
# 한 줄 메시지로 커밋하기
git commit -m "feat(api): 사용자 인증 JWT 토큰 갱신 엔드포인트 추가"

# 제목과 상세 본문(여러 줄)을 나누어 자세하게 커밋하기
git commit -m "fix(auth): 리프레시 토큰 만료 검증 오류 수정" -m "- 만료 시간 오차 허용범위 5초 검증 추가
- 401 응답 수신 시 자동 토큰 재발급 호출"

# 이미 추적 중인(Tracked) 수정 파일들은 git add 생략하고 바로 커밋하기 (신규 파일 제외)
git commit -am "refactor(service): 데이터 처리 서비스 모듈 분리"
```

### 4.3. 원격 저장소와 주고받기 (`fetch`, `pull`, `push`)
```bash
# 1. 내 코드를 건드리지 않고 GitHub에 새로 올라온 이력만 먼저 안전하게 받아오기
git fetch origin

# 2. 내가 아직 병합하지 않은 원격의 새로운 커밋 목록 미리 확인하기
git log HEAD..origin/main --oneline

# 3. GitHub 최신 내용을 내 코드에 병합하기
git pull origin main

# 4. 내 커밋들을 GitHub로 올리기 (최초 1회는 -u 옵션으로 기본 업스트림 지정)
git push -u origin main
git push
```

---

## 5. 브랜치(Branch), 병합(Merge), 리베이스(Rebase), 체리픽(Cherry-pick)

### 5.1. 브랜치 생성 및 이동 (`switch` / `branch`)
```bash
# 로컬 브랜치 목록 확인 / 원격 포함 전체 브랜치 확인
git branch -v
git branch -av

# 새 브랜치를 만들고 즉시 해당 브랜치로 이동하기
git switch -c feature/scroll-capture/pdf-toc

# 기존 브랜치로 이동하기 / 직전에 있던 브랜치로 돌아가기
git switch main
git switch -

# 현재 브랜치 이름 변경하기
git branch -m 새브랜치이름

# 원격에만 있는 다른 브랜치를 로컬로 가져와서 이동하기
git fetch origin
git switch -c feature/other origin/feature/other
```

### 5.2. 브랜치 합치기 3가지 방식 (`merge` vs `--squash` vs `rebase`)
```bash
# 먼저 흡수할 기준 브랜치(main)로 이동
git switch main

# [방식 1. 일반 병합] 작업 이력을 그대로 보존하며 합치기
git merge feature/auth

# [방식 2. 스쿼시 병합] 브랜치의 여러 커밋을 1개의 커밋으로 압축하여 합치기
git merge --squash feature/auth
git commit -m "feat(auth): 소셜 로그인 및 권한 검증 통합 구현 완료"

# [방식 3. 리베이스] 분기선 없이 일직선의 히스토리로 정렬하기
git switch feature/auth
git rebase main
git switch main
git merge feature/auth
```

### 5.3. 체리픽 (`cherry-pick`) — 다른 브랜치의 특정 커밋 1개만 가져오기
```bash
# 특정 커밋 1개(예: 9f8e7d6)만 현재 브랜치로 복사해 오기
git cherry-pick 9f8e7d6

# 커밋은 생성하지 않고 해당 수정 코드만 현재 워킹 디렉터리로 가져오기 (-n)
git cherry-pick -n 9f8e7d6
```

---

## 6. 충돌(Merge Conflict) 해결 절차

### 6.1. 충돌 파일 내부 기호의 의미
```plaintext
<<<<<<< HEAD (현재 내 PC에 있던 코드)
PORT = 8701
======= (구분선)
PORT = 8707
>>>>>>> origin/main (GitHub에서 새로 내려온 코드)
```

### 6.2. 충돌 해결 명령어 순서
```bash
# 1. 어떤 파일에서 충돌이 발생했는지 확인 (UU 표시된 파일)
git status

# 2. [해결법 A - 직접 수정] 편집기에서 <<<, ===, >>> 기호를 제거하고 원하는 코드로 수정한 뒤:
git add 충돌해결한파일.py
git commit -m "chore(merge): 포트 번호 충돌 해결"

# 3. [해결법 B - 내 코드로 일괄 선택] 충돌 난 파일을 현재 내 PC 코드(ours)로 덮어쓰기
git checkout --ours 충돌난파일.py
git add 충돌난파일.py

# 4. [해결법 C - 원격 코드로 일괄 선택] 충돌 난 파일을 원격 최신 코드(theirs)로 덮어쓰기
git checkout --theirs 충돌난파일.py
git add 충돌난파일.py

# 5. [병합 취소] 병합이나 리베이스 시도 전 상태로 즉시 복구하기
git merge --abort
git rebase --abort
```

---

## 7. 임시 서랍 (`git stash`) 활용법

```bash
# 1. 새로 만든 파일(-u)까지 포함해서 메모와 함께 임시 서랍에 보관
git stash push -u -m "데이터 익스포트 모듈 수정 중"

# 2. 특정 파일 1개만 골라서 임시 서랍에 보관
git stash push -m "설정파일만 임시보관" config.py

# 3. 서랍 목록 확인 (stash@{0}, stash@{1} ...)
git stash list

# 4. 특정 서랍(예: 0번)의 변경 코드 미리 보기
git stash show -p stash@{0}

# 5. 가장 최근 서랍 꺼내서 적용 후 삭제(pop) / 서랍에 남겨둔 채 적용만 하기(apply)
git stash pop
git stash apply stash@{1}

# 6. 특정 서랍 1개 삭제 / 전체 서랍 비우기
git stash drop stash@{0}
git stash clear
```

---

## 8. 변경 내역 추적, 코드 작성자 확인(`blame`), 검색(`grep`)

```bash
# 1. 커밋 그래프 로그 보기 (최근 20개)
git log --oneline --graph --decorate --all -n 20

# 2. 특정 기간 또는 특정 작성자의 커밋만 필터링
git log --since="2026-10-01" --until="2026-10-25" --oneline
git log --author="hskang" --oneline

# 3. 두 브랜치(main과 develop) 사이에 변경된 파일 목록만 비교
git diff --name-status main..develop

# 4. 과거 전체 커밋 중에서 특정 문자열("0xf1" 등)이 추가되거나 삭제된 커밋 찾기 (-S)
git log -S "0xf1" --oneline -p

# 5. 특정 파일의 특정 라인(예: 10~30줄)을 누가 언제 수정했는지 추적 (Blame)
git blame -L 10,30 app/parser.py

# 6. 과거 시점(예: 3커밋 전)의 파일 내용을 워킹 디렉터리 변경 없이 출력
git show HEAD~3:app/main.py
```

---

## 9. 실수 복구 10대 시나리오 처방전

### 시나리오 01. 워킹 디렉터리에서 수정한 코드를 모두 버리고 마지막 커밋 상태로 초기화
- **명령**: `git restore . && git clean -fd`

### 시나리오 02. 특정 파일 1개만 과거 특정 커밋(`a1b2c3d`) 시점의 내용으로 복원
- **명령**: `git restore --source=a1b2c3d 파일경로.py`

### 시나리오 03. `git add .`를 취소하고 스테이지에서만 내리기 (작성한 코드는 보존)
- **명령**: `git restore --staged .`

### 시나리오 04. 방금 커밋했는데 파일 1개를 누락했거나 커밋 메시지 오타를 수정하고 싶을 때
- **명령**: `git add 누락된파일 && git commit --amend -m "새 커밋 메시지"`

### 시나리오 05. 방금 한 로컬 커밋을 취소하되, 작성한 코드는 워킹 디렉터리에 그대로 남기고 싶을 때
- **명령**: `git reset --soft HEAD~1`

### 시나리오 06. 최근 2개의 로컬 커밋과 수정했던 코드까지 완전히 삭제하고 싶을 때
- **명령**: `git reset --hard HEAD~2`

### 시나리오 07. 이미 GitHub에 `push`한 커밋을 안전하게 되돌리는 취소 커밋 생성
- **명령**: `git revert HEAD && git push`

### 시나리오 08. 로컬 작업을 모두 버리고 GitHub 원격 저장소(`origin/main`)와 100% 동일하게 강제 동기화
- **명령**: `git fetch origin && git reset --hard origin/main && git clean -fd`

### 시나리오 09. 실수로 `.env`나 `.venv`, `node_modules`를 커밋하여 Git 추적 목록에서만 제거하고 싶을 때 (실제 로컬 파일은 유지)
- **명령**: `git rm -r --cached .venv && git commit -m "chore: venv 추적 제거"`

### 시나리오 10. `git reset --hard`를 잘못 실행해 날아간 커밋을 다시 복구하고 싶을 때
- **명령**: `git reflog` 실행 후 복구할 해시값을 찾아 `git reset --hard <해시값>`

---

## 10. 배포 버전 태깅(`tag`) 및 멀티 폴더 작업(`worktree`)

### 10.1. 릴리스 버전 태그 생성 (`v1.0.0` 등)
```bash
# 현재 커밋에 버전 설명과 함께 태그 생성
git tag -a v1.0.0 -m "2026년 정식 1.0 릴리스 버전"

# 생성된 태그 목록 확인
git tag -n

# 태그를 GitHub 원격 저장소로 업로드
git push origin v1.0.0
git push origin --tags
```

### 10.2. Git Worktree — 하나의 저장소에서 두 개의 브랜치를 별도 폴더로 동시에 열기
```bash
# 현재 프로젝트 옆(../hotfix-folder)에 hotfix 브랜치를 별도 폴더로 즉시 생성
git worktree add ../hotfix-folder -b hotfix/session-timeout

# 연결된 워크트리 목록 확인
git worktree list

# 작업 완료 후 워크트리 폴더 제거
git worktree remove ../hotfix-folder
```

---

## 11. 파이썬 + Node.js(WXT/Electron/React) + 윈도우 통합 `.gitignore` 표준 템플릿

```gitignore
# Python 가상환경 및 캐시
__pycache__/
*.py[cod]
*$py.class
.venv/
venv/
env/
.pytest_cache/
.ruff_cache/
.mypy_cache/
dist/
build/
*.spec

# Node.js / WXT / Electron / React 빌드 산출물
node_modules/
.output/
.wxt/
out/
release/
*.tsbuildinfo

# 환경변수 및 보안 키 (절대 업로드 금지)
.env
.env.*
!.env.example
*.pem
*.key
*.crx

# 로컬 데이터베이스 및 대용량 로그/덤프 파일
*.db
*.sqlite
*.sqlite3
*.db-shm
*.db-wal
*.log
*.bin
*.pcap

# 오피스 임시 잠금 파일 (~$로 시작하는 엑셀/워드 임시파일)
~$*.xlsx
~$*.xlsm
~$*.docx
~$*.pptx

# Windows & IDE 설정
Thumbs.db
Desktop.ini
.DS_Store
.idea/
```
