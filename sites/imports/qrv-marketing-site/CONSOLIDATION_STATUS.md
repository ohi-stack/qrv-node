# qrv-marketing-site Consolidation Status

**Status:** FRONTEND CONVERGED / SOURCE REFERENCE RETAINED  
**Canonical production destination:** `ohi-stack/qrv-node`  
**Public runtime:** `https://qrv.network`  
**Trusted backend:** `https://api.qrv.network`  
**Production activation commit:** `ed8831a4a45c061a69400fe5aad75557b9cb9e4b`

The QR-V Sites/customer-facing React/Vite frontend is now present and runtime-activated in `qrv-node`. This repository is no longer an active production migration target; it is retained as a source/reference repository for design, SEO, commercial-content, and Sites provenance evidence.

## Production ownership

```text
qrv.network       → ohi-stack/qrv-node
api.qrv.network   → ohi-stack/qrv-api
```

`qrv-node` now owns the production customer frontend plus the Express runtime boundary. `qrv-api` remains the trusted API/data/verification authority.

## Completed

- React/Vite frontend converged into `qrv-node`;
- customer-facing visual system converged;
- compiled frontend activated from the `qrv-node` runtime;
- production CI passed before runtime activation merge;
- production readiness passed before runtime activation merge;
- operational verification/issuer/registry routes remain Express-controlled;
- canonical public URLs remain under `qrv.network`;
- trusted API remains `api.qrv.network/api/v1`;
- legacy service hostnames remain compatibility aliases only.

## Remaining retirement evidence

This repository should remain available until all of the following are documented:

```text
[ ] final visual/mobile parity review
[ ] SEO metadata parity confirmation
[ ] robots/sitemap/manifest parity confirmation
[ ] commercialization/content-strategy preservation confirmation
[ ] Sites provenance preservation confirmation
[ ] Hostinger deployment points qrv.network to qrv-node/main
[ ] live issue → QR → VERIFIED → revoke → REVOKED acceptance passes
```

## Rules

- Do not deploy this repository as the canonical `qrv.network` application.
- Do not delete source/provenance material before the remaining retirement evidence is complete.
- Do not restore this repository's old server/environment model as a competing production runtime.
- Production verification, issuer workflows, sessions, QR generation, health/readiness, API compatibility, security, and live acceptance belong to `qrv-node`.
- Database access, signing material, registry mutations, audit authority, and privileged secrets remain behind `qrv-api`.