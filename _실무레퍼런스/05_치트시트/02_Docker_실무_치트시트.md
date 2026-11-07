# Docker 및 Docker Compose 실무 마스터 치트시트 (구축, 멀티스테이지 Dockerfile, 폐쇄망 배포, 트러블슈팅)

- **기준일**: 2026-10-25
- **짝꿍 스킬 및 MCP**: `docker-containerization`, `docker-compose-orchestration` + `Docker MCP` (`@docker/mcp`)
- **적용 대상**: 서버나 개발 PC에서 도커(Docker)를 활용하여 데이터베이스(`PostgreSQL`, `MariaDB`, `Redis`), 파이썬 백엔드(`FastAPI`/TCP 서버), 프론트엔드(`Nginx`/`Caddy`/`React`)를 구축하고 운영할 때 필요한 명령어, `uv` 기반 `Dockerfile`, 폐쇄망 `.tar` 이관 절차, 그리고 Windows WSL2 트러블슈팅을 정리한 레퍼런스입니다.

---

## 1. Docker 핵심 개념 4가지 요약

1. **이미지 (Image)**: 프로그램과 실행 환경을 패키징한 읽기 전용 템플릿입니다 (예: `postgres:16-alpine`).
2. **컨테이너 (Container)**: 이미지를 실행하여 메모리에 구동 중인 격리된 프로세스입니다.
3. **볼륨 (Volume / Bind Mount)**: 컨테이너를 삭제하거나 재빌드해도 DB 데이터나 업로드 미디어 파일이 유실되지 않도록 호스트 PC의 실제 디스크 폴더와 연결하는 통로입니다.
4. **도커 컴포즈 (Docker Compose)**: 백엔드, DB, 캐시 서버 등 복수의 컨테이너와 네트워크/볼륨 설정을 `docker-compose.yml` 파일 하나로 정의하여 일괄 제어하는 오케스트레이션 도구입니다.

---

## 2. 컨테이너 생명주기 및 정밀 제어 명령어 (`docker`)

### 2.1. 컨테이너 실행 옵션 해부 (`docker run`)
```bash
docker run -d \
  --name app-api \                      # 컨테이너 이름 지정
  --restart always \                    # 서버 재부팅이나 비정상 종료 시 자동 재시작
  -p 8000:8000 \                        # [호스트포트]:[컨테이너내부포트] 연결
  -p 9001-9005:9001-9005 \              # 복수 통신 포트 범위 일괄 개방
  -e TZ=Asia/Seoul \                    # 컨테이너 내부 시간을 한국 표준시(KST)로 고정
  -e DATABASE_URL="postgresql://..." \  # 환경변수 주입
  -v D:/App_Storage:/app/storage \      # [호스트폴더]:[컨테이너내부폴더] 마운트
  --memory="4g" --cpus="2.0" \          # 컨테이너 자원 상한선 제한
  app-server:1.0                        # 실행할 이미지 이름:태그
```

### 2.2. 컨테이너 조회, 접속, 파일 복사, 상태 점검 명령어
- **실행 중인 컨테이너 확인**:
  - 명령: `docker ps`
- **종료된(`Exited`) 컨테이너까지 모두 확인**:
  - 명령: `docker ps -a`
- **실시간 CPU, 메모리(RAM), 네트워크 I/O 사용량 모니터링**:
  - 명령: `docker stats`
- **컨테이너 내부 셸(터미널) 접속**:
  - 명령: `docker exec -it <컨테이너이름> bash` (alpine 이미지는 `sh`)
- **루트(Root) 관리자 권한으로 컨테이너 내부 접속**:
  - 명령: `docker exec -u 0 -it <컨테이너이름> bash`
- **컨테이너 외부에서 단일 명령어만 실행하고 결과 출력**:
  - 명령: `docker exec <컨테이너이름> python -V`
- **호스트 PC에서 컨테이너 내부로 파일 복사**:
  - 명령: `docker cp ./config.json <컨테이너이름>:/app/`
