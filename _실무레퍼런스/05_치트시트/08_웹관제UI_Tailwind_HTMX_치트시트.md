# 모던 웹 대시보드 UI (`FastAPI + Jinja2 + HTMX + Tailwind CSS`) 실전 컴포넌트 치트시트

- **기준일**: 2026-10-25
- **짝꿍 스킬 및 MCP**: `fastapi-templates`, `htmx-jinja-templates`, `tailwind-design-system` + `Playwright MCP`
- **적용 대상**: `FastAPI + Jinja2 + HTMX 2.0 + Tailwind CSS` 조합으로 사내 서비스 모니터링 및 관리자 백오피스 화면을 구축할 때, 복잡한 프론트엔드 빌드 없이 HTML 파일에 복사하여 즉시 사용할 수 있는 핵심 UI 패턴 5선입니다.

---

## 1. 빌드 설정 없이 즉시 구동하는 베이스 HTML (`base.html`)

`<head>`에 Tailwind CSS, HTMX 2.0, Alpine.js 3줄을 선언하여 별도 Node.js 빌드 없이 모던 레이아웃과 비동기 부분 갱신을 활성화합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>통합 서비스 모니터링 대시보드</title>
  <!-- 1. Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- 2. HTMX 2.0 (실시간 부분 갱신, 검색, 모달 제어) -->
  <script src="https://unpkg.com/htmx.org@2.0.3"></script>
  <!-- 3. Alpine.js (클라이언트 탭/모달/드롭다운 상태 제어) -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-slate-50 text-slate-800 antialiased">
  <!-- 상단 고정 네비게이션 바 -->
  <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
    <div class="flex items-center gap-3">
      <span class="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
      <h1 class="text-lg font-bold tracking-tight text-slate-900">통합 서비스 및 서버 모니터링 대시보드</h1>
    </div>
    <div class="text-sm text-slate-500">시스템 상태: <strong class="text-emerald-600">정상 가동중</strong></div>
  </header>

  <!-- 메인 컨텐츠 영역 -->
  <main class="mx-auto max-w-7xl p-6 space-y-6">
    {% block content %}{% endblock %}
  </main>
</body>
</html>
```

---

## 2. 상단 KPI 요약 카드 4종 그리드 (5초 주기 자동 갱신)

`hx-get="/partials/kpi"`와 `hx-trigger="every 5s"`를 통해 전체 페이지 새로고침 없이 5초마다 수치만 비동기 갱신합니다.

```html
<section id="kpi-cards"
         hx-get="/partials/kpi"
         hx-trigger="every 5s"
         hx-swap="innerHTML"
         class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

  <!-- 1. 전체 등록 노드 -->
  <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">전체 등록 노드</div>
    <div class="mt-2 flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-slate-900">128<small class="ml-1 text-base font-normal text-slate-500">개</small></span>
      <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">전체 리전</span>
    </div>
  </div>

  <!-- 2. 정상 가동중 -->
  <div class="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
    <div class="text-xs font-semibold uppercase tracking-wider text-emerald-600">정상 가동중</div>
    <div class="mt-2 flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-emerald-600">126<small class="ml-1 text-base font-normal text-slate-500">개</small></span>
      <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">가동률 98.4%</span>
    </div>
  </div>

  <!-- 3. 응답 지연 / 점검 필요 -->
  <div class="rounded-xl border border-rose-200 bg-white p-5 shadow-sm">
    <div class="text-xs font-semibold uppercase tracking-wider text-rose-600">응답 지연 / 장애</div>
    <div class="mt-2 flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-rose-600">2<small class="ml-1 text-base font-normal text-slate-500">개</small></span>
      <span class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">즉시 확인</span>
    </div>
  </div>

  <!-- 4. 금일 처리 트랜잭션 건수 -->
  <div class="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
    <div class="text-xs font-semibold uppercase tracking-wider text-blue-600">금일 처리 트랜잭션</div>
    <div class="mt-2 flex items-baseline justify-between">
      <span class="text-3xl font-extrabold text-blue-600">48,920<small class="ml-1 text-base font-normal text-slate-500">건</small></span>
      <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">API 및 웹훅 포함</span>
    </div>
  </div>
</section>
```

---

## 3. 타이핑 즉시 테이블이 필터링되는 실시간 검색바 및 드롭다운 (`HTMX`)

검색창에 키워드를 입력하거나(`keyup delay:300ms`) 드롭다운을 변경하면 별도 자바스크립트 코드 없이 `#node-table-body` 영역만 즉시 교체됩니다.

