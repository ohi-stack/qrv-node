# QR-V™ Platform Node

`ohi-stack/qrv-node` is the canonical public application for `qrv.network`.

## QR-V Production Architecture v1.0

QR-V now uses a strict two-node production model:

```text
qrv.network
  Public platform/application layer
  ├── /
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
PostgreSQL / Google Cloud SQL
```

The active production runtime target is only:

1. `qrv.network` — all human-facing routes, issuer workflows, public verification UX, docs, explorer, pricing, and authenticated platform sessions.
2. `api.qrv.network` — all machine-facing API, persistence, lifecycle mutation, cryptographic operations, audit access, rate limiting, and privileged backend logic.

All legacy public service hostnames are compatibility aliases only.

## Security boundary

`qrv.network` must **never** receive production database credentials, Supabase secret/server keys, unrestricted admin credentials, payment-provider secrets, or signing private keys.

The platform node may receive only the application/session variables it needs to securely call the API node:

```env
NODE_ENV=production
PORT=3000
APP_VERSION=1.0.0
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

The Issuer Portal must support:

- server-side issuer authentication;
- issued-record listing;
- certificate issuance;
- expiration dates;
- QRVID generation through the API;
- SVG QR generation;
- record detail;
- revocation;
- public verification handoff;
- basic verification analytics;
- billing / entitlement state.

Issuer access fails closed until these are configured:

```env
SESSION_SECRET=
ISSUER_ACCESS_CODE=
QRV_PLATFORM_API_KEY=
```

## 30-day commercial priority

```text
100 qualified issuer prospects
→ 10+ demos
→ 5+ proposals
→ 3–5 paying issuers
→ 500+ production QR-V records
```

All relevant public pages should drive toward **Start Pilot**, **Buy / Pay**, or **Book Demo**.

## Admin route

`/admin` is a private operator dashboard. It should surface:

- paying issuers;
- pilot issuers;
- implementation revenue;
- contracted MRR;
- production records;
- verifications;
- revocations / expirations;
- prospect → demo → proposal → paid pipeline;
- issuer onboarding state;
- Ed25519/signing readiness;
- API/database health;
- suspicious verification activity.

The browser must never receive production database credentials, payment secrets, or unrestricted administrative API keys.

## Production signing gate

SHA-256 integrity validation and Ed25519 issuer signing are separate operational states.

Do not claim full issuer-signed QRVP-1 verification until Ed25519 key management, record signing, signature persistence, public-key verification, key rotation, and fail-closed invalid-signature handling are operational end-to-end.

## Deferred until customer validation

Do not make commercial v1 dependent on:

- mobile scanner app;
- wallet;
- blockchain registry migration;
- federated issuer nodes;
- multi-region replication;
- separate explorer/docs/developer deployments;
- speculative new record verticals.

## Hostinger deployment

```text
Repository: ohi-stack/qrv-node
Branch: main
Framework: Node / Express
Node: 20+
Install: npm install
Start: npm start
Port: process.env.PORT
Domain: qrv.network
```

## Acceptance routes

```text
https://qrv.network/
https://qrv.network/verify
https://qrv.network/issuer
https://qrv.network/registry
https://qrv.network/docs
https://qrv.network/developers
https://qrv.network/api-reference
https://qrv.network/pricing
https://qrv.network/store
https://qrv.network/status
https://qrv.network/healthz
https://qrv.network/readyz
https://qrv.network/version
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
