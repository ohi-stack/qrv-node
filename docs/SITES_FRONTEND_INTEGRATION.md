# QR-V™ Sites Frontend Integration

## Purpose

This integration brings the customer-facing QR-V visual system and React/Vite frontend from `ohi-stack/qrv-marketing-site` into the canonical `ohi-stack/qrv-node` production repository without replacing the production QR-V runtime.

## Runtime boundary

`qrv-node/server.js` remains the production authority for:

- issuer authentication and session handling;
- verification and registry presentation;
- calls to `api.qrv.network`;
- issuer record issuance and revocation workflows;
- QR generation;
- health, readiness, and version endpoints;
- legacy-host redirects;
- API compatibility proxying;
- fail-closed verification behavior;
- rate limiting and HTTP security middleware.

The imported Sites frontend is a presentation layer only.

## Frontend source

```text
web/
├── index.html
└── src/
    ├── App.jsx
    ├── config.js
    ├── main.jsx
    └── styles.css
```

The Vite build emits the browser bundle to:

```text
dist/
```

At runtime, Express serves the built Sites homepage at `/` when `dist/index.html` exists. If the frontend bundle is absent, the original server-rendered homepage remains available as a safe fallback. All operational QR-V routes continue to execute through the existing Express handlers.

## Canonical topology

```text
qrv.network
PUBLIC PLATFORM / CUSTOMER UI
      │
      ▼
api.qrv.network/api/v1
TRUSTED API / DATA BOUNDARY
      │
      ▼
PostgreSQL
CANONICAL REGISTRY
```

No database credentials, signing private keys, webhook secrets, or privileged server credentials may be exposed in the React/Vite bundle.

## Public frontend variables

Only `VITE_*` values documented in `.env.example` may be embedded into the browser bundle. They are URLs, the public demo QRVID, and other non-secret presentation configuration.

## Build and validation

```bash
npm install
npm run check
npm run build:web
npm run validate:prod
```

Expected artifact:

```text
dist/index.html
```

The production CI workflow now builds this artifact in addition to preserving the existing syntax, acceptance-script, and dependency-audit gates.

## Deployment

Hostinger should continue to run the Express production service:

```text
Repository: ohi-stack/qrv-node
Runtime: Node.js 20+ / 22.x
Build: npm run build
Start: npm start
```

The deployment must not use `vite preview` as the production server.

## Acceptance

The Sites homepage does not change the QR-V trust model. Production acceptance remains dependent on the existing live gate, including the canonical demo record and backend readiness.

Minimum checks:

```text
GET /
GET /healthz
GET /readyz
GET /version
GET /verify/QRV-PROD-CERT-000001
GET /issuer
GET /registry
GET /developers
GET /status
```

The public UI must not assert `VERIFIED` unless the canonical API returns the corresponding authoritative state.