```html
<form class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      hx-get="/partials/nodes"
      hx-target="#node-table-body"
      hx-trigger="change, keyup delay:300ms from:input[name='q']">

  <div class="flex flex-wrap items-center gap-3">
    <select name="service_type"
            class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
      <option value="">전체 서비스 유형</option>
      <option value="API서버">API 서버</option>
      <option value="배치워커">배치 워커</option>
      <option value="웹훅게이트웨이">웹훅 게이트웨이</option>
      <option value="스토리지노드">스토리지 노드</option>
    </select>

    <select name="status"
            class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
      <option value="">전체 상태</option>
      <option value="정상">정상</option>
      <option value="신규">신규</option>
      <option value="점검">점검</option>
    </select>

    <input type="search"
           name="q"
           placeholder="노드ID(SRV-001), 서비스명, 리전, IP 검색..."
           class="h-10 w-72 rounded-lg border border-slate-300 px-3.5 text-sm focus:border-blue-500 focus:outline-none" />
  </div>

  <a href="/api/nodes/export-xlsx"
     class="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
    <span>엑셀(.xlsx) 다운로드</span>
  </a>
</form>
```

---

## 4. 고정 헤더 데이터 테이블 및 상태 배지(Badge) 표준 마크업

스크롤 시 1행 헤더(`thead`)가 상단에 고정(`sticky top-0`)되고 정상/신규/장애 상태가 색상 배지로 구분되는 테이블입니다.

```html
<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
  <div class="max-h-[600px] overflow-y-auto">
    <table class="w-full border-collapse text-left text-sm">
      <thead class="sticky top-0 z-10 border-b border-slate-200 bg-slate-100 text-xs font-bold uppercase text-slate-600">
        <tr>
          <th class="px-4 py-3 text-center">상태</th>
          <th class="px-4 py-3 text-center">노드ID</th>
          <th class="px-4 py-3 text-center">서비스 유형</th>
          <th class="px-4 py-3">노드 명칭</th>
          <th class="px-4 py-3">리전/환경</th>
          <th class="px-4 py-3 text-center">CPU / 메모리</th>
          <th class="px-4 py-3 text-center">IP 주소</th>
          <th class="px-4 py-3 text-center">관리</th>
        </tr>
      </thead>
      <tbody id="node-table-body" class="divide-y divide-slate-200">
        {% for n in nodes %}
        <tr class="hover:bg-blue-50/50 transition-colors">
          <td class="px-4 py-2.5 text-center">
            {% if n.status == '정상' %}
              <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>정상
              </span>
            {% elif n.status == '신규' %}
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>신규
              </span>
            {% else %}
              <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>{{ n.status }}
              </span>
            {% endif %}
          </td>
          <td class="px-4 py-2.5 text-center font-mono font-bold text-slate-900">{{ n.node_id }}</td>
          <td class="px-4 py-2.5 text-center">{{ n.service_type }}</td>
          <td class="px-4 py-2.5 font-medium text-slate-900">{{ n.node_name }}</td>
          <td class="px-4 py-2.5 text-slate-500">{{ n.region }}</td>
          <td class="px-4 py-2.5 text-center font-mono">{{ n.cpu_usage }}% / <span class="text-blue-600 font-semibold">{{ n.mem_usage }}%</span></td>
          <td class="px-4 py-2.5 text-center font-mono text-xs text-slate-600">{{ n.ip_address }}</td>
          <td class="px-4 py-2.5 text-center">
            <button hx-get="/partials/nodes/{{ n.node_id }}/modal"
                    hx-target="#modal-container"
                    class="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
              상세보기
            </button>
          </td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>

<div id="modal-container"></div>
```

---

## 5. FastAPI 메모리(`BytesIO`) 기반 엑셀(`.xlsx`) 즉시 스트리밍 다운로드

서버 디스크에 임시 파일을 생성하지 않고 메모리 버퍼에서 엑셀 바이너리를 생성하여 브라우저로 즉시 스트리밍 전송하는 엔드포인트입니다.

```python
from io import BytesIO
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import openpyxl

app = FastAPI()

@app.get("/api/nodes/export-xlsx")
async def export_nodes_xlsx():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "서비스노드목록"
    ws.append(["노드ID", "서비스유형", "상태", "노드명칭", "IP주소"])
    ws.append(["SRV-001", "API서버", "정상", "서울 메인 게이트웨이", "10.21.1.100"])

    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)

    headers = {
        "Content-Disposition": "attachment; filename=nodes_export.xlsx"
    }
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )
```
