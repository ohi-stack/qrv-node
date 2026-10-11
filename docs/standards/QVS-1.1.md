# QVS-1.1 — QR-V™ Global Verification Standard
**Normative conformance standard — Proposed Revision / Implementation Candidate**

| Record field | Value |
|---|---|
| Standard family | QR-V™ Global Verification Standard |
| Proposed revision | **QVS-1.1** |
| Companion protocol | QRVP-1.1 |
| Original establishment record | March 5, 2026 (QVS-1.0) |
| Revision date | October 11, 2026 |
| Originator | One Gregory Onegodian™ (Gregory “One” Jones) |
| Publisher/operator | ONEGODIAN, LLC |
| Status | **PROPOSED — internal technical standard, not independently accredited** |

## 1. Purpose and defined verification claim

QVS-1.1 establishes reproducible requirements for operating and evaluating QR-V registry-backed verification. It **does not** turn a record into a legal identity, public license, deed, regulatory certificate, financial instrument, conclusive evidence of ownership or government-recognized credential merely because a scan returns a positive result.

The precise positive statement is: *An authorized issuer's specified signed assertion is bound to the identified registry record, the cryptographic evidence validates, the issuer remains eligible under the applicable network trust policy, and the record is not known to be revoked or expired at the verification timestamp.*

A physical QR symbol remains copyable and replaceable. Issuer authorization, canonical data, issuer signature and live lifecycle assessment are distinct controls.

## 2. Conformance levels

| Level | Name | Required behavior | Public claim |
|---|---|---|---|
| L0 | Locator only | QR directs to URL; no authoritative verification | "QR-linked" only |
| L1 | Registry integrity | Canonical registry reference, controlled state, SHA-256 digest, audit disclosure; no operational issuer signature | "Registry-backed verification; signature pending" |
| L2 | Signed issuer | All L1 controls plus RFC 8785 canonical envelope, Ed25519, key/issuer association, expiry/revocation, fail-closed behavior | "QVS-1.1 Signed Issuer Verification" **only after acceptance** |
| L3 | Interoperability extension | L2 plus separately tested federated trust and/or W3C VC-compatible export | Name the **specific** certified/tested extension; do not imply general W3C endorsement |

L0/L1 are **migration/legacy profiles**, not evidence of full QVS-1.1 conformance. L2 is the required **core conformance profile**. L3 is optional and requires independent evidence; no deployment is assumed to have it.

A production system MUST publish its actual conformance level and signing readiness. SHA-256 storage or hash presence alone does not satisfy L2 and does not validate real-world facts in a credential.

## 3. Independent trust dimensions

A response MUST separate these dimensions rather than treating one Boolean as sufficient:

1. **Identifier validity:** parsed canonical QRVID, namespace and issuer scope.
2. **Record existence:** exact lookup of single canonical registry object.
3. **Content integrity:** recomputation of digest over canonical record/claim content actually provided or committed, with mismatch detection; "hash present" alone is insufficient.
4. **Issuer identity and authority:** stable issuer ID, identity evidence, approved scope and suspension state; self-claimed issuer display name is insufficient.
5. **Signature authenticity:** Ed25519 proof over RFC 8785 canonical immutable envelope with valid associated public key and key lifecycle.
6. **Lifecycle freshness:** current revocation, suspension and expiration state, distinct from issued data.
7. **Privacy authorization:** public/restricted/private disclosure decision, including right to access records and audit.
8. **Operational availability:** distinguish authoritative negative result from verification inability.

A verifier MUST NOT return the L2 assurance level if any mandatory dimension fails or is unknown.

## 4. Normative status outcomes

Strict-profile outcomes:

