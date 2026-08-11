# qrv.network — Hostinger Production Deployment

## Deployment target

- Repository: `ohi-stack/qrv-node`
- Branch: `main`
- Framework: Express / Node.js
- Node: 22.x preferred; 20+ supported
- Root directory: `./`
- Package manager: npm
- Entry file: `server.js`
- Start command: `npm start`
- Bind address: `0.0.0.0`
- Port: `process.env.PORT`

## Required environment

```env
NODE_ENV=production
PORT=3000
APP_VERSION=1.0.0
QRV_PLATFORM_ORIGIN=https://qrv.network
QRV_API_BASE_URL=https://api.qrv.network/api/v1
QRV_PLATFORM_API_KEY=<server-side-secret>
SESSION_SECRET=<minimum-32-byte-random-secret>
ISSUER_ACCESS_CODE=<temporary-issuer-bootstrap-code>
SESSION_TTL_MS=43200000
```

Never commit production secrets. `QRV_PLATFORM_API_KEY`, `SESSION_SECRET`, and `ISSUER_ACCESS_CODE` are server-only.

## Build / release gate

```bash
npm ci
npm run check
npm start
```

After deployment:

```bash
QRV_NODE_URL=https://qrv.network npm run smoke
QRV_NODE_URL=https://qrv.network npm run acceptance:live
```

## Required public checks

- `/healthz` returns process health without depending on PostgreSQL.
- `/readyz` confirms the API dependency is ready.
- `/version` returns service and release metadata.
- `/verify` renders the verification entry point.
- `/issuer` renders the issuer authentication entry point.
- `/status` reports dependency-aware service state.

## Architecture rule

`qrv.network` is the consolidated public platform node. `api.qrv.network` remains the canonical API/data authority. PostgreSQL credentials and signing private keys must not be installed on the public node.

Legacy subdomains may redirect to equivalent `qrv.network` paths after DNS is pointed at this application.

## Rollback

If a deployment fails acceptance, redeploy the last known-good Hostinger deployment/commit. Do not modify production database state as part of a public-node rollback.
