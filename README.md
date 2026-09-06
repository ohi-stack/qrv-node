# QR-V™ Platform Node

`ohi-stack/qrv-node` is the canonical public application for `qrv.network`.

## QR-V Production Architecture v1.0

QR-V uses a strict two-node production model:

```text
qrv.network
  Public platform/application layer
  ├── customer-facing React/Vite frontend
  ├── /verify
  ├── /verify/:qrvid
  ├── /issuer
  ├── /issuer/dashboard
  ├── /issuer/records
  ├── /registry
  ├── /explorer
  ├── /docs
  ├── /developers
  ├── /api-reference
  ├── /pricing
  ├── /store
  ├── /status
  ├── /security
  └── /admin   (private, authenticated)
        │
        ▼
api.qrv.network
  Private backend/data/API layer
        │
        ▼
Canonical PostgreSQL registry
```

The active production runtime target is only:

1. `qrv.network` — all human-facing routes, issuer workflows, public verification UX, docs, explorer, pricing, customer-facing frontend, and authenticated platform sessions.
2. `api.qrv.network` — all machine-facing API, persistence, lifecycle mutation, cryptographic operations, audit access, rate limiting, and privileged backend logic.

All legacy public service hostnames are compatibility aliases only.

## Sites frontend consolidation

The QR-V Sites/customer-facing visual system is now being consolidated directly into this repository.

Canonical frontend source:

```text
src/web/
├── App.jsx
├── main.jsx
├── config.js
└── styles.css
```

Build output:

```text
dist/web/
```

The production server keeps authority over operational and trusted routes while serving the built React frontend for customer-facing routes.

### Server-controlled routes

```text
/verify
/verify/:qrvid
/registry
/registry/:qrvid
/issuer
/issuer/*
/status
/api-reference
/api/v1/*
/healthz
/readyz
/version
/qr/:qrvid.svg
```

### Customer-facing frontend routes

The React/Vite frontend is used for the public product, education, commercial, and discovery experience, including:

```text
/
/protocol
/how-it-works
/use-cases
/pricing
/developers
/about
/standards
/security
/enterprise
/certificate-verification
/docs
/network
/store
/billing
/wallet
```

If `dist/web` is absent, `qrv-node` retains its server-rendered fallback rather than crashing the platform.

## Migration-source repository

`ohi-stack/qrv-marketing-site` remains a migration/reference source until frontend, SEO, content, and Sites-origin parity is validated.

It is not the production runtime for `qrv.network`.

Do not archive or delete that repository until the consolidation Definition of Done is satisfied.

## Build and validation

```bash
npm install
npm run build
npm run check
npm start
```

Production validation must confirm:

```text
/healthz                 → 200 JSON and frontend=sites-react when build exists
/readyz                  → 200 only when api.qrv.network is ready
/                        → customer-facing Sites frontend
/protocol                → customer-facing Sites frontend
/pricing                 → customer-facing Sites frontend
/verify                  → operational verifier
/issuer                  → operational issuer access
/registry                → operational registry lookup
/api/v1/*                → compatibility proxy only
```

After deployment run:

```bash
npm run acceptance:live
```

The final regression gate remains:

```text
issuer login
→ create production record
→ QRVID generated
→ QR generated
→ qrv.network/verify/{QRVID} = VERIFIED
→ revoke record
→ same URL = REVOKED
→ audit state preserved
```

## Security boundary

`qrv.network` must **never** receive production database credentials, Supabase secret/server keys, unrestricted admin credentials, payment-provider secrets, or signing private keys.

The platform node may receive only the application/session variables it needs to securely call the API node:

```env
NODE_ENV=production
PORT=3000
APP_VERSION=1.1.1
QRV_PLATFORM_ORIGIN=https://qrv.network
QRV_API_BASE_URL=https://api.qrv.network/api/v1
QRV_PLATFORM_API_KEY=
SESSION_SECRET=
ISSUER_ACCESS_CODE=
SESSION_TTL_MS=43200000
```

`QRV_PLATFORM_API_KEY` is server-to-server only and must never be exposed to browser JavaScript.

## Canonical public URLs

```text
APP              https://qrv.network
VERIFY           https://qrv.network/verify
REGISTRY UI      https://qrv.network/registry
ISSUER           https://qrv.network/issuer
DOCS             https://qrv.network/docs
DEVELOPERS       https://qrv.network/developers
STATUS           https://qrv.network/status
API              https://api.qrv.network/api/v1
```

New QR-V records must encode:

```text
https://qrv.network/verify/{QRVID}
```

QRVP-1 permits HTTPS gateway identifiers, so this preserves the protocol flow while reducing operational surface area.

## Legacy compatibility

If legacy subdomains remain mapped, they must operate only as permanent HTTP 308 compatibility redirects:

```text
verify.qrv.network      → qrv.network/verify
issuer.qrv.network      → qrv.network/issuer
registry.qrv.network    → qrv.network/registry
explorer.qrv.network    → qrv.network/explorer
docs.qrv.network        → qrv.network/docs
developers.qrv.network  → qrv.network/developers
status.qrv.network      → qrv.network/status
store.qrv.network       → qrv.network/store
```

This preserves older printed QR codes and bookmarks without keeping duplicate production applications alive.

## Product focus

The platform is in activation and revenue validation, not architecture expansion.

The flagship commercial offer is the **QR-V™ Verified Certificate Pilot**.

Primary lifecycle:

```text
approved issuer
→ issue certificate record
→ API persists canonical registry data
→ QRVID generated
→ QR generated
→ qrv.network/verify/{QRVID}
→ VERIFIED / EXPIRED / REVOKED / NOT_FOUND
→ audit + operator visibility
```

## Hostinger deployment

```text
Repository: ohi-stack/qrv-node
Branch: main (after consolidation PR is approved and merged)
Framework: Node / Express
Node: 20+
Install: npm install
Build: npm run build
Start: npm start
Port: process.env.PORT
Domain: qrv.network
```

## Commercial Definition of Done

QR-V Production Architecture v1.0 is commercially complete only when a real approved external issuer can:

```text
be onboarded / entitled
→ issue a production record
→ generate QRVID + QR
→ qrv.network/verify/{QRVID} = VERIFIED
→ expire or revoke the record
→ same public URL returns EXPIRED or REVOKED deterministically
→ operator sees issuance, verification, revenue, security, and audit state in /admin
```
