const platformBase = (process.env.QRV_NODE_URL || "https://qrv.network").replace(/\/$/, "");
const apiBase = (process.env.QRV_API_URL || "https://api.qrv.network").replace(/\/$/, "");
const legacyVerifyBase = (process.env.QRV_LEGACY_VERIFY_URL || "https://verify.qrv.network").replace(/\/$/, "");
const demoQrvid = process.env.QRV_DEMO_QRVID || "QRV-PROD-CERT-000001";
const unknownQrvid = process.env.QRV_UNKNOWN_QRVID || "QRV-PROD-CERT-DOES-NOT-EXIST";
const malformedQrvid = process.env.QRV_MALFORMED_QRVID || "NOT-A-QRVID";
const timeoutMs = Number(process.env.QRV_ACCEPTANCE_TIMEOUT_MS || 10000);

const desktopUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15";
const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
const canonicalRootMarker = "QR-V™ NETWORK";
const staleRootMarkers = [
  "Verify Records. Confirm Authenticity. Instantly.",
  "CERTIFICATES • CREDENTIALS • PRODUCTS • ASSETS • DOCUMENTS • PROPERTY TITLES • FINANCIAL RECORDS"
];

const checks = [
  {
    name: "platform-root-desktop",
    url: `${platformBase}/?qrv_delivery_probe=desktop`,
    expect: "html",
    contains: [canonicalRootMarker],
    forbids: staleRootMarkers,
    userAgent: desktopUA,
    expectOrigin: new URL(platformBase).origin,
    expectStatus: 200
  },
  {
    name: "platform-root-mobile",
    url: `${platformBase}/?qrv_delivery_probe=mobile`,
    expect: "html",
    contains: [canonicalRootMarker],
    forbids: staleRootMarkers,
    userAgent: mobileUA,
    expectOrigin: new URL(platformBase).origin,
    expectStatus: 200
  },
  { name: "platform-health", url: `${platformBase}/healthz`, expect: "json", expectStatus: 200 },
  { name: "platform-ready", url: `${platformBase}/readyz`, expect: "json", expectStatus: 200 },
  { name: "platform-version", url: `${platformBase}/version`, expect: "json", expectStatus: 200 },
  {
    name: "platform-robots",
    url: `${platformBase}/robots.txt`,
    expect: "text",
    expectedContentType: "text/plain",
    expectStatus: 200,
    contains: ["Disallow: /issuer/dashboard", "Sitemap: https://qrv.network/sitemap.xml"]
  },
  {
    name: "platform-sitemap",
    url: `${platformBase}/sitemap.xml`,
    expect: "text",
    expectedContentType: "application/xml",
    expectStatus: 200,
    contains: ["https://qrv.network/verify", "https://qrv.network/issuer"]
  },
  {
    name: "platform-webmanifest",
    url: `${platformBase}/site.webmanifest`,
    expect: "json",
    expectedContentType: "application/manifest+json",
    expectStatus: 200,
    contains: ["QR-V Global Verification Network"]
  },
  { name: "verify-entry", url: `${platformBase}/verify`, expect: "html", expectStatus: 200 },
  { name: "issuer-entry", url: `${platformBase}/issuer`, expect: "html", allowStatus: [200, 503] },
  { name: "registry-entry", url: `${platformBase}/registry`, expect: "html", expectStatus: 200 },
  { name: "docs", url: `${platformBase}/docs`, expect: "html", expectStatus: 200 },
  { name: "developers", url: `${platformBase}/developers`, expect: "html", expectStatus: 200 },
  { name: "status", url: `${platformBase}/status`, expect: "html", expectStatus: 200 },
  { name: "api-health", url: `${apiBase}/healthz`, expect: "json", expectStatus: 200, contains: ["qrv-api"] },
  { name: "api-ready", url: `${apiBase}/readyz`, expect: "json", expectStatus: 200, contains: ["connected"] },
  { name: "api-version", url: `${apiBase}/version`, expect: "json", expectStatus: 200, contains: ["qrv-api"] },
  { name: "api-status", url: `${apiBase}/api/v1/status`, expect: "json", expectStatus: 200, contains: ["OPERATIONAL"] },
  { name: "api-verify-demo", url: `${apiBase}/api/v1/verify/${encodeURIComponent(demoQrvid)}`, expect: "json", expectStatus: 200, contains: [demoQrvid, "VERIFIED"] },
  { name: "api-verify-unknown", url: `${apiBase}/api/v1/verify/${encodeURIComponent(unknownQrvid)}`, expect: "json", expectStatus: 404, contains: [unknownQrvid, "NOT_FOUND"] },
  { name: "api-verify-malformed", url: `${apiBase}/api/v1/verify/${encodeURIComponent(malformedQrvid)}`, expect: "json", expectStatus: 422, contains: ["INVALID_QRVID"] },
  { name: "platform-verify-demo", url: `${platformBase}/verify/${encodeURIComponent(demoQrvid)}`, expect: "html", expectStatus: 200, contains: [demoQrvid, "VERIFIED"] }
];

