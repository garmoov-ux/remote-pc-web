# SQL 쿼리 실무 마스터 치트시트 (PostgreSQL 및 SQLite 공통 + 서비스 통계/피벗/파티셔닝 실전 쿼리)

- **기준일**: 2026-10-25
- **짝꿍 스킬 및 MCP**: `postgresql`, `sqlite-embedded-db`, `sql-query-optimization` + `PostgreSQL MCP` / `SQLite MCP`
- **적용 대상**: 데이터베이스(`PostgreSQL`, `SQLite`, `MariaDB`)를 다룰 때 즉시 복사해 사용할 수 있는 테이블/인덱스 설계, 조건부 피벗 집계, 비활성 노드 추출(`LEFT JOIN ... IS NULL`), 날짜/시간대별 통계, `UPSERT`, 윈도우 함수(`ROW_NUMBER`), 대용량 월별 파티셔닝 및 쿼리 튜닝 레퍼런스입니다.

---

## 1. 테이블 생성(DDL) 및 인덱스 설계 표준

### 1.1. 테이블 생성 (`CREATE TABLE`)
```sql
-- 1. 서비스 노드(클라이언트/인스턴스) 마스터 테이블
CREATE TABLE IF NOT EXISTS service_nodes (
    node_id VARCHAR(20) PRIMARY KEY,              -- 노드 고유 식별자 (예: 'SRV-001')
    node_name VARCHAR(256) NOT NULL,              -- 노드/지점 명칭
    ip_address VARCHAR(45),                       -- 접속 IP 주소
    longitude DOUBLE PRECISION,                   -- 경도 좌표
    latitude DOUBLE PRECISION,                    -- 위도 좌표
    is_clustered BOOLEAN DEFAULT FALSE,           -- 이중화 클러스터 여부
    status SMALLINT DEFAULT 0,                    -- 0: 정상, 1: 연결지연, 2: 점검중
    last_connected_at TIMESTAMP,                  -- 마지막 헬스체크 시각
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 이벤트 및 트랜잭션 로그 테이블
CREATE TABLE IF NOT EXISTS event_logs (
    id BIGSERIAL PRIMARY KEY,                     -- 자동 증가 일련번호 (SQLite는 INTEGER PRIMARY KEY AUTOINCREMENT)
    node_id VARCHAR(20) NOT NULL,                 -- 노드 식별자 ('SRV-001')
    event_key VARCHAR(32) NOT NULL,               -- 이벤트 고유 키 ('20261025093000123')
    occurred_at TIMESTAMP NOT NULL,               -- 날짜/시간 연산용 타임스탬프
    channel_code VARCHAR(10) NOT NULL,            -- 채널 구분 ('WEB', 'APP', 'EXT', 'API')
    event_type VARCHAR(10) NOT NULL,              -- 이벤트 유형 ('INFO', 'WARN', 'ERROR', 'BILLING')
    user_email VARCHAR(120),                      -- 요청 사용자 이메일
    response_ms INTEGER,                          -- 응답 소요 시간 (ms)
    payload_kb INTEGER,                           -- 처리 데이터 크기 (KB)
    attachment_path VARCHAR(500),                 -- 첨부 파일/리포트 저장 경로
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (node_id, event_key, channel_code)
);
```

### 1.2. 검색 속도를 높이는 복합 인덱스 생성 (`CREATE INDEX`)
```sql
-- 기간별 + 노드별 조회용 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_event_logs_node_time ON event_logs (node_id, occurred_at DESC);

-- 사용자 이메일 검색용 인덱스
CREATE INDEX IF NOT EXISTS idx_event_logs_user_email ON event_logs (user_email);

-- 발생일자 단독 조회용 인덱스
CREATE INDEX IF NOT EXISTS idx_event_logs_occurred_at ON event_logs (occurred_at DESC);
```

### 1.3. 운영 중 테이블 구조 변경 (`ALTER TABLE`)
```sql
-- 새 컬럼 추가
ALTER TABLE service_nodes ADD COLUMN region_group VARCHAR(50) DEFAULT '미지정';

-- 컬럼 이름 변경
ALTER TABLE service_nodes RENAME COLUMN node_name TO display_name;

-- 컬럼 데이터 타입 또는 길이 변경 (PostgreSQL)
ALTER TABLE service_nodes ALTER COLUMN region_group TYPE VARCHAR(100);

-- 컬럼 삭제
ALTER TABLE service_nodes DROP COLUMN region_group;
```

---

## 2. 데이터 조회(`SELECT`) 및 조건 필터링(`WHERE`)