- **컨테이너 내부에서 호스트 PC로 로그/결과 파일 추출**:
  - 명령: `docker cp <컨테이너이름>:/app/logs/app.log ./`
- **컨테이너 내부 상세 설정(내부 IP, 볼륨 경로, 환경변수) 조회**:
  - 명령: `docker inspect <컨테이너이름>`
- **최초 이미지 대비 컨테이너 내부에서 변경된 파일 목록 추적**:
  - 명령: `docker diff <컨테이너이름>`
- **실행 중인 컨테이너의 현재 상태를 새로운 이미지로 저장**:
  - 명령: `docker commit <컨테이너이름> my-backup:1.0`

---

## 3. 로그(Logs) 분석 및 디버깅 명령어

```bash
# 1. 실시간 로그 스트리밍 확인 (종료는 Ctrl + C)
docker logs -f <컨테이너이름>

# 2. 최근 100줄만 자르고 타임스탬프(-t)까지 함께 표시
docker logs -f --tail 100 -t <컨테이너이름>

# 3. 특정 시간대(최근 30분 또는 지정 시각 구간)의 로그만 필터링
docker logs --since 30m <컨테이너이름>
docker logs --since "2026-10-25T09:00:00" --until "2026-10-25T10:00:00" <컨테이너이름>

# 4. 로그 중에서 "ERROR"나 특정 에러 코드("ERR_500")가 포함된 줄만 검색 (PowerShell)
docker logs <컨테이너이름> 2>&1 | Select-String "ERR_500|ERROR"
```

---

## 4. `Docker Compose` 실무 명령어

- **전체 서비스 백그라운드 시작**:
  - 명령: `docker compose up -d`
- **소스코드 수정 후 이미지 재빌드 및 컨테이너 교체 시작**:
  - 명령: `docker compose up -d --build`
- **DB 등 다른 컨테이너는 건드리지 않고 특정 서비스(`backend`) 1개만 재빌드 및 재시작**:
  - 명령: `docker compose up -d --no-deps --build backend`
- **현재 프로젝트 컨테이너들의 상태(`healthy`) 및 오픈 포트 확인**:
  - 명령: `docker compose ps`
- **전체 서비스 또는 특정 서비스(`backend`) 실시간 로그 보기**:
  - 명령: `docker compose logs -f` / `docker compose logs -f backend`
- **컨테이너 및 네트워크 종료 (볼륨 및 바인드 마운트 데이터는 안전하게 보존됨)**:
  - 명령: `docker compose down`
- **컨테이너와 함께 볼륨 데이터까지 완전 초기화 (DB 초기화 시에만 주의해서 사용)**:
  - 명령: `docker compose down -v`
- **`docker-compose.yml` 문법 검증 및 `.env` 환경변수 치환 결과 미리 확인**:
  - 명령: `docker compose config`
- **운영 서버용 별도 컴포즈 파일(`docker-compose.prod.yml`) 지정 실행**:
  - 명령: `docker compose -f docker-compose.prod.yml up -d`

---

## 5. 파이썬(`uv` + `FastAPI`) 실무 표준 `Dockerfile` 템플릿 (타임존 및 한글 폰트 포함)

`uv`를 활용하여 빌드 속도를 극대화하고, PDF/이미지 생성 시 한글 깨짐 방지(`fonts-nanum`), OpenCV 의존성(`libgl1`), 한국 표준시(`Asia/Seoul`)를 모두 반영한 표준 템플릿입니다.

