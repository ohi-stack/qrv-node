const platformBase = (process.env.QRV_NODE_URL || "https://qrv.network").replace(/\/$/, "");
const apiBase = (process.env.QRV_API_URL || "https://api.qrv.network").replace(/\/$/, "");
const demoQrvid = process.env.QRV_DEMO_QRVID || "QRV-PROD-CERT-000001";
const timeoutMs = Number(process.env.QRV_ACCEPTANCE_TIMEOUT_MS || 10000);

const checks = [
  { name: "platform-root", url: `${platformBase}/`, expect: "html" },
  { name: "platform-health", url: `${platformBase}/healthz`, expect: "json" },
  { name: "platform-ready", url: `${platformBase}/readyz`, expect: "json" },
  { name: "platform-version", url: `${platformBase}/version`, expect: "json" },
  { name: "verify-entry", url: `${platformBase}/verify`, expect: "html" },
  { name: "issuer-entry", url: `${platformBase}/issuer`, expect: "html", allowStatus: [200, 503] },
  { name: "registry-entry", url: `${platformBase}/registry`, expect: "html" },
  { name: "docs", url: `${platformBase}/docs`, expect: "html" },
  { name: "developers", url: `${platformBase}/developers`, expect: "html" },
  { name: "status", url: `${platformBase}/status`, expect: "html" },
  { name: "api-health", url: `${apiBase}/healthz`, expect: "json" },
  { name: "api-ready", url: `${apiBase}/readyz`, expect: "json" },
  { name: "api-version", url: `${apiBase}/version`, expect: "json" },
  { name: "api-verify-demo", url: `${apiBase}/api/v1/verify/${encodeURIComponent(demoQrvid)}`, expect: "json", contains: [demoQrvid, "VERIFIED"] },
  { name: "platform-verify-demo", url: `${platformBase}/verify/${encodeURIComponent(demoQrvid)}`, expect: "html", contains: [demoQrvid, "VERIFIED"] }
];

async function runCheck(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(check.url, {
      redirect: "follow",
      headers: { "user-agent": "qrv-two-node-acceptance/2.0" },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();
    const elapsedMs = Date.now() - startedAt;
    const allowedStatus = check.allowStatus?.includes(response.status) || response.ok;
    const isExpectedType = check.expect === "json"
      ? contentType.includes("application/json") || body.trim().startsWith("{")
      : contentType.includes("text/html") || body.includes("<!doctype html") || body.includes("<html");
    const containsExpected = (check.contains || []).every((value) => body.toUpperCase().includes(String(value).toUpperCase()));
    const hasServerFailure = !check.allowStatus?.includes(response.status) && (response.status >= 500 || /Internal Server Error/i.test(body));
    const passed = allowedStatus && isExpectedType && containsExpected && !hasServerFailure;
    return { name: check.name, url: check.url, status: response.status, elapsedMs, passed, note: passed ? "PASS" : `Unexpected response (${contentType || "unknown"})` };
  } catch (error) {
    return { name: check.name, url: check.url, status: 0, elapsedMs: Date.now() - startedAt, passed: false, note: error.name === "AbortError" ? `Timed out after ${timeoutMs}ms` : error.message };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const check of checks) results.push(await runCheck(check));

console.table(results.map(({ name, status, elapsedMs, passed, note }) => ({ name, status, elapsedMs, result: passed ? "PASS" : "FAIL", note })));
const failures = results.filter((result) => !result.passed);
console.log(JSON.stringify({
  architecture: "two-node-consolidated",
  platformBase,
  apiBase,
  demoQrvid,
  checkedAt: new Date().toISOString(),
  passed: failures.length === 0,
  results
}, null, 2));
if (failures.length > 0) process.exitCode = 1;