| \`verificationState\` | Meaning | Positive assurance? |
|---|---|---|
| \`VERIFIED\` | Valid identifier; authorized issuer and key; accurate canonical digest; Ed25519 valid; not revoked/expired | **Yes — L2 only** |
| \`REGISTRY_VALID\` | Registry record/current state checks pass but issuer signature is absent or pending | No signed-issuer assurance |
| \`REVOKED\` | Current lifecycle authority records revocation | No |
| \`EXPIRED\` | Active record has reached its documented expiration | No |
| \`NOT_FOUND\` | Valid identifier absent from reachable authoritative registry | No |
| \`INVALID_QRVID\` | Syntax or namespace invalid | No |
| \`INVALID_SIGNATURE\` | Required signature failed verification, missing key association or invalid proof under signed profile | No |
| \`INTEGRITY_FAILED\` | Canonical digest mismatch / material data alteration | No |
| \`ISSUER_SUSPENDED\` | Issuer's record-issuance/verification authority suspended by policy | No |
| \`UNAVAILABLE\` | Registry/key/status dependency failed or could not supply authoritative fresh answer | No |

Additional internal states MAY exist but MUST NOT be silently mapped to positive public assurance. A blocked authorization MUST use authorization errors on protected API operations. An unknown database result during an outage MUST NOT become NOT_FOUND.

**Evaluation precedence:** invalid syntax → unavailable registry → not found → mandatory content/proof integrity failure → issuer/key disqualification → revoked → expired → eligible signed VERIFIED or unsigned REGISTRY_VALID. When issuer suspended and record revoked are both true, both facts MAY be shown in a restricted detailed response; public signed assurance remains negative. Revocation status MUST be returned when independently authoritative and safe to disclose, even if another defect exists, while preventing a forged record from appearing authentic.

## 5. Standard proof and integrity rules

L2 MUST use:

- SHA-256 for the canonical record/claim digest;
- RFC 8785 JCS for invariant serialization of the **immutable** attestation;
- Ed25519 / RFC 8032 detached issuer signature;
- \`keyId\`, algorithm and signature encoded in a versioned proof object;
- distinct \`payloadDigest\` and \`recordDigest\` fields with documented covered bytes;
- explicit domain separation \`QRV-QVS-1.1\` + NUL for signature input;
- UTC-issued and observed timestamps; and
- immutable evidence retention sufficient to verify historical signatures after key rotation.

A record MUST NOT be considered cryptographically issuer-verified from a signed *registry lookup response* if the issuer's underlying issuance statement was never signed. The signing service MUST NOT rely on a single mutable name string to establish issuer authority.

The operator MUST publish passing positive and negative test vectors for JCS/Ed25519 and demonstrate independent revalidation from a separate verifier implementation before representing L2 as operational.

## 6. Required issuer control standard

A conformant issuer program MUST maintain:

- an immutable issuer identifier and controlled display name;
- a documented registration and authority-approval record;
- explicit eligible record types and issuance scopes;
- per-issuer authorization for create, list, detail, revoke and key operations;
- tenant separation across all database queries and access paths;
- record-level and field-level authorization checks (including API, export and audit);
- separation between platform-server credentials and issuer identity;
- revocation/suspension procedures and attributable actor logs;
- secure key lifecycle (creation, activation, rotation, compromise, retirement);
- fair, transparent public wording indicating that acceptance into the QR-V registry does not confer external statutory or licensing authority.

Issuer approval by QR-V is **network participation approval**, not government credential accreditation or a legal conclusion about status.

## 7. QR code and scanner requirements

QR images MUST encode the canonical HTTPS verification URL; the path identifies a registry record, but **never** supplies the truth state. UI verification MUST show a trustworthy hostname, observed time, state and an accessible textual explanation. It MUST present REGISTRY_VALID distinctly from SIGNED VERIFIED. Avoid unexplained green checkmarks when the result has not passed the applicable cryptographic profile. Support keyboard/screen-reader reading and mobile deep-link fallback.

Static QR cloning is not prevented by cryptographic signatures. For physical authentication and tickets, report the specific limitations and implement separate item-bound physical security, dynamic challenge or single-use consumption if the product promises clone resistance.

## 8. Lifecycle and freshness

Revocation MUST be a distinct authenticated, issuer-scoped transition with timestamp, reason classification, actor reference, lifecycle sequence and audit proof. The original immutable issuance envelope MUST remain available while its live state changes. Revoked identifiers MUST NOT be reassigned to new subjects.

Public, live verification status MUST be fetched fresh and supplied with \`Cache-Control: no-store\` by default. Do not present offline or previously cached verification results as current. If authoritative revocation cannot be checked due to outage, return UNAVAILABLE (or clearly labeled stale/offline status where the caller explicitly requests offline mode), never VERIFIED.

UTC is the legally and interoperably controlling system timestamp; the original QVS-1.0 supplementary OneGodian Time™ provenance reference MAY be kept only as an optional secondary representation.

## 9. Disclosure modes and data-minimization policy

| Mode | Public data | Additional restrictions |
|---|---|---|
| Public | QRVID, record type, approved issuer display, result, observation time, limited issue/expiry dates as permitted | MUST avoid unnecessary names, member IDs, financial and location data |
| Restricted | Above plus authorized recipient/record fields | OAuth/session/tenant and record-scope checks before returning any additional field |
| Private | Minimal status/assurance assertion | No identifiable claims returned to anonymous callers; non-enumerable lookup where feasible |

No default public recipient name is necessary to prove a certificate's current issuance status. Sensitive fields and low-entropy hashes are not appropriate as public disclosure. Issuers MUST identify applicable privacy obligations, publish notice and retention terms, and honor lawful data access/correction/deletion requirements while preserving minimal compliance/audit records as required.

Verification event analytics MUST use privacy-respecting aggregation and data retention. Geo maps based on individual scans are opt-in and may require additional disclosures.

## 10. API and interoperability requirements

The current \`/api/v1\` remains a **legacy compatibility contract**. Its use of VERIFIED for unsigned active records must be accompanied by an explicit notice that signature verification is pending. QVS-1.1 strict state semantics MUST NOT be silently imposed on existing consumers that rely on v1 Boolean fields. The proposed versioned strict path is \`/api/v2/verify/{qrvid}\`; separate design/deployment approval is required.

A strict response MUST identify \`protocol\`, \`standard\`, \`qrvid\`, \`verificationState\`, \`assuranceLevel\`, \`issuer.id\`, \`recordType\`, \`integrity.hashValid\`, \`signature.valid\` or missing-proof state, \`verifiedAt\`, \`canonicalUrl\`, and \`requestId\`. Unavailable or negative results must not borrow positive-only fields. Keep stable errors (HTTP 404 NOT_FOUND, 422 INVALID_QRVID, 401/403 access control, 409 conflict, 429 rate limiting, 503 outage) as defined by QRVP-1.1.

A credential may optionally be transformed/exported into a W3C VC Data Model v2.0 representation, but that operation MUST separately validate W3C model/proof/status constraints; a QR-V envelope is not a W3C Verifiable Credential solely by virtue of JSON fields.

## 11. Audit and operational controls

For issuance, revocation, issuer authorization/suspension, key administration and payment/provisioning changes, the operator MUST record durable actor-attributed audit events. High-value state transitions MUST fail closed when an audit event cannot be persisted within the approved transaction. Observation-only verification logs MAY be sampled/minimized if documented and are not a substitute for lifecycle audit.

Production MUST provide:
- a single authoritative writable registry and documented schema migration/rollback;
- authenticated server-to-server API access and issuer sessions;
- deployment provenance with repository, commit SHA, build/runtime version and timestamp;
- HTTPS, service readiness, bounded API timeouts, telemetry and incident response;
- backup/recovery and key compromise procedures;
- rate limiting, anti-enumeration, and cross-tenant authorization tests;
- non-cacheable current lifecycle status and deterministic errors;
- a documented dependency-security and CI gate.

## 12. QVS-1.1 acceptance test matrix

| ID | Required regression scenario | Pass condition |
|---|---|---|
| QVS-01 | Known approved issuer and valid signed active record | VERIFIED + SIGNED_ISSUER, valid JCS digest and Ed25519 |
| QVS-02 | Signed payload field changed after issue | INTEGRITY_FAILED or INVALID_SIGNATURE; never VERIFIED |
| QVS-03 | Invalid/missing issuer key | INVALID_SIGNATURE / issuer disqualification |
| QVS-04 | Unauthorized issuer uses another issuer ID | 403; no record created; audit evidence |
| QVS-05 | Approved issuer creates record with idempotency key | One record and one logical issuance event |
| QVS-06 | Same issued QR scanned after revocation | REVOKED from same URL with fresh status |
| QVS-07 | Expired record | EXPIRED with no positive assurance |
| QVS-08 | Absent valid QRVID | 404 NOT_FOUND JSON |
| QVS-09 | Malformed QRVID | 422 INVALID_QRVID JSON |
| QVS-10 | Registry unreachable | 503 UNAVAILABLE; no false positive or NOT_FOUND |
| QVS-11 | Suspended issuer | No positive assurance; explanation consistent with policy |
| QVS-12 | Key rotated normally | Historical signed record still verifiable under valid historical public key |
| QVS-13 | Signing key compromised | Affected records handled according to compromise policy; no unjustified VERIFIED |
| QVS-14 | Cross-tenant record/list/audit | No access or data leakage |
| QVS-15 | Public/restricted/private record | Field-level disclosure respected; no PII in public output |
| QVS-16 | Cached active response followed by revocation | Fresh lookup shows revoked, never stale green |
| QVS-17 | Legacy QRV:// alias | Resolves only when explicitly mapped; no fake issuer domain |
| QVS-18 | Legacy /api/v1 consumer | No silent breaking change, signature status honestly disclosed |
| QVS-19 | Independent canonicalization verifier | Identical bytes/digests and Ed25519 result |
| QVS-20 | Audit durability failure during revocation | Transaction fails closed or approved equivalent; no unaudited state mutation |
| QVS-21 | Production desktop/mobile/redirect tests | Canonical platform and API origin, no stale/wrong-app route |
| QVS-22 | CI dependency-security gate | No unresolved high-severity audit findings accepted as passed |

A conformance report MUST distinguish simulated tests, local tests, hosted staging tests and **live** production evidence. No self-declared compliance level may be upgraded without its corresponding complete evidence.

## 13. Adoption and claims policy

- Current runtime may be described as **QRVP-1 / QVS-1.0 registry-backed pilot implementation** to the extent verified.
- The proposed revisions may be published as **QRVP-1.1 and QVS-1.1, draft for implementation review**.
- **Do not** label the current runtime "QVS-1.1 Compliant", "issuer-signed", "independently certified", "fraud-proof", or "government-approved" absent relevant operational and external evidence.
- ONEGODIAN, LLC administers this private commercial verification framework. Its issuer approval is not an exercise of governmental authority.
- The historical March 2026 QVS-1.0 standard and its attribution MUST remain intact in the archive.

## 14. External implementation references

- QRVP-1.1 companion proposed protocol (this repository).
- RFC 8785 JCS: https://www.rfc-editor.org/rfc/rfc8785
- RFC 8032 Ed25519: https://www.rfc-editor.org/rfc/rfc8032
- RFC 9110 HTTP semantics: https://www.rfc-editor.org/rfc/rfc9110
- W3C Verifiable Credentials Data Model v2.0: https://www.w3.org/TR/vc-data-model-2.0/
- W3C Data Integrity EdDSA Cryptosuites v1.0: https://www.w3.org/TR/vc-di-eddsa/
- OWASP API Security Top 10 (2023): https://owasp.org/API-Security/

**This private standards revision is not an IETF RFC, W3C Recommendation, statutory standard or accreditation.**