/**
 * FastAPI 백엔드(`/api/portal/*`, `/api/downloads/*`, `/api/auth/*`, `/api/rpc`) 연동 및 오프라인 폴백 서비스 모듈입니다.
 */

import { DEFAULT_PORTAL_BOOTSTRAP } from "@/constants/portalData";
import type { PortalBootstrapData } from "@/types/portal";

/**
 * 포털 전체 섹션 부트스트랩 데이터를 백엔드에서 조회하며, 네트워크 오류 시 내장 마스터 시드로 자동 폴백합니다.
 */
export async function fetchPortalBootstrap(): Promise<PortalBootstrapData> {
  try {
    const response = await fetch("/api/portal/bootstrap", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      return DEFAULT_PORTAL_BOOTSTRAP;
    }
    const json = await response.json();
    if (json?.success && json?.data) {
      return json.data as PortalBootstrapData;
    }
    return DEFAULT_PORTAL_BOOTSTRAP;
  } catch {
    return DEFAULT_PORTAL_BOOTSTRAP;
  }
}

/**
 * 접속기 다운로드 CTA 클릭 전환 이벤트를 백엔드에 비동기로 기록합니다.
 */
export async function trackDownloadClick(triggerSection: string): Promise<void> {
  try {
    await fetch("/api/downloads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trigger_section: triggerSection,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    });
  } catch {
    // 오프라인 상태에서도 사용자 다운로드 흐름을 방해하지 않습니다.
  }
}

/**
 * 관리자 로그인 요청을 수행하고 액세스 토큰을 반환합니다.
 */
export async function loginAdminApi(
  username: string,
  password: string
): Promise<{ access_token: string; username: string }> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  if (!response.ok || !json?.success) {
    const msg =
      json?.detail?.message ||
      json?.error?.message ||
      "관리자 아이디 또는 비밀번호를 확인해 주세요.";
    throw new Error(msg);
  }
  return json.data;
}

/**
 * 관리자 JSON-RPC 2.0 엔드포인트(`/api/rpc`)를 호출합니다.
 */
export async function callAdminRpc<T = unknown>(
  method: string,
  params: Record<string, unknown> = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch("/api/rpc", {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });
  const json = await response.json();
  if (json?.error) {
    throw new Error(json.error.message || "RPC 요청 처리 중 오류가 발생했습니다.");
  }
  return json.result as T;
}

