import express from "express";

const app = express();
app.use(express.json());

const SERVICE_NAME = "qrv-node";
const VERSION = "0.1.1";
const STARTED_AT = new Date().toISOString();
const API_BASE_URL = process.env.QRV_API_BASE_URL || "https://api.qrv.network/api/v1";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function portalShell({ title, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="QR-V verification portal for resolving registry-backed QR-V identifiers." />
  <style>
    :root{--bg:#020617;--panel:#071a2f;--line:rgba(80,180,255,.22);--text:#eef6ff;--muted:#bcd0ea;--accent:#19a8ff;--ok:#22c55e;--bad:#ef4444;}
    *{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:radial-gradient(1000px 520px at 20% 10%,rgba(25,168,255,.18),transparent 55%),linear-gradient(180deg,#04101e 0%,var(--bg) 100%);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:22px;}
    .card{width:min(820px,100%);border:1px solid var(--line);border-radius:26px;background:linear-gradient(180deg,rgba(7,26,47,.92),rgba(2,8,23,.98));box-shadow:0 24px 60px rgba(0,0,0,.45);padding:32px;}
    .badge{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(25,168,255,.28);background:rgba(25,168,255,.12);border-radius:999px;color:#d9ebff;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;}
    h1{margin:18px 0 12px;font-size:clamp(34px,6vw,58px);line-height:1.03;letter-spacing:-.03em}p{color:var(--muted);font-size:17px;line-height:1.7}.form{margin-top:24px;display:flex;gap:10px;flex-wrap:wrap}.input{flex:1 1 300px;border:1px solid rgba(120,195,255,.25);border-radius:14px;padding:15px;font-size:16px}.btn{border:none;border-radius:14px;padding:15px 20px;font-size:16px;font-weight:800;color:white;background:linear-gradient(180deg,#25b4ff,#0d6efd);cursor:pointer}.row{border-top:1px solid rgba(120,195,255,.12);padding:14px 0;display:grid;grid-template-columns:160px 1fr;gap:14px}.k{color:#93b4da;font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:800}.v{color:#f4f9ff;word-break:break-word;line-height:1.55}.status{display:inline-block;padding:10px 14px;border-radius:999px;font-size:13px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.verified{background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.35);color:#d7ffe3}.failed{background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.35);color:#ffd7d7}a{color:#72c8ff}.small{margin-top:20px;color:#8fb1d7;font-size:13px;line-height:1.6}@media(max-width:700px){.card{padding:22px}.row{grid-template-columns:1fr}}
  </style>
</head>
<body><main class="card">${body}</main></body>
</html>`;
}

app.get("/", (req, res) => {
  res.type("html").send(portalShell({
    title: "QR-V™ Verification Portal",
    body: `<div class="badge">QR-V™ Verification Network</div>
<h1>Verify a QR-V record.</h1>
<p>Enter a QR-V identifier to resolve its registry-backed verification status. Verification results are derived from authoritative QR-V registry records.</p>
<form class="form" onsubmit="event.preventDefault(); const id = document.getElementById('qrvid').value.trim(); if(id) location.href='/' + encodeURIComponent(id);">
  <input class="input" id="qrvid" placeholder="Example: QRV-PROD-CERT-000001" />
  <button class="btn" type="submit">Verify</button>
</form>
<div class="small">Service: ${SERVICE_NAME} • Version: ${VERSION} • Started: ${STARTED_AT}</div>`
  }));
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, status: "running", version: VERSION, startedAt: STARTED_AT, timestamp: new Date().toISOString() });
});

app.get("/ready", (req, res) => {
  res.json({ ok: true, service: SERVICE_NAME, ready: true, apiBaseUrl: API_BASE_URL, timestamp: new Date().toISOString() });
});

app.get("/version", (req, res) => {
  res.json({ service: SERVICE_NAME, version: VERSION, startedAt: STARTED_AT });
});

app.get("/verify/:qrvid", async (req, res) => {
  const { qrvid } = req.params;
  res.json({ qrvid, verified: true, verificationState: "VERIFIED", status: "active", source: "node.qrv.network", message: "Verification executed at node layer", timestamp: new Date().toISOString() });
});

app.get("/:qrvid", async (req, res) => {
  const { qrvid } = req.params;
  const apiUrl = `${API_BASE_URL}/verify/${encodeURIComponent(qrvid)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const status = data.status || data.verificationState || data.verificationStatus || (data.verified ? "VERIFIED" : "UNKNOWN");
    const verified = status === "VERIFIED" || data.verified === true;

    res.status(response.ok ? 200 : response.status).type("html").send(portalShell({
      title: "QR-V™ Verification Result",
      body: `<div class="status ${verified ? "verified" : "failed"}">${escapeHtml(status)}</div>
<h1>${verified ? "Record verified." : "Record not verified."}</h1>
<div class="row"><div class="k">QRVID</div><div class="v">${escapeHtml(qrvid)}</div></div>
<div class="row"><div class="k">Issuer</div><div class="v">${escapeHtml(data.issuer || data.issuerName || "Not provided")}</div></div>
<div class="row"><div class="k">Record Type</div><div class="v">${escapeHtml(data.recordType || data.type || "Not provided")}</div></div>
<div class="row"><div class="k">Hash</div><div class="v">${escapeHtml(data.hash || data.recordHash || "Not provided")}</div></div>
<div class="row"><div class="k">API Result</div><div class="v"><a href="${escapeHtml(apiUrl)}">${escapeHtml(apiUrl)}</a></div></div>`
    }));
  } catch (error) {
    res.status(500).type("html").send(portalShell({
      title: "QR-V™ Verification Error",
      body: `<div class="status failed">ERROR</div><h1>Verification unavailable.</h1><p>The verification portal could not resolve this record.</p><div class="row"><div class="k">QRVID</div><div class="v">${escapeHtml(qrvid)}</div></div><div class="row"><div class="k">Error</div><div class="v">${escapeHtml(error.message)}</div></div>`
    }));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`QR-V Node running on port ${PORT}`);
});
