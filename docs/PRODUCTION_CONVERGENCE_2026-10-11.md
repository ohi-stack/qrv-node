# QR-V production convergence contract — 2026-10-11

Status: **RELEASE BLOCKED until evidence gates pass**. This is an implementation contract, not proof of deployment.

## Canonical runtime boundaries

- `qrv.network` (`ohi-stack/qrv-node`): public website, public verification presentation, issuer-facing browser workflows, documentation, pricing, onboarding, status, and compatibility redirects.
- `api.qrv.network` (`ohi-stack/qrv-api`): authoritative JSON API, issuer authorization, PostgreSQL registry, issuance, revocation, audit, cryptographic validation, key lifecycle and rate limits.
- QR-V WordPress Issuer plugin: optional issuer administrative UI/bridge; never a writable authoritative registry. Its server-side calls must use scoped credentials and the same API contract.
- PostgreSQL: only canonical record state. No database connection or signing private key in qrv-node, Vite browser bundles, or WordPress browser code.

Legacy verify/issuer/registry/explorer/docs/developers/wallet subdomains are compatibility redirects only. New QR codes must resolve to `https://qrv.network/verify/{qrvid}`. Preserve existing Express-owned API compatibility and health endpoints. Do not break old identifiers.

## Certificate-first P0

1. Authorized issuer signs in using verified identity and issuer-scoped permissions (never client-side-only login).
2. Issue a real certificate with server-side canonicalization, SHA-256, Ed25519 signature and immutable signing-key ID.
3. Transactionally persist record, issuer linkage, signature reference and issuance audit in PostgreSQL.
4. Return a real QRVID and QR code pointing to the public verification URL.
5. Resolve via the authoritative API and display `VERIFIED` only when issuer, hash, signature, lifecycle and revocation checks all pass.
6. Revoke the **same** record with authorization and durable audit event; subsequent scan must show `REVOKED`.
7. Exercise `EXPIRED` and `NOT_FOUND`; unavailable API, invalid signatures, or malformed responses must **never** display VERIFIED. Represent unavailable/invalid states separately rather than mislabeling them NOT_FOUND.
8. Do not expose restricted holder, recipient, or audit data in public responses.

## WordPress Issuer plugin contract

Dashboard, Issue Certificate, Certificates, Revocations, API Settings, Verification Logs, Help/Quickstart. API credentials stored server-side and encrypted or protected by deployment controls; capability checks, nonces, validation, escaping, request timeouts, error handling and audit correlation required. WordPress may cache references only; verification state is always refreshed from the API.

## Release gates (must attach evidence)

- Confirm API routing: `api.qrv.network/healthz` and `/readyz` return expected JSON, **not** HTML/login redirects.
- Inspect latest `QR-V Live Production Acceptance` failure on commit `813d2cb`: jobs, annotations, assertion contract, routing and authentication, issue #49. Correct implementation defects or stale assertions with explicit regression tests.
- Resolve high-severity Firebase/Firestore/`@grpc/grpc-js` dependency audit findings without blind `npm audit fix --force`; verify Google sign-in, secure sessions, CSRF, issuer isolation, public verification and redirects.
- Verify key rotation, retired-key historical verification, revoked/compromised-key handling, backup/restore rehearsal, migration and rollback.
- Run `npm run validate:prod`, `npm run acceptance:live`, dependency audit, CodeQL, and PostgreSQL-backed end-to-end issuance → scan VERIFIED → revoke → scan REVOKED → audit. Record commit SHA, workflow URLs, API response evidence and deployment SHA.
- Require human approval before merge/deployment; do not describe an unproven fixture as a live record.

## Scope control

Ship certificates and the issuer control plane first. Wallet, mobile scanner, federation, blockchain, SDK expansion, white-label and other verticals remain deferred unless separately approved. Existing routes may remain as compatibility surfaces, but do not expand them ahead of lifecycle acceptance.

## Deployment sequence

Back up and restore-test PostgreSQL → correct Hostinger mapping for both canonical hosts → install server-only secrets → migrate API database → deploy/test API → deploy/test qrv-node → validate legacy redirects and public verification → obtain release approval. Do not merge an auto-deploying branch before host/database readiness.