```dockerfile
# backend/Dockerfile
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

ENV TZ=Asia/Seoul \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata \
    fonts-nanum \
    libgl1 \
    libglib2.0-0 \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 파일만 먼저 복사하여 도커 레이어 캐시 활용
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-install-project --no-dev

# 애플리케이션 소스 복사
COPY . .

EXPOSE 8000 8701-8708

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 6. 도커 네트워크 및 볼륨 핵심 규칙

- **컨테이너 간 통신**: 동일한 `docker-compose.yml` 내의 컨테이너끼리는 `localhost`가 아니라 서비스 이름(예: `db`, `redis`)을 호스트 주소로 사용합니다 (예: `postgresql://admin:password123@db:5432/app_db`).
- **컨테이너 내부에서 호스트(Windows PC) 프로그램에 접속할 때**: `localhost` 대신 `host.docker.internal` 도메인을 사용합니다.
- **볼륨 마운트 구분**:
  - **Named Volume (`pg_data:/var/lib/postgresql/data`)**: 도커 엔진이 관리하는 스토리지 영역에 안전하게 보관합니다.
  - **Bind Mount (`D:/App_Storage:/app/storage`)**: 윈도우 탐색기에서 직접 열람 가능한 실제 폴더와 1:1로 직결합니다 (업로드 미디어, 엑셀 보고서 보관 시 권장).

---

## 7. 오프라인(폐쇄망/사내망) 서버로 도커 이미지 통째 이관하기

인터넷이 차단된 사내 폐쇄망 서버에 도커 컨테이너를 배포하는 4단계 절차입니다.

```bash
# [1단계: 인터넷 연결 개발 PC] 프로젝트 이미지 빌드 및 베이스 이미지 다운로드
docker compose build
docker compose pull

# [2단계: 인터넷 연결 개발 PC] 필요한 모든 이미지를 단일 .tar 파일로 묶어 추출
docker save -o app_all_images.tar app-server:latest postgres:16-alpine redis:7-alpine

# [3단계: 보안 USB/외장하드로 파일 3개 복사]
# -> 1) app_all_images.tar  2) docker-compose.yml  3) .env 설정파일

# [4단계: 폐쇄망 운영 서버] 이미지 로드 및 빌드 없이 즉시 컨테이너 시작
docker load -i app_all_images.tar
docker compose up -d --no-build
```

---

## 8. 실무 서비스 통합 `docker-compose.yml` 표준 템플릿

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: app_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password123}
      POSTGRES_DB: ${DB_NAME:-app_db}
      TZ: Asia/Seoul
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./init_sql:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-admin} -d ${DB_NAME:-app_db}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: app_redis
    restart: always
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - ./data/redis:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: app-server:latest
    container_name: app_backend
    restart: always
    environment:
      TZ: Asia/Seoul
      DATABASE_URL: postgresql+asyncpg://${DB_USER:-admin}:${DB_PASSWORD:-password123}@db:5432/${DB_NAME:-app_db}
      REDIS_URL: redis://redis:6379/0
    ports:
      - "8000:8000"
      - "9001-9005:9001-9005"
    volumes:
      - ./backend/app:/app/app
      - D:/App_Storage:/app/storage
      - ./logs:/app/logs
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

---

## 9. Windows 환경 도커 트러블슈팅

### 9.1. `Bind for 0.0.0.0:5432 failed: port is already allocated` (포트 충돌)
호스트 윈도우 PC에서 이미 다른 프로세스가 해당 포트를 점유 중일 때 발생합니다.
```powershell
# 1. 해당 포트(예: 5432)를 점유 중인 PID 확인
netstat -ano | findstr :5432

# 2. 프로세스 이름 확인 후 강제 종료 (또는 docker-compose.yml의 호스트 포트를 "5433:5432"로 변경)
tasklist | findstr <PID>
taskkill /PID <PID> /F
```

### 9.2. `VmmemWSL` 프로세스가 메모리를 과도하게 점유할 때
1. **즉시 메모리 반환**: PowerShell에서 `wsl --shutdown` 실행 후 Docker Desktop 재시작.
2. **영구 상한선 설정**: `%USERPROFILE%\.wslconfig` 파일에 아래 내용을 저장합니다.
   ```ini
   [wsl2]
   memory=4GB
   processors=4
   autoMemoryReclaim=gradual
   ```

### 9.3. 미사용 이미지 및 빌드 캐시 일괄 정리 (디스크 용량 확보)
```bash
docker system prune -a -f
docker builder prune -a -f
```
