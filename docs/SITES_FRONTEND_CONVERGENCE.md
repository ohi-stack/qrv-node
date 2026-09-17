# QR-V™ Sites Frontend Runtime Convergence

## Status

The customer-facing Sites frontend is now integrated into `qrv-node` as both:

1. the canonical React/Vite source layer under `src/web/`; and
2. the compiled browser presentation served from `dist/` by the existing Express production runtime.

This completes the runtime convergence step. It does **not** move trusted verification, registry mutation, issuer authentication, health/readiness, or API compatibility behavior into the SPA.

## Runtime ownership

`qrv-node` remains authoritative for:

- Express server/runtime behavior;
- issuer authentication and sessions;
- public verification results;
- registry lookups;
- QR generation;
- fail-closed API dependency handling;
- health/readiness/version endpoints;
- legacy-host compatibility redirects;
- the `/api/v1/*` compatibility gateway;
- production CI and live acceptance.

The compiled Sites frontend owns the public/customer presentation for ordinary human-facing routes.

## Canonical production topology

```text
Browser / QR scan / issuer user
              ↓
        https://qrv.network
              ↓
   Express + compiled Sites UI
              ↓
https://api.qrv.network/api/v1
              ↓
     Canonical QR-V registry
```

`api.qrv.network` remains the only separately operated trusted API/data-plane hostname.

## SPA fallback exclusions

The following route families are explicitly excluded from SPA fallback and remain server-owned:

```text
/verify
/verify/*
/issuer
/issuer/*
/registry
/registry/*
/api/*
/healthz
/health
/readyz
/version
/metrics
/qr/*
/explorer
/explorer/*
/status
/robots.txt
/sitemap.xml
/site.webmanifest
```

Direct QRVID compatibility paths such as:

```text
/QRV-PROD-CERT-000001
```

also bypass SPA fallback and retain their 308 redirect to the canonical verification URL.

## Legacy hostname precedence

Legacy branded hostnames redirect **before** any static or SPA handling:

```text
verify.qrv.network      → qrv.network/verify
issuer.qrv.network      → qrv.network/issuer
registry.qrv.network    → qrv.network/registry
explorer.qrv.network    → qrv.network/explorer
docs.qrv.network        → qrv.network/docs
developers.qrv.network  → qrv.network/developers
status.qrv.network      → qrv.network/status
store.qrv.network       → qrv.network/store
wallet.qrv.network      → qrv.network/wallet
admin.qrv.network       → qrv.network/admin
```

This prevents a legacy hostname from accidentally rendering the SPA as an independent production origin.

## Build and startup contract

```bash
npm install
npm run build
npm run validate:prod
npm start
```

Vite writes the compiled frontend to `dist/`.

In `NODE_ENV=production`, `qrv-node` refuses to start if `dist/index.html` is missing. This prevents a production deployment from silently falling back to the older server-rendered homepage because the frontend build step was skipped.

Hashed assets under `dist/assets/` are served with immutable long-term caching. Other compiled public assets are served from `dist/` without intercepting protected server routes.

## Validation gates

`npm run validate:prod` now performs all of the following:

1. JavaScript syntax checks;
2. Sites visual/content contract checks;
3. compiled frontend build;
4. compiled artifact verification;
5. executable local routing contract test.

The routing test proves:

- `/` returns the compiled Sites app;
- public deep links such as `/protocol`, `/products/...`, `/solutions/...`, and `/docs/...` return the SPA shell;
- `/verify`, `/registry`, and `/issuer` remain Express-owned;
- `/healthz` and `/version` remain JSON;
- `/api/v1/*` cannot become an HTML SPA response;
- direct QRVID redirects remain intact;
- legacy hostnames redirect before SPA fallback.

## Production acceptance

Runtime convergence is code-complete when this branch passes CI. Production activation still requires deployment acceptance:

```text
qrv.network homepage loads compiled Sites UI
→ operational routes remain server-owned
→ api.qrv.network is healthy and ready
→ QRV-PROD-CERT-000001 verifies through the canonical API
→ issuer login / issuance / QR / verification / revocation remain functional
```

The frontend may improve presentation, but it must never assert a verification result independently of the canonical API/registry authority.
