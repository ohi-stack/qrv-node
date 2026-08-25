# QR-V™ Platform Node

`ohi-stack/qrv-node` is the canonical public application for `qrv.network`.

## Two-node production architecture

```text
qrv.network
  Public platform node
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
  └── /admin   (private, authenticated)
        │
        ▼
api.qrv.network
  Canonical API + registry node
        │
        ▼
PostgreSQL / Google Cloud SQL
```

The target deployment uses only two active public nodes:

1. `qrv.network` — all human-facing application routes.
2. `api.qrv.network` — all machine-facing API, registry persistence, lifecycle mutation, and audit access.

## 30-day commercial priority

The platform is now in revenue validation, not architecture expansion.

The flagship offer is the **QR-V™ Verified Certificate Pilot**.

Primary user journey:

```text
Certificate landing page
→ live verification demo
→ Start Pilot / Book Demo
→ payment or approved pilot
→ issuer onboarding
→ issuer creates production record
→ QR-V code generated
→ public verification
→ lifecycle management / revocation
```

Primary operating target:

```text
100 qualified issuer prospects
→ 10+ demos
→ 5+ proposals
→ 3–5 paying issuers
→ 500+ production QR-V records
```

## Canonical verification URL

New QR-V records should encode:

```text
https://qrv.network/verify/{QRVID}
```

QRVP-1 allows HTTPS gateway identifiers, so this keeps protocol behavior while reducing operational surface area.

## Public commercial routes

The certificate-first sprint should prioritize:

```text
/certificates
/demo
/pricing
/store
/issuer
/issuer/dashboard
/issuer/records
/verify/:qrvid
```

All relevant commercial pages should drive toward either **Start Pilot**, **Buy / Pay**, or **Book Demo**. Avoid adding speculative navigation during the 30-day sprint.

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

## Legacy subdomain compatibility

If legacy subdomains are pointed to this same Hostinger application, the platform issues permanent redirects:

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

This preserves older QR codes and bookmarks while making `qrv.network` canonical.

## Issuer Portal

`/issuer` is part of the platform node. The consolidated portal must provide:

- server-side issuer authentication;
- issued-record listing;
- record creation;
- certificate issuance fields;
- expiration date support;
- QRVID generation through the API;
- SVG verification QR generation;
- record detail;
- revocation;
- public verification handoff;
- basic verification analytics;
- billing / entitlement status.

Issuer access fails closed until these are configured:

```env
SESSION_SECRET=
ISSUER_ACCESS_CODE=
QRV_PLATFORM_API_KEY=
```

## Security boundary

The platform node must **not** receive `DATABASE_URL`.

Database credentials belong only on `api.qrv.network`. The shared `QRV_PLATFORM_API_KEY` is server-to-server and must never be exposed to browser JavaScript.

## Production signing gate

SHA-256 integrity validation and Ed25519 issuer signing are separate states. Do not claim full issuer-signed QRVP-1 verification until Ed25519 key management, record signing, signature persistence, and verification are operational end-to-end.

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

The v1 lifecycle is complete only when a real approved external issuer can:

```text
be onboarded / entitled
→ issue a production record
→ generate QRVID + QR
→ qrv.network/verify/{QRVID} = VERIFIED
→ revoke the record
→ same URL = REVOKED
→ operator sees issuance, verification, revenue, and audit state in /admin
```
