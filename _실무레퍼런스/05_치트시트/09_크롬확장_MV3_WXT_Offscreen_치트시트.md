# 크롬 확장프로그램 (`Manifest V3 + WXT + Offscreen + IndexedDB + 온디바이스 AI`) 실무 마스터 치트시트

- **기준일**: 2026-10-25
- **짝꿍 스킬 (워크스페이스 로컬 설치 완료)**: `wxt`, `chrome-mv3`, `chrome-extensions`, `indexeddb-storage`, `web-audio-video`, `pdf-lib`, `ai-wasm`, `i18n-localization`, `tailwind-design-system`
- **짝꿍 MCP**: `Context7` + `Playwright` + `Sequential Thinking`
- **적용 대상**: 본 워크스페이스(`chrome-extension`)의 핵심 도메인인 Manifest V3 크롬 확장프로그램 개발 시 준수해야 할 5대 아키텍처 원칙과 6대 핵심 구현 코드 템플릿을 정리한 레퍼런스입니다.

---

## 1. 크롬 확장프로그램 (Manifest V3) 5대 아키텍처 원칙

1. **Service Worker 전역 변수 금지**:
   - `background.ts`(Service Worker)는 유휴 상태 시 언제든 비활성화(Terminate)됩니다. 상태는 반드시 `chrome.storage.session` 또는 `chrome.storage.local`에 저장하고, 지연 작업은 `setTimeout` 대신 `chrome.alarms`를 사용합니다.
2. **Offscreen Document 일원화 (`offscreen.html`)**:
   - Service Worker에는 `window`, `document`, `HTMLCanvasElement`, `Image`, `AudioContext`, `MediaRecorder`가 존재하지 않습니다.
   - 대용량 이미지 스티칭, 탭/창/전체화면 녹화(`tabCapture`, `desktopCapture`), PDF 생성(`pdf-lib`)은 반드시 Offscreen Document에 위임합니다.
3. **64MiB 메시지 한도 우회 (`IndexedDB` Blob 키 전달)**:
   - `chrome.runtime.sendMessage`로 고해상도 Base64 이미지 배열이나 영상 데이터를 직접 전송하면 64MiB 직렬화 한도 초과로 크래시가 발생합니다.
   - 대용량 바이너리(`Blob` / `ArrayBuffer`)는 `IndexedDB` (`Dexie.js`)에 먼저 저장하고 메시지로는 `recordId` 문자열만 전달합니다.
4. **Content Script 스타일 격리 (`Shadow DOM`)**:
   - 웹페이지에 주입하는 오버레이 UI는 호스트 페이지의 CSS와 충돌하지 않도록 WXT의 `createShadowRootUi` (`attachShadow({ mode: 'open' })`)를 필수로 사용합니다.
5. **특수 페이지 사전 차단 및 다국어 에러 코드 마스킹**:
   - `chrome://`, `edge://`, `about:`, 웹스토어(`chromewebstore.google.com`)는 스크립트 주입이 차단됩니다. 실행 전 URL을 검사하여 `ERR_RESTRICTED_PAGE` 코드로 조기 차단하고, 브라우저 영문 예외 메시지를 다국어 사전으로 변환하여 안내합니다.

---

## 2. WXT 표준 프로젝트 구조 및 `wxt.config.ts` 템플릿

