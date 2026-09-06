# QR-V™ Production Platform Upgrade — 2026-09-06

## Objective

Harden `qrv.network` as the single canonical human-facing production origin while preserving `api.qrv.network` as the only trusted API/data boundary.

## Production contract

```text
qrv.network -> ohi-stack/qrv-node
api.qrv.network -> ohi-stack/qrv-api
```

Legacy QR-V service hostnames are compatibility redirects only. `qrv-marketing-site` and service-specific repositories must not compete for the root domain.

## New release gate

Run before production deployment:

```bash
npm run check
npm run check:prod-config
npm run acceptance:live
```

Or:

```bash
npm run validate:prod
```

The configuration gate rejects database credentials and backend signing/webhook secrets on the platform node, enforces the canonical platform/API origins, and validates minimum secret lengths when server-side platform credentials are present.

The live acceptance suite probes desktop and iPhone user agents independently and fails when the stale pre-consolidation homepage is returned. This is a required check for the previously observed cross-device delivery inconsistency.

## Deployment acceptance

Production deployment is not accepted until all of the following are true:

- `qrv.network` desktop and mobile probes return the same canonical application generation;
- `/healthz`, `/readyz`, and `/version` return JSON;
- `api.qrv.network/healthz`, `/readyz`, and `/version` return JSON directly;
- the demo QRVID verifies through both the API and public platform;
- issuer writes remain fail-closed if server credentials are absent;
- no database, Supabase secret, Ed25519 private key, or webhook secret exists on `qrv-node`;
- old public origins do not serve a competing QR-V homepage.

## Remaining infrastructure work

Repository changes cannot by themselves remove a stale DNS/CDN/application binding. Hostinger/DNS must map `qrv.network` to one production `qrv-node` deployment, and any prior root-domain deployment must be detached or converted to a compatibility redirect. Purge edge caches after cutover and run `npm run acceptance:live` from an external network.

## Rollback

Retain the previous known-good `qrv-node` release SHA. If the new deployment fails health, readiness, verification, issuer, or cross-device acceptance, restore the previous application release without changing the canonical database authority, then investigate before retrying.
