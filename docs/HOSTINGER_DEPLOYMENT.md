# qrv.network — Hostinger Production Deployment

## Deployment target

- Repository: `ohi-stack/qrv-node`
- Branch: `main`
- Frontend: React + Vite
- Production server: Express / Node.js
- Node: 22.x preferred; 20+ supported
- Root directory: `./`
- Package manager: npm
- Build command: `npm run build`
- Start command: `npm start`
- Entry file: `server.js`
- Static output: `dist/`
- Bind address: `0.0.0.0`
- Port: `process.env.PORT`

## Required environment

```env
NODE_ENV=production
PORT=3000
APP_VERSION=2.0.0
QRV_PLATFORM_ORIGIN=https://qrv.network
QRV_API_BASE_URL=https://api.qrv.network/api/v1
QRV_PLATFORM_API_KEY=<server-side-secret>
SESSION_SECRET=<minimum-32-byte-random-secret>
ISSUER_ACCESS_CODE=<temporary-issuer-bootstrap-code>
SESSION_TTL_MS=43200000

VITE_APP_BASE_URL=https://qrv.network
VITE_QRV_VERIFY_BASE_URL=https://qrv.network/verify
VITE_QRV_ISSUER_BASE_URL=https://qrv.network/issuer
VITE_QRV_REGISTRY_BASE_URL=https://qrv.network/registry
VITE_QRV_DOCS_BASE_URL=https://qrv.network/docs
VITE_QRV_DEVELOPERS_BASE_URL=https://qrv.network/developers
VITE_QRV_STATUS_BASE_URL=https://qrv.network/status
VITE_QRV_API_BASE_URL=https://api.qrv.network/api/v1
VITE_QRV_DEMO_QRVID=QRV-PROD-CERT-000001
```

Only browser-safe values may use `VITE_*`. Never expose the API write key, session secret, issuer access code, database credentials, Supabase server secrets, webhook secrets, or private signing keys through Vite variables.

## Build / release gate

```bash
npm install
npm run check
npm run build
npm start
```

`npm run check` already performs a Vite production build, but Hostinger should still use `npm run build` as the explicit deployment build command.

After deployment:

```bash
QRV_NODE_URL=https://qrv.network npm run smoke
QRV_NODE_URL=https://qrv.network npm run acceptance:live
```

## Required public checks

- `/` serves the Vite application shell.
- `/healthz` returns process health without depending on PostgreSQL.
- `/readyz` confirms the canonical API dependency is ready and reports whether the UI bundle exists.
- `/version` returns service, release, and `react-vite` UI metadata.
- `/verify` renders the React verification experience.
- `/issuer` renders the React issuer authentication experience.
- `/registry` renders the React registry lookup experience.
- `/status` renders dependency-aware status.
- `/platform/*` remains same-origin server adapter traffic and must never expose server secrets.

## Architecture rule

`qrv.network` is the consolidated React/Vite public platform. `api.qrv.network` remains the canonical API/data/cryptographic authority. The Express process on `qrv.network` is a thin production boundary, not the registry authority.

Legacy subdomains may redirect to equivalent `qrv.network` paths after DNS is pointed at this application.

## Rollback

If a deployment fails acceptance, redeploy the last known-good Hostinger deployment/commit. Public-node rollback must not modify canonical registry data.
