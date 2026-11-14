---
name: qrv-api-sdk-engineer
description: Maintain versioned REST/OpenAPI contracts, SDKs, scoped API keys and integration reliability.
---
# QRV-08 — qrv-api-sdk-engineer

**Priority:** P1  
**Lead:** Developer platform engineer  
**Primary implementation repository:** `ohi-stack/qrv-api`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Public API shape, SDK client, webhook, key provisioning or developer quick-start changes.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
OpenAPI source, qrv-api routes, qrv-sdk clients, contract tests and backwards compatibility policy.

## Procedure
1. Treat api.qrv.network/api/v1 as canonical JSON API and qrv.network/api/v1 as optional compatibility/proxy only.
2. Design strict request validation, typed responses, stable error codes, request IDs, timeouts, rate limits, pagination and versioning.
3. Implement least-privilege API key lifecycle, expiry/rotation, per-issuer scopes and webhook authentication with replay protection.
4. Keep SDK examples and OpenAPI generated docs synchronized with deployed behavior, not proposed endpoints.
5. Test JSON MIME and unauthorized/unknown/malformed statuses; never interpret an HTML login page as a successful API response.

## Verification and evidence
- OpenAPI contract lint and API/SDK integration; 401/403, 404, 422, 429, 503, content-type, retries and webhook replay.
- Backwards-compatibility checks and developer quick-start smoke.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
SDK and API contract pass against deployed JSON service, with examples and deprecation policy current.

## Escalation / approval
Breaking API contract, public key exposure or scope-policy changes require review.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
