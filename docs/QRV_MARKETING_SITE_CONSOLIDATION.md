# QR-V™ Marketing Site → qrv-node Consolidation

Status: In progress
Canonical public-platform repository: `ohi-stack/qrv-node`
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
- `npm run build` produces the frontend `dist/` bundle after production checks
- commercialization baseline preserved under `docs/COMMERCIALIZATION_BASELINE.md`
- production content strategy migrated under `docs/CONTENT_STRATEGY.md`
- SEO assets migrated under `public/`
- Sites source provenance preserved under `sites/qrv-global-verification/`
- production-readiness workflow now validates the Vite bundle and no longer assumes an npm lockfile exists

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

Before this branch can be merged for production deployment, the Express runtime must serve the built `dist/` assets for the public homepage without intercepting dynamic routes such as:

- `/verify/:qrvid`
- `/issuer/*`
- `/registry/:qrvid`
- `/api/v1/*`
- `/healthz`
- `/readyz`
- `/version`

Required behavior:

1. Serve `dist/assets/*` as immutable static assets.
2. Serve `dist/index.html` for `/`.
3. Keep all existing dynamic and operational routes under Express.
4. Fall back to the existing server-rendered homepage if the bundle is unavailable.

## File disposition matrix

| Source class | Disposition | Canonical location |
|---|---|---|
| React/Vite frontend | Migrated | `index.html`, `vite.config.js`, `src/web/` |
| Visual system | Migrated | `src/web/styles.css` |
| SEO assets | Migrated | `public/` |
| Commercial strategy | Migrated/preserved | `docs/COMMERCIALIZATION_BASELINE.md` |
| Content strategy | Migrated/updated | `docs/CONTENT_STRATEGY.md` |
| Sites provenance | Preserved | `sites/qrv-global-verification/` |
| `server.js` | qrv-node authority | root `server.js` |
| `package.json` | Semantically merged | root `package.json` |
| verification/security/CI | qrv-node authority | existing production files |

## Definition of done

- [x] Sites visual system migrated
- [x] Customer-facing React source migrated
- [x] Vite build integrated into `qrv-node`
- [x] Canonical two-node URLs used in frontend configuration
- [x] Commercialization baseline preserved
- [x] Content strategy migrated and updated for `qrv-node` authority
- [x] SEO assets migrated
- [x] Sites provenance and manifest migrated
- [x] production-readiness workflow validates frontend build without requiring a lockfile
- [ ] Express serves `dist/index.html` and `dist/assets/*`
- [ ] current production-readiness run passes
- [ ] live acceptance passes after deployment
- [ ] every remaining unique marketing-repository file is classified

`qrv-marketing-site` must remain available as a migration source until the final unique-file audit is complete and the consolidated platform passes production acceptance.
