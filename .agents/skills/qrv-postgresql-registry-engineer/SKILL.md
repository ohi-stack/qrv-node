---
name: qrv-postgresql-registry-engineer
description: Implement and prove durable single-source PostgreSQL registry persistence, migrations, issuer isolation and audit.
---
# QRV-03 — qrv-postgresql-registry-engineer

**Priority:** P0  
**Lead:** API / data engineering  
**Primary implementation repository:** `ohi-stack/qrv-api`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Changes to canonical record storage, migrations, lifecycle transactions or registry read/write semantics.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
qrv-api schema/migrations, Postgres connection policy, backup status, issuer IDs and API contract.

## Procedure
1. Work in `ohi-stack/qrv-api`, not inside qrv-node; trace every write and read to the configured canonical PostgreSQL instance.
2. Design versioned, reversible-or-restorable migrations with backups and a completed restore rehearsal before production cutover.
3. Guarantee atomic issuance, revocation and audit events; enforce uniqueness of QRVID, issuer-scoped authorization, timestamps and lifecycle invariants.
4. Ensure public lookup returns privacy-filtered responses while restricted details require the correct issuer/holder scope.
5. Demonstrate persistence across process restart and redeploy, concurrent issuance behavior, and fail-closed database outage semantics.
6. Remove development `const records = {}` or other mock/in-memory authority from the production write/read path; do not migrate to an unapproved second datastore.

## Verification and evidence
- PostgreSQL-backed issue → query → VERIFIED → revoke same QRVID → REVOKED → audit test using a disposable fixture.
- Backup/restore rehearsal, migration rollback strategy, permission and cross-tenant tests.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
Canonical data authority, transaction integrity, audit continuity and durable restart/redeployment are supported by captured DB-level test evidence.

## Escalation / approval
Production migrations, backups, credential grants, or any destructive query require data owner approval.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