### 2.1. 모노레포 내 개별 확장프로그램 표준 디렉터리 구조
```plaintext
extensions/scroll-capture/
├── entrypoints/
│   ├── background.ts            # Service Worker (메시지 라우팅, 단축키, Offscreen 생성)
│   ├── content/                 # Content Script (Shadow DOM 오버레이, 스크롤 제어)
│   │   ├── index.tsx
│   │   └── style.css
│   ├── offscreen/               # Offscreen Document (Canvas 합성, MediaRecorder, PDF/OCR)
│   │   ├── index.html
│   │   └── main.ts
│   ├── popup/                   # 툴바 팝업 UI (React + Tailwind)
│   │   ├── index.html
│   │   └── App.tsx              # 300행 이내 유지 (하위 components/hooks로 분리)
│   └── preview/                 # 캡처/녹화 완료 후 열리는 전체화면 편집 탭
├── src/
│   ├── components/              # 순수 UI 컴포넌트 (300~500행 상한)
│   ├── hooks/                   # 커스텀 훅 (useCaptureState, useI18n 등)
│   ├── services/                # IndexedDB(Dexie), 라이선스 검증, AI Worker 호출
│   ├── utils/                   # 순수 계산 유틸 (URL 검사, 에러 코드 매핑, 좌표 계산)
│   └── types/                   # TypeScript 인터페이스 및 Zod 스키마
├── public/
│   └── _locales/                # 다국어 번역 파일 (ko/messages.json, en/messages.json)
├── wxt.config.ts
└── package.json
```

### 2.2. `wxt.config.ts` 표준 설정 (MV3 + WASM CSP 허용 포함)
```typescript
// wxt.config.ts
import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDesc__',
    default_locale: 'ko',
    permissions: [
      'activeTab',
      'storage',
      'offscreen',
      'unlimitedStorage',
      'tabCapture',
      'desktopCapture',
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
});
```

---

## 3. 특수 페이지(`chrome://` 등) 사전 차단 및 다국어 에러 마스킹 유틸리티

```typescript
// src/utils/errorGuard.ts
export type SystemErrorCode =
  | 'ERR_RESTRICTED_PAGE'
  | 'ERR_USER_CANCELLED'
  | 'ERR_MEDIA_DENIED'
  | 'ERR_TAB_CAPTURE_FAILED'
  | 'ERR_STORAGE_QUOTA_EXCEEDED'
  | 'ERR_UNKNOWN';

const RESTRICTED_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'edge://',
  'brave://',
  'about:',
  'view-source:',
  'https://chromewebstore.google.com',
  'https://chrome.google.com/webstore',
];

export function isRestrictedUrl(url?: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return RESTRICTED_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

export function mapToErrorCode(err: unknown): SystemErrorCode {
  const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);

  if (msg.includes('AbortError') || msg.includes('cancelled')) return 'ERR_USER_CANCELLED';
  if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) return 'ERR_MEDIA_DENIED';
  if (msg.includes('QuotaExceededError')) return 'ERR_STORAGE_QUOTA_EXCEEDED';
  if (msg.includes('Cannot access a chrome://') || msg.includes('Receiving end does not exist')) {
    return 'ERR_RESTRICTED_PAGE';
  }
  return 'ERR_UNKNOWN';
}

export const ERROR_MESSAGES: Record<'ko' | 'en', Record<SystemErrorCode, string>> = {
  ko: {
    ERR_RESTRICTED_PAGE: '브라우저 보안 정책상 현재 페이지(설정, 웹스토어 등)에서는 실행할 수 없습니다. 일반 웹페이지에서 다시 시도해 주세요.',
    ERR_USER_CANCELLED: '화면 선택이 취소되었습니다.',
    ERR_MEDIA_DENIED: '화면 또는 오디오 캡처 권한이 거부되었습니다.',
    ERR_TAB_CAPTURE_FAILED: '탭 미디어 스트림을 가져오지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
    ERR_STORAGE_QUOTA_EXCEEDED: '브라우저 저장 공간이 부족합니다. 이전 캡처 보관함을 정리해 주세요.',
    ERR_UNKNOWN: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  },
  en: {
    ERR_RESTRICTED_PAGE: 'Cannot run on restricted browser pages (Settings, Web Store, etc.). Please try on a regular webpage.',
    ERR_USER_CANCELLED: 'Screen selection was cancelled.',
    ERR_MEDIA_DENIED: 'Screen or audio capture permission was denied.',
    ERR_TAB_CAPTURE_FAILED: 'Failed to initialize tab capture stream. Please refresh the page and try again.',
    ERR_STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please clear old captures in your library.',
    ERR_UNKNOWN: 'An unexpected error occurred. Please try again.',
  },
};
```

