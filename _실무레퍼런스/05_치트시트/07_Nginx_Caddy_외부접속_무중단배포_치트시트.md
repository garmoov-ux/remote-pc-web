# Nginx, Caddy 무료 HTTPS, 포트포워딩 없는 외부 접속(Cloudflare Tunnel / Tailscale) 실무 치트시트

- **기준일**: 2026-10-25
- **짝꿍 스킬 및 MCP**: `nginx-reverse-proxy`, `docker-compose-orchestration` + `Cloudflare MCP` / `Tailscale MCP`
- **적용 대상**: FastAPI나 도커로 구동한 웹/API 서버를 운영 환경에 배포할 때 필요한 ① Nginx 표준 설정(대용량 미디어 파일 업로드, WebSocket 실시간 스트림, 실제 클라이언트 IP 전달), ② 설정 3줄로 무료 HTTPS가 자동 갱신되는 Caddy, ③ 공유기 포트포워딩이나 고정 IP 없이 외부에서 안전하게 접속하는 Tailscale 및 Cloudflare Tunnel 구축 가이드입니다.

---

## 1. FastAPI 앞단에 Nginx 또는 Caddy 리버스 프록시를 두는 이유

1. **기본 포트(`80`/`443`) 및 도메인 연결**: URL 뒤에 `:8000` 포트 번호를 붙이지 않고 표준 도메인으로 접속할 수 있습니다.
2. **HTTPS(SSL/TLS) 암호화 처리**: 모바일 웹이나 브라우저에서 카메라, GPS, 화면 캡처(`getDisplayMedia`), 클립보드 API를 사용하려면 HTTPS 환경이 필수입니다.
3. **정적 파일(`.JPG`, `.MP4`, `.PDF`) 직접 서빙**: 파이썬 프로세스를 거치지 않고 디스크의 대용량 이미지와 영상을 프록시 서버가 직접 전송하여 백엔드 부하를 대폭 줄입니다.
4. **무중단 배포 및 다중 경로 분기**: 단일 도메인에서 `/api`는 FastAPI(`:8000`)로, `/`는 프론트엔드(`:3000` 또는 정적 폴더)로 분기합니다.

---

## 2. 실무 표준 `nginx.conf` 템플릿

대용량 파일 업로드(`100MB`), 실시간 WebSocket 연결 유지, 접속자 실제 IP 전달이 모두 포함된 설정입니다.

```nginx
server {
    listen 80;
    server_name app.example.com localhost;

    # [필수 1] 대용량 파일(고화질 이미지, 영상, 엑셀, PDF) 업로드 허용 크기 (기본값 1MB 제한 해제)
    client_max_body_size 100M;

    # [필수 2] 정적 이미지/영상 폴더를 Nginx가 직접 고속 서빙
    location /storage/ {
        alias /app/storage/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # [필수 3] FastAPI 백엔드 및 WebSocket 리버스 프록시
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;

        # 실제 접속 클라이언트 IP 및 프로토콜 전달
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 실시간 연결 유지 헤더
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 대량 엑셀 생성이나 장시간 쿼리 시 타임아웃 방지 (300초)
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;
    }
}
```

### Nginx 관리 필수 명령어
```bash
# 1. 설정 파일 문법 검사 (재적용 전 필수 실행)
sudo nginx -t

# 2. 활성 세션을 끊지 않고 설정만 즉시 반영 (무중단 리로드)
sudo nginx -s reload
# 도커 컨테이너인 경우:
docker exec nginx-proxy nginx -s reload
```

---

## 3. 설정 3줄로 무료 HTTPS를 자동 적용하는 `Caddy`

`Caddy`는 `Caddyfile`에 도메인만 적으면 Let's Encrypt SSL 인증서 발급과 90일 주기 자동 갱신을 별도 스크립트 없이 처리합니다.

### 3.1. `Caddyfile` 설정
```caddyfile
app.example.com {
    request_body {
        max_size 100MB
    }
    reverse_proxy localhost:8000
}
```

### 3.2. `docker-compose.yml`에 Caddy 추가하기
```yaml
services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy-proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
volumes:
  caddy_data:
  caddy_config:
```

---

## 4. 공유기 포트포워딩 및 고정 IP 없이 외부 접속 열기

방화벽 뒤에 있는 사내 서버나 개발 PC에 외부(자택, 스마트폰, 고객사)에서 접속해야 할 때 사용하는 2가지 표준 도구입니다.

### 4.1. 방법 A: `Tailscale` (나와 팀원 전용 초고속 사설 VPN 망)
- **적용 대상**: 외부 인터넷에 포트를 전혀 개방하지 않고, 내가 로그인한 기기(사무실 서버, 집 PC, 스마트폰)끼리만 고정 사설 IP(`100.x.y.z`)로 안전하게 직결할 때 사용합니다.
- **구축 절차**:
  1. 사무실 서버, 집 PC, 스마트폰에 각각 Tailscale을 설치하고 동일한 계정으로 로그인합니다.
  2. 부여된 `100.x.y.z` 형태의 고정 IP를 통해 공유기 포트포워딩 없이 어디서든 `http://100.x.y.z:8000`, SSH, 원격 데스크톱(RDP), DB에 즉시 접속합니다.

### 4.2. 방법 B: `Cloudflare Tunnel` (`cloudflared` — 불특정 다수 고객 및 외부 웹훅 공개용)
- **적용 대상**: 결제 PG사 웹훅 수신이나 외부 고객 시연처럼 일반 도메인 URL(`https://...`)로 외부 접속을 열어야 할 때 인바운드 포트 개방 없이 사용합니다.
- **임시 테스트용 (도메인 없이 3초 만에 로컬 8000번 포트를 외부 HTTPS 주소로 개방)**:
  ```powershell
  # Windows 설치: winget install Cloudflare.cloudflared
  cloudflared tunnel --url http://localhost:8000
  ```
  실행 즉시 `https://xxxx-xxxx.trycloudflare.com` 형태의 무료 HTTPS URL이 발급됩니다.
- **영구 도메인 연결용 (`docker-compose.yml` 등록)**:
  Cloudflare Zero Trust 대시보드에서 발급받은 터널 토큰(`TUNNEL_TOKEN`)을 컨테이너로 구동합니다.
  ```yaml
  services:
    cloudflared:
      image: cloudflare/cloudflared:latest
      container_name: cloudflared-tunnel
      restart: always
      command: tunnel --no-autoupdate run --token <발급받은_터널_토큰>
  ```
