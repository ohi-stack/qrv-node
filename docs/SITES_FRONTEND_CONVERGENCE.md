# QR-V™ Sites Frontend Convergence

## Status

The customer-facing frontend from `ohi-stack/qrv-marketing-site` is now represented in `qrv-node` as a buildable React/Vite source layer under `src/web/`.

This change deliberately preserves the existing `qrv-node` Express runtime, issuer controls, verification behavior, health/readiness endpoints, API boundary, redirects, and production acceptance logic.

## Source authority

For this convergence stage:

- `qrv-node` remains authoritative for server/runtime behavior, authentication, sessions, API communication, fail-closed verification, health/readiness, production configuration, CI, and acceptance.
- the Sites/marketing source remains authoritative for the customer-facing visual system and conversion-oriented public presentation.

## Imported visual system

The consolidated frontend preserves the Sites design language:

- deep navy verification-infrastructure background;
- gold primary action/accent system;
- cyan protocol/data accents;
- high-contrast enterprise typography;
- rounded verification cards and service panels;
- prominent public verification CTA;
- responsive one-column mobile behavior;
- customer-oriented product, use-case, issuer, and developer messaging.

## Canonical production URLs

The frontend uses the two-node production model:

```text
qrv.network
  /verify
  /issuer
  /registry
  /docs
  /developers
  /pricing
  /status
  /protocol
  /standards
  /security
  /use-cases
  /about

api.qrv.network/api/v1
  trusted backend / data authority
```

Legacy `verify.`, `issuer.`, `registry.`, `docs.`, and `developers.` production origins are not permitted in the consolidated frontend configuration.

## Build

```bash
npm install
npm run check
npm run build:web
```

The frontend build output is written to `dist/`.

## Validation

`scripts/check-web.mjs` verifies:

- required React/Vite source files exist;
- the customer-facing QR-V product language is retained;
- canonical public routes are present;
- `api.qrv.network/api/v1` remains the backend authority;
- legacy production subdomain origins are absent;
- the core Sites visual tokens remain present.

## Runtime activation gate

This convergence does **not** replace the production Express route surface merely because the React build exists.

Before switching `/` to the compiled frontend, require:

1. `npm run validate:prod` passes;
2. the built frontend is served without intercepting `/healthz`, `/readyz`, `/version`, `/api/v1/*`, `/verify/:qrvid`, `/issuer/*`, or other dynamic routes;
3. issuer authentication and session behavior remains unchanged;
4. public verification remains fail-closed when the API is unavailable;
5. live acceptance passes against `QRV-PROD-CERT-000001`;
6. visual review confirms parity with the Sites customer experience.

Only after this gate should the compiled frontend become the canonical `/` presentation in production.
