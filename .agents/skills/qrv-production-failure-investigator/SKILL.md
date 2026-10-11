---
name: qrv-production-failure-investigator
description: Investigate live production acceptance, routing, authentication and CI failure evidence without masking failing assertions.
---
# QRV-01 — qrv-production-failure-investigator

**Priority:** P0  
**Lead:** SRE / ACC triage  
**Primary implementation repository:** `ohi-stack/qrv-node`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
A GitHub Actions failure, live acceptance regression, 503, wrong MIME type, login redirect, proxy/domain issue, or reported customer outage.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
Repository, exact commit SHA, workflow run/job IDs, environment URL, assertion name, related issues/PRs.

## Procedure
1. Capture the failing workflow run's exact head SHA, first failed step, annotations, output, and response details; never infer production state from another branch's tests.
2. Reproduce HEAD assertions against the actual canonical hosts, recording HTTP method, path, status, content-type, final URL, and request ID where available; redact cookies, tokens and PII.
3. Compare `scripts/live-acceptance.mjs`, `server.js`, `src/services/qrvApiService.js`, `qrv-api` route/OpenAPI contracts, Hostinger app/domain/proxy ownership, and auth/session behavior.
4. Classify every failure as deployed routing/proxy, auth/session, missing implementation, registry/readiness, dependency/security, or stale assertion; distinguish site HTML returned from the API's required JSON.
5. Propose the minimum independent repo patch versus host-level correction. Never change an expected HTTP status or loosen an assertion merely to get a green run.
6. Produce a reproducible before/after matrix; check that `/readyz` continues to fail closed when API readiness cannot be established.

## Verification and evidence
- `npm run validate:prod` and `npm run acceptance:live` at the exact target SHA after appropriate API deployment.
- Correlate every failed live check to a route contract and capture a new production workflow URL.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
Every identified failure has a root cause, correction owner, regression evidence and explicit disposition; no live PASS claim unless acceptance is green against the intended deployment.

## Escalation / approval
Hostinger DNS/app mapping, production credentials, API cutover or approval-gated changes require human operations approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
