# QR-V™ Runtime Convergence Acceptance

## Required local/CI gate

```bash
npm install
npm run validate:prod
```

Pass conditions:

- compiled Sites frontend exists in `dist/`;
- `/` and ordinary public deep links return the compiled SPA;
- `/verify/*` remains Express-owned;
- `/issuer/*` remains Express-owned;
- `/registry/*` remains Express-owned;
- `/api/*` remains non-SPA;
- `/healthz`, `/readyz`, and `/version` remain operational endpoints;
- `/qr/*` remains server-generated;
- direct `QRV-*` compatibility URLs still redirect to `/verify/{QRVID}`;
- legacy subdomains return canonical 308 redirects before SPA handling.

## Required live gate after deployment

```text
GET https://qrv.network/
GET https://qrv.network/protocol
GET https://qrv.network/verify
GET https://qrv.network/registry
GET https://qrv.network/issuer
GET https://qrv.network/healthz
GET https://qrv.network/readyz
GET https://qrv.network/version
GET https://qrv.network/verify/QRV-PROD-CERT-000001
```

The live gate is not complete until the canonical verification flow obtains its result from `https://api.qrv.network/api/v1` and the issuer lifecycle remains functional.
