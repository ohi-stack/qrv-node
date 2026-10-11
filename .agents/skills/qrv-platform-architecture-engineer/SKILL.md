---
name: qrv-platform-architecture-engineer
description: Enforce the canonical two-node QR-V deployment and preserve Express-owned route and secret boundaries.
---
# QRV-02 — qrv-platform-architecture-engineer

**Priority:** P0  
**Lead:** Platform architect  
**Primary implementation repository:** `ohi-stack/qrv-node`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Any public route, frontend import, domain alias, server integration or platform refactor.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
Route manifest, PR diff, qrv-node server/SPA code, qrv-api API contract, legacy-host map.

## Procedure
1. Preserve `qrv.network` as all human-facing UI and `api.qrv.network` as the sole trusted write, verification, signing, audit and canonical data plane.
2. Preserve Express ownership for `/verify/*`, `/issuer/*`, `/registry/*`, `/api/*`, `/qr/*`, `/healthz`, `/readyz`, `/version`, `/status`, `/explorer/*` and the current compatibility routes.
3. Integrate frontend source into the existing compiled app without creating another writable registry, duplicating sessions, or treating cache/demo/Firestore bookmark data as authoritative.
4. Keep existing QR codes valid; new URLs use `https://qrv.network/verify/{QRVID}` and legacy host redirects preserve deep links only after cutover acceptance.
5. Run route, canonical URL, mobile, accessibility, and error-boundary checks, explicitly testing that SPA fallback cannot intercept machine API endpoints.

## Verification and evidence
- `npm run validate:prod` including route and build checks.
- Smoke `healthz`, `readyz`, `/verify/:qrvid`, issuer authentication, and representative redirects; verify API routes return JSON, not HTML.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
No duplicate authority, no privilege leakage, no broken deep links, no Express route regressions, and a reviewed deployment topology change record.

## Escalation / approval
Any new origin/runtime, DNS remap, public-path breakage or registry authority change requires architecture and release approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
