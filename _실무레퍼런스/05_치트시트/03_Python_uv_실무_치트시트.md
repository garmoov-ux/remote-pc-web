# Python 차세대 패키지 매니저 `uv` 실무 마스터 치트시트 (`pyproject.toml` 표준 및 `.exe` 빌드 포함)

- **기준일**: 2026-10-25
- **짝꿍 스킬**: `uv-package-manager`, `python-code-style`, `python-packaging`
- **적용 대상**: 기존 파이썬의 `pip`, `venv`, `virtualenv`, `pyenv`, `poetry`, `pipx`를 단일 도구로 통합하고 설치 속도를 10~100배 향상시킨 `uv` 패키지 매니저의 핵심 명령어, 표준 `pyproject.toml`, 단일 `.exe` 빌드, 폐쇄망 오프라인 이관 절차를 정리한 레퍼런스입니다.

---

## 1. 기존 `pip + venv` 대비 `uv` 전환 핵심 이점

- **파이썬 버전 설치 자동화**: 파이썬 공식 홈페이지에서 설치 파일을 받을 필요 없이 `uv python install 3.12` 한 줄로 원하는 버전을 3초 만에 설치합니다.
- **가상환경 `activate` 생략**: 매번 `.venv\Scripts\activate`를 입력할 필요 없이 `uv run main.py`만 실행하면 자동으로 프로젝트 가상환경을 감지하여 실행합니다.
- **설치 속도 20~50배 향상**: 글로벌 캐시와 Rust 병렬 처리로 `fastapi`, `openpyxl` 등 수십 개 패키지를 1~2초 만에 설치합니다.
- **완벽한 버전 잠금 (`uv.lock`)**: `requirements.txt`의 하위 의존성 버전 불일치 문제를 해결하여 개발 PC와 운영 서버 환경을 100% 일치시킵니다.

---

## 2. `uv` 설치 및 자체 업데이트

```powershell
# 1. Windows PowerShell에서 uv 최초 설치
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 2. 이미 설치된 uv를 최신 버전으로 자체 업데이트
uv self update

# 3. 설치된 버전 확인
uv --version
```

---

## 3. 신규 파이썬 프로젝트 시작부터 실행까지 (표준 4단계 루틴)

```bash
# 1. 새 프로젝트 폴더(app-server) 생성 및 초기화 (pyproject.toml, .gitignore, main.py 자동 생성)
uv init app-server
cd app-server
# (이미 만들어진 폴더 안에서 초기화할 때는 폴더명 없이 uv init 실행)

# 2. 필수 라이브러리 추가 (.venv 가상환경 자동 생성 및 설치 동시 수행)
uv add fastapi "uvicorn[standard]" sqlalchemy asyncpg openpyxl

# 3. 개발 및 테스트 전용 도구(pytest, ruff, pyinstaller)는 --dev 옵션으로 분리 추가
uv add --dev pytest ruff pyinstaller

# 4. 가상환경 수동 활성화 없이 즉시 스크립트 및 서버 실행
uv run python main.py
uv run uvicorn app.main:app --reload --port 8000
uv run pytest
```

---

## 4. 패키지 추가, 삭제, 조회, 동기화 명령어

- **패키지 설치 및 `pyproject.toml` 자동 기록**:
  - 명령: `uv add <패키지명>`
- **특정 버전 범위 지정 설치**:
  - 명령: `uv add "fastapi>=0.115.0"`
- **GitHub 저장소에서 직접 설치**:
  - 명령: `uv add git+https://github.com/계정/저장소`
- **패키지 삭제 및 미사용 하위 의존성 정리**:
  - 명령: `uv remove <패키지명>`
- **설치된 패키지 의존성 트리 구조 확인**:
  - 명령: `uv tree`
- **`git pull` 이후 `uv.lock` 기준으로 가상환경 완벽 동기화**:
  - 명령: `uv sync`
- **특정 패키지만 최신 버전으로 업그레이드**:
  - 명령: `uv lock --upgrade-package fastapi && uv sync`
- **전체 패키지를 최신 호환 버전으로 일괄 업그레이드**:
  - 명령: `uv lock --upgrade && uv sync`

---

## 5. 파이썬(Python) 인터프리터 버전 관리 명령어