```sql
-- 1. 특정 기간 데이터 조회 (인덱스 최적화를 위해 >= 와 < 조합 권장)
SELECT node_id, user_email, channel_code, response_ms, occurred_at
FROM event_logs
WHERE occurred_at >= '2026-10-01 00:00:00'
  AND occurred_at <  '2026-10-26 00:00:00'
ORDER BY occurred_at DESC
LIMIT 100 OFFSET 0;

-- 2. 복수 노드 식별자 조건 조회 (IN)
SELECT * FROM event_logs
WHERE node_id IN ('SRV-001', 'SRV-002', 'SRV-010');

-- 3. 특정 채널 접두사 및 이메일 부분 일치 검색 (LIKE)
SELECT * FROM event_logs
WHERE channel_code LIKE 'API%'
  AND user_email LIKE '%@example.com';

-- 4. 사용자 식별자 미등록(NULL 또는 빈 문자열) 로그만 추출
SELECT * FROM event_logs
WHERE user_email IS NULL OR TRIM(user_email) = '';

-- 5. 중복 제거 후 로그가 수신된 노드 목록만 추출 (DISTINCT)
SELECT DISTINCT node_id FROM event_logs;
```

---

## 3. 조건문(`CASE WHEN`)과 NULL 치환(`COALESCE`)

```sql
SELECT 
    node_id,
    user_email,
    -- 1. 채널 코드별 한글 명칭 변환
    CASE 
        WHEN channel_code = 'EXT' THEN '크롬 확장앱'
        WHEN channel_code = 'WEB' THEN '웹 대시보드'
        WHEN channel_code = 'APP' THEN '모바일/데스크톱 앱'
        ELSE '외부 API (' || channel_code || ')'
    END AS channel_label,
    
    -- 2. 이벤트 유형 한글 명칭 변환
    CASE event_type
        WHEN 'INFO'    THEN '정상 처리'
        WHEN 'WARN'    THEN '지연 경고'
        WHEN 'ERROR'   THEN '시스템 오류'
        WHEN 'BILLING' THEN '결제/구독'
        ELSE '기타(' || event_type || ')'
    END AS event_type_name,
    
    -- 3. NULL 안전 치환
    COALESCE(response_ms, 0) AS safe_response_ms
FROM event_logs;
```

---

## 4. 실무 통계 집계 (`GROUP BY` + 조건부 피벗 카운트)

### 4.1. 노드별 채널 구분 및 이벤트 유형별 가로 피벗 집계표 생성
```sql
SELECT 
    n.node_id      AS "노드ID",
    n.node_name    AS "노드명칭",
    COUNT(e.id)    AS "총이벤트건수",
    
    SUM(CASE WHEN e.channel_code = 'WEB' THEN 1 ELSE 0 END) AS "웹요청건수",
    SUM(CASE WHEN e.channel_code = 'EXT' THEN 1 ELSE 0 END) AS "확장앱요청건수",
    
    SUM(CASE WHEN e.event_type = 'INFO'    THEN 1 ELSE 0 END) AS "정상건수",
    SUM(CASE WHEN e.event_type = 'WARN'    THEN 1 ELSE 0 END) AS "경고건수",
    SUM(CASE WHEN e.event_type = 'ERROR'   THEN 1 ELSE 0 END) AS "오류건수",
    
    ROUND(AVG(e.response_ms), 1) AS "평균응답시간(ms)",
    MAX(e.response_ms)           AS "최대응답시간(ms)"
FROM service_nodes n
LEFT JOIN event_logs e 
       ON n.node_id = e.node_id
      AND e.occurred_at >= '2026-10-01 00:00:00'
GROUP BY n.node_id, n.node_name
HAVING COUNT(e.id) >= 0
ORDER BY "총이벤트건수" DESC;
```

### 4.2. 최근 7일간 이벤트 수신이 0건인 비활성 노드 추출 (`LEFT JOIN ... IS NULL`)
```sql
SELECT 
    n.node_id,
    n.node_name,
    n.ip_address,
    n.last_connected_at
FROM service_nodes n
LEFT JOIN event_logs e 
       ON n.node_id = e.node_id 
      AND e.occurred_at >= CURRENT_TIMESTAMP - INTERVAL '7 days'
WHERE e.id IS NULL
ORDER BY n.node_id;
```

---

## 5. 날짜 및 시간대별 집계 (PostgreSQL vs SQLite 문법 대조)

### 5.1. 엔진별 날짜 함수 대조
- **현재 시각**:
  - PostgreSQL: `NOW()` 또는 `CURRENT_TIMESTAMP`
  - SQLite: `datetime('now', 'localtime')`
- **1시간 전 시각**:
  - PostgreSQL: `NOW() - INTERVAL '1 hour'`
  - SQLite: `datetime('now', 'localtime', '-1 hour')`
- **연-월-일 (`2026-10-25`) 문자열 추출**:
  - PostgreSQL: `TO_CHAR(occurred_at, 'YYYY-MM-DD')`
  - SQLite: `strftime('%Y-%m-%d', occurred_at)`
- **시간대 (`0`~`23`시) 정수 추출**:
  - PostgreSQL: `EXTRACT(HOUR FROM occurred_at)`
  - SQLite: `CAST(strftime('%H', occurred_at) AS INTEGER)`
- **요일 (`0`=일요일 ~ `6`=토요일) 추출**:
  - PostgreSQL: `EXTRACT(DOW FROM occurred_at)`
  - SQLite: `CAST(strftime('%w', occurred_at) AS INTEGER)`

