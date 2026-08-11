const rootBase = (process.env.QRV_NODE_URL || "https://qrv.network").replace(/\/$/, "");
const apiBase = (process.env.QRV_API_URL || "https://api.qrv.network").replace(/\/$/, "");
const demoQrvid = process.env.DEMO_QRVID || process.env.QRV_DEMO_QRVID || "QRV-PROD-CERT-000001";
const timeoutMs = Number(process.env.QRV_ACCEPTANCE_TIMEOUT_MS || 10000);

const checks = [
  { name: "platform-root", url: `${rootBase}/`, expect: "html" },
  { name: "platform-health", url: `${rootBase}/healthz`, expect: "json" },
  { name: "platform-ready", url: `${rootBase}/readyz`, expect: "json" },
  { name: "platform-version", url: `${rootBase}/version`, expect: "json" },
  { name: "issuer", url: `${rootBase}/issuer`, expect: "html" },
  { name: "registry", url: `${rootBase}/registry`, expect: "html" },
  { name: "docs", url: `${rootBase}/docs`, expect: "html" },
  { name: "developers", url: `${rootBase}/developers`, expect: "html" },
  { name: "status", url: `${rootBase}/status`, expect: "html" },
  { name: "api-root", url: `${apiBase}/`, expect: "json" },
  { name: "api-health", url: `${apiBase}/healthz`, expect: "json" },
  { name: "api-ready", url: `${apiBase}/readyz`, expect: "json" },
  { name: "api-verify-demo", url: `${apiBase}/api/v1/verify/${encodeURIComponent(demoQrvid)}`, expect: "json", state: "VERIFIED" },
  { name: "platform-verify-demo", url: `${rootBase}/verify/${encodeURIComponent(demoQrvid)}`, expect: "html", state: "VERIFIED" },
];

async function runCheck(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(check.url, {
      redirect: "follow",
      headers: { accept: check.expect === "json" ? "application/json" : "text/html", "user-agent": "QRV-Production-Acceptance/2.0" },
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();
    const elapsedMs = Date.now() - startedAt;
    const typeOk = check.expect === "json"
      ? contentType.includes("application/json") || body.trim().startsWith("{")
      : contentType.includes("text/html") || /<!doctype html|<html/i.test(body);
    const stateOk = !check.state || body.includes(check.state);
    const rateLimited = response.status === 429;
    const serverFailure = response.status >= 500 || /503 Service Unavailable|Internal Server Error/i.test(body);
    const passed = response.ok && typeOk && stateOk && !serverFailure && !rateLimited;
    return {
      name: check.name,
      url: check.url,
      status: response.status,
      elapsedMs,
      passed,
      classification: rateLimited ? "RATE_LIMITED" : passed ? "PASS" : "FAIL",
      retryAfter: response.headers.get("retry-after") || null,
      note: passed ? "PASS" : `status=${response.status} type=${contentType || "unknown"} state=${check.state || "n/a"}`,
    };
  } catch (error) {
    return {
      name: check.name,
      url: check.url,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      passed: false,
      classification: "NETWORK_ERROR",
      retryAfter: null,
      note: error.name === "AbortError" ? `Timed out after ${timeoutMs}ms` : error.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const check of checks) {
  results.push(await runCheck(check));
  await new Promise((resolve) => setTimeout(resolve, 750));
}

console.table(results.map(({ name, status, elapsedMs, passed, classification, note }) => ({ name, status, elapsedMs, result: passed ? "PASS" : classification, note })));
const failures = results.filter((result) => !result.passed);
console.log(JSON.stringify({
  architecture: "two-node",
  platformNode: rootBase,
  apiNode: apiBase,
  demoQrvid,
  checkedAt: new Date().toISOString(),
  passed: failures.length === 0,
  results,
}, null, 2));
if (failures.length) process.exitCode = 1;
