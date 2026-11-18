---
name: qrv-verification-protocol-engineer
description: Implement QRVP-1 resolution and QVS-1.0 deterministic live verification against the canonical registry.
---
# QRV-04 — qrv-verification-protocol-engineer

**Priority:** P0  
**Lead:** Verification / API engineer  
**Primary implementation repository:** `ohi-stack/qrv-api`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Any change to identifiers, resolution, verification decisions, status mapping or public disclosure.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
QRVP-1, QVS-1.0, current OpenAPI status mapping, QRVID and issuer fixtures, signing-key state.

## Procedure
1. Normalize and validate incoming QRVIDs according to the current ratified contract; reject malformed identifiers without ambiguous success.
2. Resolve exclusively through the canonical registry, validate issuer authority, record integrity, signature/key state and temporal validity before returning a verification result.
3. Return deterministic `VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`, `INVALID_SIGNATURE`/integrity failure, or `UNAVAILABLE`/error outcomes per the published API contract.
4. Do not treat a human-facing page with a VERIFIED string, a QR image, a stale cache entry or a `200` response alone as proof of live verification.
5. Return safe public information per privacy mode; do not leak restricted record fields, system keys or tenant identifiers.
6. Ensure the platform never converts an upstream 4xx/5xx, malformed JSON or unreachable API into a public VERIFIED decision.

## Verification and evidence
- Positive and negative API contract fixtures; tampering, signature failure, expiry, unknown ID, revoked ID, upstream 503 and privacy scenarios.
- Same record from verified to revoked on public and machine-facing responses.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
Every state is deterministically explained, tested, documented and proved against authoritative registry results with matching HTTP status semantics.

## Escalation / approval
Changes to normative QRVP-1 or QVS-1.0 state semantics require protocol governance approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
