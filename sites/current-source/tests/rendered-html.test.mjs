import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" }, ...init }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function renderJson(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "application/json" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the verified-origin QR-V production architecture", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /qrv\.network/i);
  assert.match(html, /qrv\.network\/api\/v1/i);
  assert.match(html, /Production services on one verified origin/i);
  assert.doesNotMatch(html, /signatureValid[^<]{0,40}true/i);
});

test("exposes platform health, readiness, and version contracts", async () => {
  for (const path of ["/healthz", "/readyz", "/version"]) {
    const response = await renderJson(path);
    assert.ok([200, 503].includes(response.status));
    assert.match(response.headers.get("content-type") ?? "", /application\/json/i);
    const body = await response.json();
    assert.equal(body.service, "qrv-network-site");
  }
});

test("renders the full QR-V mega menu", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const label of ["Products", "Solutions", "Developers", "Documentation", "Pricing", "About"]) {
    assert.match(html, new RegExp(`>${label}<`));
  }
  assert.match(html, /id="menu-products"/);
  assert.match(html, /Verify a Record/);
  assert.match(html, /Public Registry/);
});

test("uses surface-specific QR-V logos", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /qrv-global-verification-logo-white-bg\.png/);
  assert.match(html, /qrv-global-verification-logo\.png/);
});

test("renders the canonical verification path", async () => {
  const response = await render("/verify/QRV-PROD-CERT-000001");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /QRV-PROD-CERT-000001/);
  assert.match(html, /Resolving registry record/i);
  assert.match(html, /Public test records/i);
});

test("renders the QR-V ChatGPT sign-in choices", async () => {
  const response = await render("/signin");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Signin With ChatGPT/);
  assert.match(html, /Use email/);
  assert.match(html, /Continue with Google/);
  assert.match(html, /This service area is part of the QR[‑-]V Global Verification Network/);
  assert.match(html, /signin-with-chatgpt/);
});

test("renders the authenticated issuer dashboard workspace", async () => {
  const response = await render("/issuer/dashboard", {
    headers: {
      "oai-authenticated-user-email": "issuer@example.com",
      "oai-authenticated-user-full-name": "Issuer%20Operator",
      "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
    },
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Issuer workspace/);
  assert.match(html, /Records issued/);
  assert.match(html, /Verification activity/);
  assert.match(html, /Recent issuer activity/);
  assert.match(html, /Issuer authorization is separate from ChatGPT sign-in/);
});

test("renders the imported QR-V news archive", async () => {
  const response = await render("/news");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /News, research and platform updates/i);
  assert.match(html, /Developer Community Updates/);
  assert.match(html, /Introducing the QR-V/);
  assert.match(html, /QR-V Announcements/);
  assert.match(html, /Research &amp; Whitepapers/);
});

test("renders an imported QR-V news article", async () => {
  const response = await render("/news/introducing-the-qr-v-global-verification-network");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Introducing the QR-V/);
  assert.match(html, /QR-V Editorial/);
  assert.match(html, /March 3, 2026/);
});