### 5.2. 주간(06~18시) vs 야간(18~06시) 트래픽 건수 비교 (야간 배치/스케줄러 누락 검출용)
```sql
SELECT 
    node_id,
    COUNT(*) AS total_cnt,
    SUM(CASE WHEN EXTRACT(HOUR FROM occurred_at) BETWEEN 6 AND 17 THEN 1 ELSE 0 END) AS day_cnt,
    SUM(CASE WHEN EXTRACT(HOUR FROM occurred_at) NOT BETWEEN 6 AND 17 THEN 1 ELSE 0 END) AS night_cnt
FROM event_logs
WHERE occurred_at >= NOW() - INTERVAL '30 days'
GROUP BY node_id
HAVING SUM(CASE WHEN EXTRACT(HOUR FROM occurred_at) NOT BETWEEN 6 AND 17 THEN 1 ELSE 0 END) = 0;
```

---

## 6. 중복 방지 덮어쓰기 (`UPSERT`: `ON CONFLICT`)

### 6.1. 데이터가 이미 존재하면 갱신하고 없으면 삽입 (`ON CONFLICT DO UPDATE`)
PostgreSQL과 최신 SQLite 모두 동일한 문법을 지원합니다.
```sql
INSERT INTO service_nodes (node_id, node_name, ip_address, status, last_connected_at)
VALUES ('SRV-001', '서울 메인 API 게이트웨이', '10.21.1.100', 0, CURRENT_TIMESTAMP)
ON CONFLICT (node_id) 
DO UPDATE SET
    node_name         = EXCLUDED.node_name,
    ip_address        = EXCLUDED.ip_address,
    status            = EXCLUDED.status,
    last_connected_at = EXCLUDED.last_connected_at;
```

### 6.2. 중복 수신된 이벤트 로그는 에러 없이 무시 (`ON CONFLICT DO NOTHING`)
```sql
INSERT INTO event_logs (node_id, event_key, occurred_at, channel_code, event_type, user_email)
VALUES ('SRV-001', '20261025093000123', '2026-10-25 09:30:00.123', 'WEB', 'INFO', 'user@example.com')
ON CONFLICT (node_id, event_key, channel_code) 
DO NOTHING;
```

---

## 7. 고급 분석: 윈도우 함수(`ROW_NUMBER`) 및 월별 파티셔닝

### 7.1. 각 노드별 가장 최근에 발생한 이벤트 1건씩만 추출 (`ROW_NUMBER() OVER`)
```sql
WITH RankedEvents AS (
    SELECT 
        node_id,
        user_email,
        channel_code,
        response_ms,
        occurred_at,
        attachment_path,
        ROW_NUMBER() OVER (PARTITION BY node_id ORDER BY occurred_at DESC) AS rn
    FROM event_logs
)
SELECT node_id, user_email, channel_code, response_ms, occurred_at, attachment_path
FROM RankedEvents
WHERE rn = 1;
```

### 7.2. 중복 입력된 행만 찾아 제거하기
```sql
DELETE FROM event_logs
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY node_id, event_key, channel_code 
                   ORDER BY id ASC
               ) AS row_num
        FROM event_logs
    ) t
    WHERE t.row_num > 1
);
```

### 7.3. PostgreSQL 대용량 API 액세스 로그 월별 파티셔닝 (`PARTITION BY RANGE`)
```sql
-- 1. 부모 파티션 테이블 생성
CREATE TABLE api_access_logs (
    id BIGSERIAL,
    node_id VARCHAR(20) NOT NULL,
    requested_at TIMESTAMP NOT NULL,
    channel_code VARCHAR(10),
    response_ms INTEGER,
    PRIMARY KEY (id, requested_at)
) PARTITION BY RANGE (requested_at);

-- 2. 월별 자식 파티션 테이블 생성
CREATE TABLE api_access_logs_2026_10 PARTITION OF api_access_logs
    FOR VALUES FROM ('2026-10-01 00:00:00') TO ('2026-11-01 00:00:00');

CREATE TABLE api_access_logs_2026_11 PARTITION OF api_access_logs
    FOR VALUES FROM ('2026-11-01 00:00:00') TO ('2026-12-01 00:00:00');
```

---

## 8. 데이터베이스 용량 확인 및 쿼리 실행 계획 진단

### 8.1. 인덱스 사용 여부 검증 (`EXPLAIN ANALYZE`)
결과에 `Seq Scan`이 출력되면 전체 테이블 스캔이며, `Index Scan`이 출력되면 인덱스를 정상 활용하는 것입니다.
```sql
EXPLAIN ANALYZE
SELECT * FROM event_logs 
WHERE node_id = 'SRV-001' AND occurred_at >= '2026-10-01';
```

### 8.2. PostgreSQL 테이블별 디스크 점유 용량 조회
```sql
SELECT 
    relname AS "테이블이름",
    pg_size_pretty(pg_total_relation_size(relid)) AS "전체용량(인덱스포함)",
    pg_size_pretty(pg_relation_size(relid)) AS "순수데이터용량"
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### 8.3. SQLite 파일 압축 최적화 및 무결성 검사
```sql
-- 대량 데이터 삭제 후 실제 .db 파일 크기 축소
VACUUM;

-- 데이터베이스 파일 손상 여부 검사 (정상이면 'ok' 반환)
PRAGMA integrity_check;
```