---

## 4. `IndexedDB` (`Dexie.js`) 대용량 Blob 저장소 및 만료 세션 자동 정리

```typescript
// src/services/captureDb.ts
import Dexie, { type Table } from 'dexie';

export interface CaptureSessionRecord {
  id: string;
  title: string;
  sourceUrl: string;
  blobs: Blob[];
  createdAt: number;
  expiresAt: number;
}

class CaptureDatabase extends Dexie {
  sessions!: Table<CaptureSessionRecord, string>;

  constructor() {
    super('ChromeExtCaptureDB');
    this.version(1).stores({
      sessions: 'id, createdAt, expiresAt',
    });
  }
}

export const db = new CaptureDatabase();

export async function saveCaptureSession(title: string, sourceUrl: string, blobs: Blob[]): Promise<string> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await db.sessions.put({
    id,
    title,
    sourceUrl,
    blobs,
    createdAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });
  return id;
}

export async function cleanupExpiredSessions(): Promise<number> {
  const now = Date.now();
  return await db.sessions.where('expiresAt').below(now).delete();
}
```

---

## 5. Offscreen Document 싱글톤 생성 및 창/화면 녹화 스트림 발급

크롬은 동시에 단 1개의 Offscreen Document만 허용하므로 Promise 락(Singleton Guard)을 사용하여 중복 생성 예외를 방지합니다. 또한 `chrome.desktopCapture.chooseDesktopMedia` 호출 시 `targetTab` 파라미터를 생략해야 Offscreen Document 내부에서 스트림을 소비할 수 있습니다.

```typescript
// entrypoints/background.ts
let creatingOffscreen: Promise<void> | null = null;

export async function ensureOffscreenDocument(path = 'offscreen.html') {
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) return;

  if (creatingOffscreen) {
    await creatingOffscreen;
  } else {
    creatingOffscreen = chrome.offscreen.createDocument({
      url: path,
      reasons: [
        chrome.offscreen.Reason.USER_MEDIA,
        chrome.offscreen.Reason.DISPLAY_MEDIA,
        chrome.offscreen.Reason.BLOBS,
      ],
      justification: 'Canvas stitching, PDF generation, and screen/tab media recording',
    });
    await creatingOffscreen;
    creatingOffscreen = null;
  }
}

export function requestDesktopStreamId(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'audio'], (streamId) => {
      if (!streamId) {
        reject(new Error('AbortError: User cancelled desktop media picker'));
      } else {
        resolve(streamId);
      }
    });
  });
}
```

---

## 6. `pdf-lib` 기반 고해상도 이미지 A4 규격 분할 및 자동 PDF 조판

```typescript
// src/utils/pdfGenerator.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generatePaginatedA4Pdf(imageBlobs: Blob[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 28;
  const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;
  const CONTENT_HEIGHT = A4_HEIGHT - MARGIN * 2 - 16;

  const totalPages = imageBlobs.length;

  for (let i = 0; i < totalPages; i++) {
    const blob = imageBlobs[i];
    const arrayBuffer = await blob.arrayBuffer();

    const embeddedImg =
      blob.type === 'image/png'
        ? await pdfDoc.embedPng(arrayBuffer)
        : await pdfDoc.embedJpg(arrayBuffer);

    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    const scale = Math.min(CONTENT_WIDTH / embeddedImg.width, CONTENT_HEIGHT / embeddedImg.height);
    const drawWidth = embeddedImg.width * scale;
    const drawHeight = embeddedImg.height * scale;

    const x = MARGIN + (CONTENT_WIDTH - drawWidth) / 2;
    const y = A4_HEIGHT - MARGIN - drawHeight;

    page.drawImage(embeddedImg, { x, y, width: drawWidth, height: drawHeight });

    const footerText = `${i + 1} / ${totalPages}`;
    const textWidth = font.widthOfTextAtSize(footerText, 9);
    page.drawText(footerText, {
      x: (A4_WIDTH - textWidth) / 2,
      y: 16,
      size: 9,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
```
