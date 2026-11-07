---
name: pdf-lib
description: >-
  Pure JS PDF document generation, image embedding, page layout, and pagination with pdf-lib.
---

# PDF-Lib Document Skill

## 1. Offscreen/Worker 호환성
- `pdf-lib`는 순수 JavaScript로 작성되어 DOM 없이 Service Worker 및 Offscreen Document에서 완벽 동작합니다.

## 2. 페이지 규격
- A4: `[595.28, 841.89]` 포인트 (72 DPI)
- Letter: `[612.0, 792.0]` 포인트 (72 DPI)
- 좌표계: 좌측 하단이 원점 (0, 0)
