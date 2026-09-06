# QR-V™ Marketing Site → qrv-node Consolidation

Status: In progress
Canonical runtime repository: `ohi-stack/qrv-node`
Migration source: `ohi-stack/qrv-marketing-site`
Target public origin: `https://qrv.network`

## Purpose

This migration brings the QR-V Sites visual system and customer-facing React frontend into `qrv-node` while preserving `qrv-node` as the canonical production runtime for verification, issuer workflows, registry UI, health/readiness, security controls and acceptance testing.

## Migrated in this branch

- React/Vite frontend entrypoint (`index.html`)
- Vite production build configuration
- Sites-derived customer-facing React application under `src/web/`
- Sites-derived visual system under `src/web/styles.css`
- Consolidated public configuration under `src/web/config.js`
- React, Vite and Lucide dependencies in `package.json`
- `npm run build` now produces the frontend `dist/` bundle after production checks

## Preserved production authority

The following remain authoritative in `qrv-node` and must not be overwritten by the marketing repository:

- `server.js`
- `src/verification.js`
- issuer authentication/session behavior
- API trust-boundary integration
- QR generation
- verification fail-closed behavior
- health/readiness/version endpoints
- live acceptance testing
- production CI/security workflows
- Hostinger deployment contract

## Runtime handoff requirement

Before this branch can be merged for production deployment, `server.js` must serve the built `dist/` assets for the public homepage without intercepting dynamic routes such as:

- `/verify/:qrvid`
- `/issuer/*`
- `/registry/:qrvid`
- `/api/v1/*`
- `/healthz`
- `/readyz`
- `/version`

The recommended behavior is:

1. Serve `dist/assets/*` as immutable static assets.
2. Serve `dist/index.html` for `/`.
3. Keep all existing dynamic and operational routes under Express.
4. Fall back to the existing server-rendered homepage if `dist/index.html` is missing.

## Definition of done

- [x] Sites visual system migrated
- [x] Customer-facing React source migrated
- [x] Vite build integrated into `qrv-node`
- [x] Canonical two-node URLs used in frontend configuration
- [ ] Express serves `dist/index.html` and `dist/assets/*`
- [ ] `npm install` succeeds
- [ ] `npm run check` succeeds
- [ ] `npm run build` succeeds
- [ ] production CI passes
- [ ] live acceptance passes after deployment
- [ ] marketing repository retirement matrix completed

`qrv-marketing-site` must remain available as a migration source until all material content, SEO and provenance assets have a documented disposition.
