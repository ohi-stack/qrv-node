# QR-V™ Production Command — Canonical Runtime

**Updated:** October 11, 2026  
**Repository:** `ohi-stack/qrv-node`  
**Scope:** Public application at `qrv.network`; machine/data API at `api.qrv.network`.  
**Status:** Production convergence / blocked pending the [release gates](docs/PRODUCTION_SKILLS_AND_RELEASE_GATES.md).

> This replaces the historical June 6 subdomain-as-separate-app plan and version 0.2.0 snapshot. Do not republish that old topology as current.

## Architecture and responsibility

```text
qrv.network (qrv-node / public React + Express)
  → server-to-server HTTPS
api.qrv.network (qrv-api / JSON, auth, verified registry)
  → canonical PostgreSQL (issuer, record, hash, signature, audit, revocation)
```

`qrv-node` owns `/verify/*`, `/issuer/*`, `/wallet/*`, `/registry/*`, `/explorer/*`, `/docs`, `/developers`, `/pricing`, `/status`, and public information routes. The Express runtime retains control of server-owned paths. Legacy `verify.`, `issuer.`, `registry.`, `wallet.`, `docs.`, `explorer.`, and `developers.` origins are compatibility redirects **after** acceptance. A public QR contains `https://qrv.network/verify/{QRVID}`.

Do **not** put `DATABASE_URL`, signing private keys, master API keys, admin database credentials, Stripe secrets or `SUPABASE_SECRET_KEY` into `qrv-node` or browser-visible `VITE_*` values. `QRV_PLATFORM_API_KEY` is server-side only and is approved solely for appropriate API-to-API access. Explicit user identity, RBAC, CSRF and session checks remain mandatory.

## Production install, validation and launch

```bash
npm install --no-audit --no-fund
npm run check:skills
npm run validate:prod
npm audit --omit=dev --audit-level=high
# human-approved production environment only:
npm run acceptance:live
```

For deployment, bind Hostinger app 1 to `ohi-stack/qrv-node` at `qrv.network`, and app 2 to `ohi-stack/qrv-api` at `api.qrv.network`. Confirm both deployed SHAs, runtime-port handling, Node 20+/22, and correct API JSON health/readiness before executing a database-backed acceptance run. **Do not merge or deploy** if any mandatory check is red.

Current `main` package baseline at this update is `1.3.0-rc.1`. It is not evidence of production acceptance. The October 11 live acceptance run failed and high-severity Firebase chain findings remain tracked in [issue #49](https://github.com/ohi-stack/qrv-node/issues/49). There is currently no npm lockfile: investigate compatible dependency remediation and produce an npm-compatible reproducible lockfile before switching to `npm ci`.

## Product acceptance

An authorized issuer must issue a real certificate, persist it in PostgreSQL, obtain QRVID and a public QR URL, receive VERIFIED through qrv-api, revoke the same record, receive REVOKED on public and API views, and retain audit evidence. Invalid/expired/unknown/signature-failed/private states must be tested. Wallet receives references and re-verifies them; it is not a second registry.

Use [12 engineering skills](skills/qrv/README.md), [gate criteria](docs/PRODUCTION_SKILLS_AND_RELEASE_GATES.md) and the [current failure matrix](docs/PRODUCTION_ACCEPTANCE_FAILURE_2026-10-11.md). Release requires independent QA, backup/restore rehearsal, rollback path and human approval. Every release claim includes exact deployed SHA and evidence URL.
