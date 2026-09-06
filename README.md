# QR-V™ Platform Node

`ohi-stack/qrv-node` is the canonical public application for `qrv.network`.

## Runtime architecture

QR-V uses a strict two-node production model:

```text
qrv.network
  React + Vite browser application
  served by an Express production boundary
  ├── public verification UI
  ├── issuer workspace
  ├── registry/explorer UI
  ├── docs/developers/pricing/status
  └── compatibility gateway
        │
        ▼
api.qrv.network
  Trusted API / data / cryptographic authority
        │
        ▼
Canonical PostgreSQL registry
```

QRVP-1 and QVS-1.0 remain the protocol/standard authority. The React conversion changes presentation/runtime structure only; verification truth still comes from `api.qrv.network` and the canonical registry.

## Frontend

The browser application is built with:

- React 19
- Vite 6
- Lucide React
- responsive QR-V navy/gold/cyan design system

Entry files:

```text
index.html
vite.config.js
src/main.jsx
src/App.jsx
src/config.js
src/styles.css
```

The Vite build outputs to:

```text
dist/
```

## Express production boundary

`server.js` does not render marketing pages. It owns only server-side responsibilities:

- serves the Vite `dist/` bundle
- `/platform/verify/:qrvid`
- `/platform/registry/:qrvid`
- issuer session/login/logout
- issuer record creation/read/revocation
- QR SVG generation
- `/api/v1/*` compatibility proxy
- `/healthz`, `/readyz`, `/version`
- robots/sitemap
- legacy-host redirects
- rate limiting and security headers

Browser code never receives:

```text
DATABASE_URL
SUPABASE_SECRET_KEY
QRV_PLATFORM_API_KEY
SESSION_SECRET
ISSUER_ACCESS_CODE
private signing keys
webhook secrets
```

## Development

Run the platform server and Vite development server separately:

```bash
npm install
npm run dev:server
```

Then in a second terminal:

```bash
npm run dev
```

Vite runs on `http://127.0.0.1:5173` and proxies `/platform`, `/qr`, `/healthz`, `/readyz`, and `/version` to the Express server on port 3000.

## Production build

```bash
npm install
npm run build
npm start
```

`npm start` expects `dist/index.html` to exist. If the React/Vite bundle has not been built, browser routes fail closed with `UI_NOT_BUILT`.

## Validation

```bash
npm run check
npm run smoke
npm run acceptance:live
```

`npm run check` validates the server and acceptance script and performs a production Vite build.

## Production environment

Server-side:

```env
NODE_ENV=production
PORT=3000
APP_VERSION=2.0.0
QRV_PLATFORM_ORIGIN=https://qrv.network
QRV_API_BASE_URL=https://api.qrv.network/api/v1
QRV_PLATFORM_API_KEY=
SESSION_SECRET=
ISSUER_ACCESS_CODE=
SESSION_TTL_MS=43200000
```

Browser-safe Vite build values:

```env
VITE_APP_BASE_URL=https://qrv.network
VITE_QRV_VERIFY_BASE_URL=https://qrv.network/verify
VITE_QRV_ISSUER_BASE_URL=https://qrv.network/issuer
VITE_QRV_REGISTRY_BASE_URL=https://qrv.network/registry
VITE_QRV_DOCS_BASE_URL=https://qrv.network/docs
VITE_QRV_DEVELOPERS_BASE_URL=https://qrv.network/developers
VITE_QRV_STATUS_BASE_URL=https://qrv.network/status
VITE_QRV_API_BASE_URL=https://api.qrv.network/api/v1
VITE_QRV_DEMO_QRVID=QRV-PROD-CERT-000001
```

Only public URLs and non-secret identifiers may use the `VITE_` prefix.

## Canonical public URLs

```text
https://qrv.network/
https://qrv.network/verify
https://qrv.network/verify/{QRVID}
https://qrv.network/issuer
https://qrv.network/issuer/dashboard
https://qrv.network/issuer/records
https://qrv.network/registry
https://qrv.network/explorer
https://qrv.network/docs
https://qrv.network/developers
https://qrv.network/api-reference
https://qrv.network/pricing
https://qrv.network/status
https://qrv.network/security
https://qrv.network/about
```

New QR-V codes encode:

```text
https://qrv.network/verify/{QRVID}
```

## Legacy compatibility

Legacy service hostnames may remain mapped only as permanent HTTP 308 compatibility redirects:

```text
verify.qrv.network      → qrv.network/verify
issuer.qrv.network      → qrv.network/issuer
registry.qrv.network    → qrv.network/registry
explorer.qrv.network    → qrv.network/explorer
docs.qrv.network        → qrv.network/docs
developers.qrv.network  → qrv.network/developers
status.qrv.network      → qrv.network/status
```

## Product focus

The first commercial lifecycle remains QR-V™ Verified Certificates:

```text
authorized issuer
→ create registry record
→ generate QRVID
→ generate QR
→ qrv.network/verify/{QRVID}
→ VERIFIED / REVOKED / EXPIRED / NOT_FOUND
```

The browser is presentation. The API and registry remain the authority.
