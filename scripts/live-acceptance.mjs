const rootBase = (process.env.QRV_NODE_URL || "https://qrv.network").replace(/\/$/, "");
const verifyBase = (process.env.QRV_VERIFY_URL || "https://verify.qrv.network").replace(/\/$/, "");
const demoQrvid = process.env.QRV_DEMO_QRVID || "QRV-PROD-CERT-000001";
const timeoutMs = Number(process.env.QRV_ACCEPTANCE_TIMEOUT_MS || 10000);

const checks = [
  { name: "root", url: `${rootBase}/`, expect: "html" },
  { name: "healthz", url: `${rootBase}/healthz`, expect: "json" },
  { name: "readyz", url: `${rootBase}/readyz`, expect: "json" },
  { name: "version", url: `${rootBase}/version`, expect: "json" },
  { name: "protocol", url: `${rootBase}/protocol`, expect: "html" },
  { name: "how-it-works", url: `${rootBase}/how-it-works`, expect: "html" },
  { name: "registry", url: `${rootBase}/registry`, expect: "html" },
  { name: "use-cases", url: `${rootBase}/use-cases`, expect: "html" },
  { name: "developers", url: `${rootBase}/developers`, expect: "html" },
  { name: "about", url: `${rootBase}/about`, expect: "html" },
  { name: "verify-demo", url: `${verifyBase}/${encodeURIComponent(demoQrvid)}`, expect: "html", optional: true }
];

async function runCheck(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(check.url, {
      redirect: "follow",
      headers: { "user-agent": "qrv-production-acceptance/1.0" },
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();
    const elapsedMs = Date.now() - startedAt;
    const isExpectedType = check.expect === "json"
      ? contentType.includes("application/json") || body.trim().startsWith("{")
      : contentType.includes("text/html") || body.includes("<!DOCTYPE html") || body.includes("<html");
    const hasServerFailure = response.status >= 500 || /503 Service Unavailable|Internal Server Error/i.test(body);
    const passed = response.ok && isExpectedType && !hasServerFailure;

    return {
      name: check.name,
      url: check.url,
      status: response.status,
      elapsedMs,
      passed,
      optional: Boolean(check.optional),
      note: passed ? "PASS" : `Unexpected status or response type (${contentType || "unknown"})`
    };
  } catch (error) {
    return {
      name: check.name,
      url: check.url,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      passed: false,
      optional: Boolean(check.optional),
      note: error.name === "AbortError" ? `Timed out after ${timeoutMs}ms` : error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const check of checks) {
  results.push(await runCheck(check));
}

console.table(results.map(({ name, status, elapsedMs, passed, optional, note }) => ({
  name,
  status,
  elapsedMs,
  result: passed ? "PASS" : optional ? "WARN" : "FAIL",
  note
})));

const requiredFailures = results.filter((result) => !result.passed && !result.optional);
const optionalFailures = results.filter((result) => !result.passed && result.optional);

console.log(JSON.stringify({
  service: "qrv-network-root",
  rootBase,
  verifyBase,
  demoQrvid,
  checkedAt: new Date().toISOString(),
  requiredPassed: requiredFailures.length === 0,
  optionalWarnings: optionalFailures.length,
  results
}, null, 2));

if (requiredFailures.length > 0) {
  process.exitCode = 1;
}
