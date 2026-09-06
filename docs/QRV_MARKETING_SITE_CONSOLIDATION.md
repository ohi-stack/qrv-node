# QR-V™ Marketing Site → qrv-node Consolidation

Status: Source migration materially complete; deployment/live acceptance pending
Canonical public-platform repository: `ohi-stack/qrv-node`
Migration/source-history repository: `ohi-stack/qrv-marketing-site`
Target public origin: `https://qrv.network`

## Completed

- React/Vite customer frontend consolidated into `qrv-node`
- Sites visual system maintained under `src/web/`
- Express serves `dist/assets/*` and `dist/index.html` while preserving dynamic routes
- canonical API boundary remains `https://api.qrv.network/api/v1`
- commercialization baseline preserved under `docs/COMMERCIALIZATION_BASELINE.md`
- production content strategy migrated under `docs/CONTENT_STRATEGY.md`
- SEO assets migrated under `public/`
- Sites provenance and manifest preserved under `sites/qrv-global-verification/`
- source repository documentation repointed to `qrv-node` as canonical production authority

## Production authority preserved

`qrv-node` remains authoritative for:

- Express runtime
- verification presentation and fail-closed behavior
- issuer authentication/session behavior
- registry/API trust-boundary integration
- QR generation
- health/readiness/version endpoints
- CI and live acceptance
- Hostinger deployment contract

`qrv-api` remains authoritative for trusted API, registry persistence, cryptography, issuance, revocation and audit operations.

## Remaining gates

```text
[x] React/Vite frontend consolidated
[x] Express/Vite runtime handoff implemented
[x] commercialization/content strategy preserved
[x] robots/sitemap/web manifest migrated
[x] Sites provenance preserved
[ ] final visual/mobile parity review
[ ] Hostinger qrv.network deployment confirmed on qrv-node/main
[ ] live issue → QR → VERIFIED → revoke → REVOKED acceptance passes
```

Do not delete or archive `qrv-marketing-site` until the remaining deployment and live-acceptance evidence is recorded.
