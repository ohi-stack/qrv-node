const trim = (value: string) => value.replace(/\/+$/, "");

const configuredBase = trim(process.env.QRV_API_BASE_URL || "https://api.qrv.network");
const canonicalRequestTimeoutMs = 5000;

export const QRV_CANONICAL_API_BASE = configuredBase.endsWith("/api/v1")
  ? configuredBase
  : `${configuredBase}/api/v1`;

export const QRV_CANONICAL_API_ORIGIN = configuredBase.endsWith("/api/v1")
  ? configuredBase.slice(0, -"/api/v1".length)
  : configuredBase;

export function canonicalApiUrl(path: string) {
  return `${QRV_CANONICAL_API_BASE}/${path.replace(/^\/+/, "")}`;
}

export function fetchCanonicalApi(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  return fetch(canonicalApiUrl(path), {
    ...init,
    headers,
    signal: init.signal || AbortSignal.timeout(canonicalRequestTimeoutMs),
    cache: "no-store",
  });
}

export function fetchCanonicalRoot(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("accept")) headers.set("accept", "application/json");
  return fetch(`${QRV_CANONICAL_API_ORIGIN}/${path.replace(/^\/+/, "")}`, {
    ...init,
    headers,
    signal: init.signal || AbortSignal.timeout(canonicalRequestTimeoutMs),
    cache: "no-store",
  });
}