async function runCheck(check) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const response = await fetch(check.url, {
      redirect: "follow",
      headers: {
        "user-agent": check.userAgent || "qrv-two-node-acceptance/4.0",
        "cache-control": "no-cache",
        pragma: "no-cache",
        accept: check.expect === "json" ? "application/json" : "text/html,application/xhtml+xml"
      },
      signal: controller.signal
    });
    const contentType = response.headers.get("content-type") || "";
    const cacheControl = response.headers.get("cache-control") || "";
    const body = await response.text();
    const elapsedMs = Date.now() - startedAt;
    const allowedStatus = check.expectStatus !== undefined
      ? response.status === check.expectStatus
      : check.allowStatus?.includes(response.status) || response.ok;
    const isExpectedType = check.expectedContentType
      ? contentType.includes(check.expectedContentType)
      : check.expect === "json"
        ? contentType.includes("application/json") || body.trim().startsWith("{")
        : check.expect === "text"
          ? contentType.startsWith("text/")
          : contentType.includes("text/html") || body.includes("<!doctype html") || body.includes("<html");
    const containsExpected = (check.contains || []).every((value) => body.toUpperCase().includes(String(value).toUpperCase()));
    const excludesForbidden = (check.forbids || []).every((value) => !body.toUpperCase().includes(String(value).toUpperCase()));
    const originMatches = !check.expectOrigin || new URL(response.url).origin === check.expectOrigin;
    const hasServerFailure = !check.allowStatus?.includes(response.status) && response.status >= 500;
    const passed = allowedStatus && isExpectedType && containsExpected && excludesForbidden && originMatches && !hasServerFailure;
    const failures = [];
    if (!allowedStatus) failures.push(`status=${response.status}${check.expectStatus !== undefined ? ` expected=${check.expectStatus}` : ""}`);
    if (!isExpectedType) failures.push(`content-type=${contentType || "unknown"}`);
    if (!containsExpected) failures.push("expected response marker missing");
    if (!excludesForbidden) failures.push("stale homepage marker detected");
    if (!originMatches) failures.push(`final-origin=${new URL(response.url).origin}`);
    if (hasServerFailure) failures.push("server failure detected");
    return {
      name: check.name,
      url: check.url,
      finalUrl: response.url,
      status: response.status,
      elapsedMs,
      cacheControl,
      passed,
      note: passed ? "PASS" : failures.join("; ") || "Unexpected response"
    };
  } catch (error) {
    return {
      name: check.name,
      url: check.url,
      finalUrl: null,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      cacheControl: "",
      passed: false,
      note: error.name === "AbortError" ? `Timed out after ${timeoutMs}ms` : error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runLegacyRedirectCheck() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${legacyVerifyBase}/${encodeURIComponent(demoQrvid)}`;
  const expectedLocation = `${platformBase}/verify/${encodeURIComponent(demoQrvid)}`;
  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "user-agent": "qrv-legacy-compatibility/1.0", accept: "text/html,*/*" },
      signal: controller.signal
    });
    const location = response.headers.get("location") || "";
    const resolvedLocation = location ? new URL(location, url).toString() : "";
    const passed = response.status === 308 && resolvedLocation === expectedLocation;
    return {
      name: "legacy-verify-redirect",
      url,
      finalUrl: resolvedLocation || null,
      status: response.status,
      elapsedMs: Date.now() - startedAt,
      cacheControl: response.headers.get("cache-control") || "",
      passed,
      note: passed ? "PASS" : `expected 308 → ${expectedLocation}; got ${response.status} → ${resolvedLocation || "no location"}`
    };
  } catch (error) {
    return {
      name: "legacy-verify-redirect",
      url,
      finalUrl: null,
      status: 0,
      elapsedMs: Date.now() - startedAt,
      cacheControl: "",
      passed: false,
      note: error.name === "AbortError" ? `Timed out after ${timeoutMs}ms` : error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const check of checks) results.push(await runCheck(check));
results.push(await runLegacyRedirectCheck());

const desktopRoot = results.find((result) => result.name === "platform-root-desktop");
const mobileRoot = results.find((result) => result.name === "platform-root-mobile");
const crossDeviceConsistent = Boolean(desktopRoot?.passed && mobileRoot?.passed && desktopRoot.status === mobileRoot.status);
if (!crossDeviceConsistent) {
  results.push({
    name: "cross-device-root-consistency",
    url: platformBase,
    finalUrl: platformBase,
    status: 0,
    elapsedMs: 0,
    cacheControl: "",
    passed: false,
    note: "Desktop and mobile probes did not both resolve to the canonical QR-V platform homepage"
  });
}

console.table(results.map(({ name, status, elapsedMs, passed, note }) => ({ name, status, elapsedMs, result: passed ? "PASS" : "FAIL", note })));
const failures = results.filter((result) => !result.passed);
console.log(JSON.stringify({
  architecture: "two-node-consolidated",
  deliveryContract: "single-canonical-platform-origin",
  platformRepository: "ohi-stack/qrv-node",
  platformBase,
  apiBase,
  legacyVerifyBase,
  demoQrvid,
  unknownQrvid,
  malformedQrvid,
  checkedAt: new Date().toISOString(),
  crossDeviceConsistent,
  passed: failures.length === 0,
  results
}, null, 2));
if (failures.length > 0) process.exitCode = 1;
