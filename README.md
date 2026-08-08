# QR-V™ Platform Node

`ohi-stack/qrv-node` is now the canonical public application for `qrv.network`.

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
  └── /status
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

## Canonical verification URL

New QR-V records should encode:

```text
https://qrv.network/verify/{QRVID}
```

QRVP-1 allows HTTPS gateway identifiers, so this keeps protocol behavior while reducing operational surface area.

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

`/issuer` is now part of the platform node. The initial consolidated portal provides:

- server-side issuer authentication;
- issued-record listing;
- record creation;
- certificate issuance fields;
- QRVID generation through the API;
- SVG verification QR generation;
- record detail;
- revocation;
- public verification handoff.

Issuer access fails closed until these are configured:

```env
SESSION_SECRET=
ISSUER_ACCESS_CODE=
QRV_PLATFORM_API_KEY=
```

## Security boundary

The platform node must **not** receive `DATABASE_URL`.

Database credentials belong only on `api.qrv.network`. The shared `QRV_PLATFORM_API_KEY` is server-to-server and must never be exposed to browser JavaScript.

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

The production acceptance lifecycle is:

```text
issuer login
→ issue record
→ generate QRVID
→ generate QR
→ qrv.network/verify/{QRVID} = VERIFIED
→ revoke record
→ same URL = REVOKED
```
