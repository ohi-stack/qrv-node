# QRV Network Root Node — Production Command

Date: 2026-06-06
Repository: `ohi-stack/qrv-node`
Production domain: `https://qrv.network`

## Production Objective

Set the QRV Network root node as the consolidated public entry point for QR-V™, while preserving service separation for registry, issuer, verification, API, wallet, docs, and status operations.

## Current Verified Repository Facts

- Package name: `qrv-node`
- Current version: `0.2.0`
- Runtime: Node.js, ES modules
- Entry point: `server.js`
- Required engine: Node `>=20`
- Current scripts: `start`, `dev`, `check`, `smoke`
- Express is the runtime dependency.

## Production Routing Standard

The root node should expose public marketing, navigation, consolidation, and routing pages at `qrv.network`.

Required public routes:

- `/`
- `/about`
- `/how-it-works`
- `/protocol`
- `/use-cases`
- `/pricing`
- `/issuer`
- `/demo`
- `/developers`
- `/docs`
- `/docs/overview`
- `/docs/protocol`
- `/docs/verification`
- `/docs/registry`
- `/docs/issuers`
- `/docs/developers`
- `/docs/api-reference`
- `/registry`
- `/security`
- `/wallet`
- `/status`
- `/contact`
- `/terms`
- `/privacy`
- `/verification-disclaimer`

Required operational endpoints:

- `/health`
- `/healthz`
- `/readyz`
- `/version`
- `/manifest.json`
- `/sitemap.xml`
- `/robots.txt`

## Service Mapping

Keep these as separate production services unless intentionally consolidated later:

- `https://registry.qrv.network` — canonical registry and record storage
- `https://verify.qrv.network` — public verification portal
- `https://issuer.qrv.network` — issuer onboarding and credential issuance workflows
- `https://api.qrv.network` — public/API gateway
- `https://wallet.qrv.network` or `/wallet` — wallet interface depending on deployment readiness
- `https://docs.qrv.network` or `/docs` — documentation surface; canonical public docs should also resolve under `/docs`

## Production Environment Variables

Create or confirm these in Hostinger / deployment environment:

```env
NODE_ENV=production
PORT=3000
SERVICE_NAME=qrv-node
SERVICE_VERSION=0.2.0
PUBLIC_BASE_URL=https://qrv.network
VERIFY_BASE_URL=https://verify.qrv.network
REGISTRY_BASE_URL=https://registry.qrv.network
ISSUER_BASE_URL=https://issuer.qrv.network
API_BASE_URL=https://api.qrv.network
DOCS_BASE_URL=https://qrv.network/docs
WALLET_BASE_URL=https://qrv.network/wallet
STATUS_BASE_URL=https://qrv.network/status
LOG_LEVEL=info
```

## Required Production Files

Confirm these files exist and are current:

- `package.json`
- `server.js`
- `.env.example`
- `README.md`
- `DEPLOYMENT.md`
- `PRODUCTION_COMMAND.md`

## Deployment Checklist

1. Run `npm install`.
2. Run `npm run check`.
3. Run `npm start` locally with production-like environment variables.
4. Run smoke checks against:
   - `/healthz`
   - `/readyz`
   - `/version`
   - `/manifest.json`
5. Deploy to Hostinger Node environment.
6. Confirm HTTPS domain binding for `qrv.network`.
7. Confirm reverse proxy points to the correct `PORT`.
8. Confirm all service links resolve correctly.
9. Confirm QR-V verification disclaimer is publicly accessible.
10. Record deployment date, commit SHA, and active environment in `DEPLOYMENT.md`.

## Definition of Done

This repository is production-ready when:

- The root domain loads without build/runtime errors.
- Health, readiness, and version endpoints respond successfully.
- All public pages render QR-V production content.
- `/docs` resolves without needing a separate docs subdomain.
- `/wallet` exists as either a live wallet surface or a clearly marked coming-soon route connected to the wallet repository.
- Registry, issuer, verification, and API service links route to the correct subdomains.
- Sitemap, robots, and manifest metadata exist.
- Deployment notes identify the active production commit.