```bash
# 1. 현재 PC에 설치된 파이썬 버전 및 설치 가능 목록 확인
uv python list

# 2. 특정 파이썬 버전(단일 또는 복수) 초고속 다운로드 및 설치
uv python install 3.12
uv python install 3.11 3.12 3.13

# 3. 현재 프로젝트 폴더의 파이썬 버전을 3.12로 고정 (.python-version 파일 생성)
uv python pin 3.12

# 4. 특정 파이썬 버전으로 가상환경(.venv) 재생성
uv venv --python 3.12
```

---

## 6. 실무 표준 `pyproject.toml` 템플릿 (`Ruff` 및 `Pytest` 통합)

```toml
[project]
name = "app-server"
version = "1.0.0"
description = "통합 백엔드 API 및 데이터 처리 서버"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "openpyxl>=3.1.5",
]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]
```

---

## 7. 기존 구형 프로젝트(`requirements.txt`) 호환 명령어 (`uv pip`)

```bash
# 1. 현재 폴더에 .venv 가상환경 생성
uv venv

# 2. 기존 requirements.txt를 읽어 초고속 설치
uv pip install -r requirements.txt

# 3. 개별 패키지 설치 및 목록 확인
uv pip install opencv-python pillow
uv pip list

# 4. 최신 uv 프로젝트(pyproject.toml)에서 구형 배포용 requirements.txt 추출
uv export --format requirements-txt --no-hashes > requirements.txt
```

---

## 8. 단발성 스크립트 실행 및 독립 CLI 도구 실행 (`uvx`)

### 8.1. 가상환경 폴더 생성 없이 단일 `.py` 스크립트 즉시 실행
```bash
# test.py 실행 시 필요한 패키지를 즉석에서 임시 로드하여 실행
uv run --with openpyxl --with requests test.py
```

또는 스크립트 상단에 PEP 723 인라인 메타데이터 주석을 추가하면 `uv run script.py`만으로 실행됩니다:
```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "openpyxl",
#     "requests",
# ]
# ///

import openpyxl
import requests
print("별도 가상환경 설정 없이 단일 파일만으로 실행됩니다.")
```

### 8.2. `uvx` (`uv tool run`) — 전역 오염 없이 파이썬 CLI 도구 즉시 실행
```bash
# 1. 설치 없이 현재 폴더 코드 스타일 검사 및 포매팅
uvx ruff check .
uvx ruff format .

# 2. MarkItDown으로 PDF/엑셀/워드를 마크다운으로 즉시 변환
uvx markitdown manual.pdf > manual.md

# 3. 자주 쓰는 CLI 도구를 PC 전역 명령어로 영구 설치
uv tool install ruff
uv tool list
```

---

## 9. 단일 실행 파일(`.exe`) 빌드 (`PyInstaller` 및 `Nuitka`)

```bash
# 1. 개발 의존성으로 pyinstaller 추가
uv add --dev pyinstaller

# 2. 콘솔 창이 표시되는 일반 CLI/서버용 단일 .exe 빌드 (-F)
uv run pyinstaller -F --name "App_Server" main.py

# 3. 검은 콘솔 창을 숨기는 GUI/백그라운드 엔진용 단일 .exe 빌드 (-F -w)
uv run pyinstaller -F -w --name "Report_Engine" app.py

# 4. 소스코드 디컴파일 방지가 필요한 외부 납품용 C 컴파일 기반 Nuitka 빌드
uv run --with nuitka python -m nuitka --standalone --onefile --windows-console-mode=disable app.py
```

---

## 10. 캐시 정리 및 폐쇄망(오프라인) 패키지 이관

```bash
# 1. uv 글로벌 캐시 경로 확인 및 미사용 캐시 정리
uv cache dir
uv cache prune

# 2. [인터넷 연결 PC] 현재 프로젝트의 모든 패키지 설치 파일(.whl)을 wheels 폴더로 다운로드
uv export --format requirements-txt --no-hashes > requirements.txt
pip download -r requirements.txt -d ./wheels

# 3. [폐쇄망 서버] 인터넷 없이 로컬 wheels 폴더에서 오프라인 설치
uv pip install --no-index --find-links=./wheels -r requirements.txt
```
