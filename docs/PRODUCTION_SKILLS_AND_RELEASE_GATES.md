# QR-V™ Production Engineering Skills and Release Gates

**Record date:** October 11, 2026  
**Status:** Production convergence / acceptance BLOCKED. This document introduces a repeatable operating program, not a claim of a release.  
**Protocol:** QRVP-1 · **Standard:** QVS-1.0

## Architecture / ownership

```text
Human release authority → ACC / Code review → GitHub PR + CI
qrv.network (ohi-stack/qrv-node) → HTTPS
api.qrv.network (ohi-stack/qrv-api) → canonical PostgreSQL
```

The browser platform owns public, issuer, holder Wallet, documentation, status and pricing experiences. The API owns authoritative record data, signing, issuer authorization, revocation, verification and audit. `qrv-node` must not become a writable registry. Other QR-V repositories are source modules, SDK or history—not competing production origin hosts. The legacy subdomains may redirect with 308 only after canonical acceptance, preserving deep links.

## Skills program

See [12-skill ACC/Codex manifest](../skills/qrv/manifest.json) and [skills index](../skills/qrv/README.md). Every skill must produce: status; owner; repository; branch/PR; dependency; evidence; blocker; next action. No feature-writing agent can also self-approve its merge, production deployment and acceptance.

## Sequence: gate is closed until evidence exists

| Gate | Owner | Evidence required |
|---|---|---|
| G0 — CI and dependency integrity | QRV-01, QRV-05, QRV-09 | Exact-head `npm run validate:prod`, install/lockfile discipline, `npm audit --omit=dev --audit-level=high` PASS, no CI bypass; resolve #49 |
| G1 — Topology & secrets | QRV-01, QRV-02, QRV-10 | `api.qrv.network/healthz`, `/readyz`, `/version` return API-owned JSON; qrv.network surfaces work; no platform DB/signing keys; Hostinger app mapping and SHA recorded |
| G2 — Backend data & signing | QRV-03, QRV-04, QRV-05 | Canonical PostgreSQL, backup + restore rehearsal, migration, Ed25519 `kid` and historical/compromise behavior demonstrated |
| G3 — Issuer workflow | QRV-06 | Real authorized issuer session, issue persisted certificate, stable QRVID and QR image generated, independent public verification URL |
| G4 — Lifecycle | QRV-03, QRV-04, QRV-09 | Same real PostgreSQL QRVID: VERIFIED → authorized REVOKE → REVOKED; issuance/verification/revocation audit events recorded |
| G5 — Negative/security states | QRV-05, QRV-09 | EXPIRED, NOT_FOUND, invalid signature/tamper, API outage UNAVAILABLE, privacy redaction, unauthorized access, session/CSRF, rate limiting, restart persistence |
| G6 — Consolidated customer experience | QRV-02, QRV-06, QRV-07 | Verify, Issuer and Wallet paths; stale wallet VERIFIED switches to REVOKED; compatibility routes and deep links checked |
| G7 — Human release | QRV-10, QRV-12 | QA PASS, release/evidence URLs, release owner approval, deployed SHA and rollback plan; then commercial onboarding may activate |

Never mark a GATE PASS solely from an earlier source commit, screenshot, homepage badge, successful build, mock fixture or a non-authoritative verification string.

## Known live blockers, October 11

Current `main` SHA: `813d2cb87f9d3fbf65bcac0b622814d8ce8ad45f`. Latest scheduled `QR-V Live Production Acceptance` run: [38116011165](https://github.com/ohi-stack/qrv-node/actions/runs/38116011165).

- Platform `/readyz` = HTTP 503: expected fail-closed state when backend is not ready; do **not** replace with hard-coded 200.
- API `/healthz`, `/readyz`, `/version` = HTTP 200 with **text/html**, not required API JSON: investigate Hostinger mapping/proxy or wrong running app first.
- API `/api/v1/status` and verification routes = HTML 404: separate host mapping/route implementation/contract errors through API route evidence.
- Legacy verification-host redirect could not be fetched: check DNS and compatibility deployment, not just the redirect implementation.
- `platform-verify-demo` passing with API checks failing is **insufficient** evidence of authoritative VERIFIED. Cross-check the rendered page's provenance and the API JSON response.
- [Issue #49](https://github.com/ohi-stack/qrv-node/issues/49) is an unresolved Firebase/Firestore transitive dependency audit blocker.
- Existing open PRs #3, #40, #42, #43, #46, #47 and #48 overlap platform/content and runtime contracts. Reconcile instead of blindly merging one on top of another.

See [live failure correction matrix](./PRODUCTION_ACCEPTANCE_FAILURE_2026-10-11.md).

## Commands (check exact branch/head)

```bash
npm install --no-audit --no-fund
npm run check:skills
npm run validate:prod
npm audit --omit=dev --audit-level=high
npm run acceptance:live
```

The live command probes real network hosts, and may fail until Hostinger/API remediation. Do not weaken live checks to green the workflow. A reproducible `package-lock.json` and `npm ci` migration requires compatible dependency resolution and separate regression verification; current `bun.lock` alone is not an npm lockfile.

## Required release evidence bundle

Record release ID, date (UTC), exact GitHub SHA(s), PR and approval, API and platform running SHAs, canonical database reference (no secrets), change plan, backup and successful restore rehearsal, vulnerability scan, issuer test identity (redacted), QRVID, observed VERIFIED/REVOKED transitions, audit event IDs, negative-state checks, live workflow run, rollback plan and operator approval.

Production deployment, secret/key rotation, DNS changes and live payment/record mutations are human-approved operations, not automatic consequences of a passing skills check.
