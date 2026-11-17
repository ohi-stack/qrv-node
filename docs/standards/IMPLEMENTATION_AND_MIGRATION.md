# QRVP-1.1 / QVS-1.1 — Implementation, Migration, Release Gates
**Engineering change-control annex — October 11, 2026**

## 1. What this change does — and does not do

This annex implements **documentation/version governance**, not runtime cryptographic activation. The March 2026 QRVP-1 and QVS-1.0 remain historical baselines; \`QRVP-1.1.md\` and \`QVS-1.1.md\` are proposed successor specifications.

Current canonical deployment owner map:
- \`ohi-stack/qrv-node\` → https://qrv.network — public, human-facing platform/issuer UI.
- \`ohi-stack/qrv-api\` → https://api.qrv.network/api/v1 — authoritative API, record changes, cryptographic verification, audit, persistence.
- One PostgreSQL authority selected per environment; do not create parallel writable Cloud SQL/Supabase registries.
- Printed QR links → \`https://qrv.network/verify/{QRVID}\`.

Source documents include original March QRVP-1 Developer Specification, QVS-1.0, Root Domain Architecture and Infrastructure Deployment Record, and the later two-node architecture. The original documents should remain discoverable in an **archive/original** section with establishment dates and original attribution.

## 2. Implementation gaps confirmed from the repository snapshot

The following are **repository observations as of this review**, not assertions about the unseen deployment:

| Control | Existing repository behavior | Required implementation change |
|---|---|---|
| Canonical signing bytes | \`qrv-api/server.js\` uses recursive sorted-key \`stableStringify\` | Implement/test full RFC 8785 JCS with independent cross-language fixtures; version canonicalization |
| SHA-256 | Records store hash generated at creation | Verify digest against immutable canonical issuance/payload data during lookup; distinguish stored hash existence from actual integrity check |
| Ed25519 | \`/version\` says \`ed25519: not-enabled\`; \`publicRecord()\` returns \`signatureValid: null\` | Protected issuer signing keys, immutable envelope, detached signature, key ID, verification, rotation, compromise handling |
| Issuer authorization | API protected mutation authenticates a shared write key and accepts caller-supplied \`issuer\` string | Server-authenticated per-issuer identity, explicit scopes, role-based access and tenant/object-level policy; reject spoofed issuer |
| Verification response | \`/api/v1/verify/:qrvid\` currently maps active registry statuses to \`VERIFIED\` even without signature proof | Maintain v1 compatibility with explicit REGISTRY_ONLY assurance; propose strict /api/v2 contract with distinct REGISTRY_VALID and SIGNED VERIFIED |
| Revocation | Protected \`POST /api/v1/records/:qrvid/revoke\` updates database | Bind record to issuer principal, idempotency/actor metadata, authoritative freshness and atomic audit |
| Audit writes | \`audit()\` catches failures and only logs error | Privileged write transactions must fail closed or use durable transactional outbox |
| Privacy | \`publicRecord()\` exposes \`owner\` and \`recipient\` | Per-record privacy mode and default minimal public disclosure; redact personal subjects |
| Key and issuer state | No effective issuer-key registry/trust-policy flow shown in current server source | Migration for issuer IDs, key lifecycle and authority status; test cross-tenant authorization |
| Expiry | API computes expiry from date end-of-day UTC | Specify consistently UTC timestamps/precision and documented date-only semantics |
| 404 / outage | Some status checks exist; API has 404/422 shape | Verify failure taxonomy end to end at both nodes; never turn API 503 into NOT_FOUND |
| Two-node origin | Node and API documents prescribe split | Validate real deployed hostname/proxy; previous acceptance shows routing mismatch risk |
| Security/dependencies | \`ohi-stack/qrv-node\` issue #49 reports high-severity Firebase/Firestore audit findings | Remediate and pass audit without unsafe forced major downgrade |
| Live acceptance | Oct 10 notification referenced failed acceptance workflow on commit \`813d2cb\` | Obtain **current** logs, fix actual first failing assertion/route/auth behavior and rerun complete gates |

Do not infer that all original March deployment statements (e.g. publicly accessible Cloud SQL and \`0.0.0.0/0\` network access) remain in effect now. Confirm actual production networking; an unrestricted database ingress rule must not be retained for a production registry.

## 3. Non-breaking migration path

**Phase A — publish drafts only:** Land docs with "PROPOSED" labels; do not change website claims to "QVS-1.1 compliant". Keep existing QRVID and /api/v1 behavior.

**Phase B — harden the canonical API:** Add migrations for issuer authority, keys, immutable issuance envelope, signature proof and versioned lifecycle audit. Define serialization test vectors before signing. Complete per-issuer/record auth and audit durability.

**Phase C — dual-read / deliberate API versioning:** Leave existing /api/v1 clients working. Add optional \`assuranceLevel\` and explicit \`signatureState\` on v1 with documented additive behavior. Design strict \`/api/v2/verify/:qrvid\` for new semantics after explicit sign-off and client acceptance.

**Phase D — pilot conformance:** Provision an approved **external** issuer, issue signed record, verify from an independent client, revoke it, and confirm the same QR URL becomes REVOKED. Test expiry, issuer suspension, tampering, key rotation and outages.

**Phase E — promote only after evidence:** Security sign-off, CI and dependency audit pass, production routing/auth and mutation tests pass, rollback is proven, new docs and status page accurately reflect deployed SHA/Ed25519 behavior. Then and only then update website standard badges/copy to the supported conformance level.

## 4. Two-node acceptance sequence (do not conflate docs with deploy)

1. **Reconcile live branch/SHA:** Compare \`qrv-node/main\`, \`qrv-api/main\`, hosting build SHA and exact live /version responses.
2. **Dependency gate:** Reproduce \`npm audit --json\` and \`npm audit --audit-level=high\` using lockfile/approved install path; resolve issue #49 with compatible patched dependency graph. Preserve Google login and issuer sessions.
3. **Routing/auth:** Browser HTML at qrv.network; JSON at api.qrv.network health/status/verify; no SPA shadowing of /api/*, /verify/*, /issuer/*, /readyz; correct 308 aliases; authenticated session and protected writes.
4. **Registry/migration:** One write authority, unique QRVID, issuer isolation, key registry, lifecycle transitions, tested backup/restore.
5. **Crypto:** RFC 8785 fixtures; Ed25519 valid/invalid signature; issuer/key mismatch; rotated/compromised key; tampered canonical record.
6. **Lifecycle:** Authorized ISSUE → VERIFIED (L2) → REVOKE → REVOKED at **same URL**; expiration and issuer suspension; no stale cache.
7. **Negative conditions:** malformed, missing, unauthorized, cross-tenant, stale, rate-limited and backend down (never a false VERIFIED).
8. **User experience:** verified state and assurance clearly displayed, public redaction, Google sign-in/session/CORS regression.
9. **Observability:** audit persistence and actor traceability; request IDs, health, readiness, server errors, synthetic external probe.
10. **Human approval:** archive evidence, update version matrix, record actual deployment SHA, sign off the standard claim.

Current blocked tests/issue #49 cannot be dismissed because documentation improves; do not waive acceptance or deploy draft new semantics to main ahead of remediation.

## 5. Evidence manifest to archive per release

Store a non-secret record for each release:

\`\`\`json
{
  "specification": "QRVP-1.1",
  "standard": "QVS-1.1",
  "releaseStatus": "PROPOSED",
  "productionConformance": "NOT_ESTABLISHED",
  "qrvNodeSha": "<actual commit>",
  "qrvApiSha": "<actual commit>",
  "deployedAt": "<actual ISO 8601 UTC>",
  "canonicalApiOrigin": "https://api.qrv.network",
  "databaseAuthority": "<provider/environment; no secrets>",
  "jcsTestResult": "PENDING",
  "ed25519TestResult": "PENDING",
  "issuerIsolationTestResult": "PENDING",
  "issueRevokeTestResult": "PENDING",
  "dependencyAuditResult": "PENDING",
  "liveAcceptanceResult": "PENDING",
  "approvedBy": "<human release approver>"
}
\`\`\`

The bracketed fields are templates, **not** evidence. Do not use placeholders to generate a VERIFIED or compliant claim.

## 6. Release acceptance and business constraint

The first use case remains **QR-V Verified Certificates**. New standard changes are valuable only insofar as they reliably enable paying organizations to issue, verify and revoke certificates and demonstrate issuer accountability. Defer blockchain, multiple standalone public subdomains, wallet, federation and mobile scanner until there is a customer-backed reason.

The commercially relevant metric is **third-party paying issuers with signed, verifiable, lifecycle-managed production records**, not the length of the specification or number of badges.

## 7. Adoption notice for public docs

> QRVP-1.1 and QVS-1.1 are proposed technical revisions of the QR-V protocol and verification standard. The historical QRVP-1 and QVS-1.0 records remain preserved. QRV.Network will declare conformance to the new signed-issuer profile only when cryptographic signing, issuer authorization, privacy controls, revocation, conformance tests and live release acceptance have passed. QR-V is a privately operated verification service of ONEGODIAN, LLC; a positive verification reflects a recorded issuer assertion, not independent legal adjudication.

## 8. Documents

- [QRVP-1.1](./QRVP-1.1.md) — proposed protocol specification.
- [QVS-1.1](./QVS-1.1.md) — proposed verification standard.
- [Original qrv-node contract](../../README.md) — existing two-node topology.
- [Production acceptance record](../PRODUCTION_ACCEPTANCE_2026-09-05.md) — prior known acceptance blockers.
- [Canonical delivery](../CANONICAL_DELIVERY.md) — canonical origin and hosting contract.
- [GitHub issue #49](https://github.com/ohi-stack/qrv-node/issues/49) — unresolved high-severity dependency audit gate.