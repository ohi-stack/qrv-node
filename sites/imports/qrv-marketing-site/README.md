# QR-V™ Marketing / Public Content Source

`ohi-stack/qrv-marketing-site` is now a **source/reference repository** for the QR-V™ public visual system, content, SEO assets, commercialization material, and ChatGPT Sites-origin provenance.

It is **not** the canonical production runtime for `qrv.network`.

## Canonical production ownership

```text
qrv.network       → ohi-stack/qrv-node
api.qrv.network   → ohi-stack/qrv-api
```

## Convergence status — September 6, 2026

The customer-facing React/Vite frontend has been converged into `ohi-stack/qrv-node` and activated from the canonical platform runtime.

Canonical production activation commit:

```text
ed8831a4a45c061a69400fe5aad75557b9cb9e4b
```

Additional September 6 consolidation commits in `qrv-node/main` preserved the commercialization baseline, content strategy, SEO assets, web manifest, and Sites provenance.

The resulting production model is:

```text
qrv.network
  React/Vite customer frontend
  + Express production boundary
        │
        ▼
api.qrv.network/api/v1
  trusted API / registry / verification authority
```

Express remains responsible for operational verification, issuer sessions and mutations, registry/API handoff, QR generation, health/readiness/version, security middleware, and compatibility redirects. React/Vite owns the customer-facing presentation layer.

## Repository role now

This repository remains the historical/source reference for:

- original React/Vite customer-facing frontend source;
- QR-V visual design system;
- homepage composition and public messaging;
- commercialization/content strategy;
- responsive layout behavior;
- SEO files and metadata;
- robots and sitemap source;
- web manifest;
- ChatGPT Sites-origin metadata and provenance;
- source validation scripts.

It must not define a competing `qrv.network` production deployment.

## Runtime guard

This repository must not be deployed as the production `qrv.network` origin.

For source preview:

```bash
npm run dev
```

For validation:

```bash
npm install
npm run check
npm run build
```

If an explicit non-production start wrapper is used:

```bash
QRV_ALLOW_SOURCE_PREVIEW=1 npm start
```

Never set `QRV_ALLOW_SOURCE_PREVIEW=1` on the production QR-V Hostinger application.

## Canonical public routes

```text
https://qrv.network/
https://qrv.network/protocol
https://qrv.network/how-it-works
https://qrv.network/verify
https://qrv.network/verify/{QRVID}
https://qrv.network/registry
https://qrv.network/explorer
https://qrv.network/issuer
https://qrv.network/docs
https://qrv.network/developers
https://qrv.network/api-reference
https://qrv.network/use-cases
https://qrv.network/pricing
https://qrv.network/status
https://qrv.network/security
https://qrv.network/store
https://qrv.network/about
```

Canonical machine API:

```text
https://api.qrv.network/api/v1
```

New QR-V codes must encode:

```text
https://qrv.network/verify/{QRVID}
```

## Legacy hostname policy

Historical service hostnames are compatibility aliases only:

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

They must not be used as canonical destinations by new QR codes, environment defaults, sitemaps, or customer-facing links.

## Remaining retirement gate

The source migration is now materially complete, but this repository should remain available until deployment and live acceptance evidence are complete:

```text
[x] React/Vite customer frontend present in qrv-node
[x] customer frontend activated from qrv-node
[x] qrv-node production CI passed for frontend activation
[x] qrv-node production readiness passed for frontend activation
[x] operational verifier/issuer/registry routes remain server-controlled
[x] commercialization/content strategy preserved in qrv-node
[x] robots/sitemap/manifest migrated to qrv-node
[x] Sites provenance preserved in qrv-node
[ ] final visual/mobile parity review
[ ] Hostinger deployment points qrv.network to qrv-node/main
[ ] live issue → QR → VERIFIED → revoke → REVOKED acceptance passes
```

Until those final evidence gates are complete, retain this repository as a protected source and historical reference.
