# QRVP-1.1 — QR-V™ Internet Protocol
**Protocol specification — Proposed Revision / Implementation Candidate**

| Record field | Value |
|---|---|
| Protocol family | QRVP-1 |
| Proposed revision | **QRVP-1.1** |
| Companion verification standard | QVS-1.1 |
| Original establishment record | March 3, 2026 (QRVP-1) |
| Revision date | October 11, 2026 |
| Originator | Gregory “One” Jones / One Gregory Onegodian™ |
| Commercial operator / publisher | ONEGODIAN, LLC |
| Network | QR-V™ Global Verification Network (GQVN™) |
| Reference platform | https://qrv.network |
| Status | **PROPOSED — not production-certified; not an IETF or W3C standard** |

## 1. Abstract and scope

QRVP-1.1 specifies a QR-addressable, registry-backed mechanism to resolve an identifier to an issuer-associated record, evaluate cryptographic evidence and current lifecycle state, and return a deterministic machine-readable result. It applies to issuer-issued credentials, certificates, documents, products and other objects within an issuer's demonstrable authority. A QR graphic is an **untrusted locator**, not a security proof, legal instrument, identity document, title record or authorization credential by itself.

This revision builds on the March 2026 QRVP-1 outline. The original texts remain historically intact. The new requirements are **forward-looking** and do not assert that the active production nodes already satisfy them.

## 2. Normative language and boundaries

**MUST**, **MUST NOT**, **SHOULD**, and **MAY** are interpreted as in RFC 2119 / RFC 8174. QRVP-1.1 describes an application-layer verification protocol over HTTPS, **not** a newly registered Internet URI scheme or an Internet Engineering Task Force standard. Terms such as "global" describe intended cross-organization deployment, not automatic legal authority, government affiliation or third-party certification.

A QR-V validation proves, at most, that a specific, authorized issuer made a specific assertion and that the recorded assertion has a particular current status. It does **not** prove the underlying real-world assertion true unless separately corroborated.

## 3. Canonical deployment topology

Reference deployment:

1. **https://qrv.network/** — website, scanner/verification experience, issuers' human-facing application, standards and documentation.
2. **https://api.qrv.network/api/v1** — trusted API service, lifecycle mutations, signature processing, key lookups, verification, registry access and audit.
3. **One canonical writable PostgreSQL authority** — Cloud SQL *or* a managed PostgreSQL backend, not two writable registries.

Previously documented subdomains such as verify, issuer, registry, explorer, docs and developers MAY remain **308 redirect-only aliases**, not separate sources of authority. A public /api/v1 proxy MAY exist on the platform node if it delegates to the canonical API and does not implement independent verification logic. No public node or browser client may have registry-admin or private-signing-key access.

## 4. Identifier syntax and resolution

**Canonical v1.1 issuance format:** uppercase ASCII token \`QRV-{TYPE}-{OPAQUE_ID}\` or the deployed, legacy-compatible \`QRV-{ENV}-{TYPE}-{SEQUENCE}\`, where TYPE and ENV are registered ASCII tokens and OPAQUE_ID is nonempty, case-normalized and unique within a governed namespace. An issued identifier MUST NOT be reissued to a different logical record. The implementation MUST impose an explicit length bound (the current API accepts at most 132 characters, including the \`QRV-\` prefix) and reject control characters, path separators, ambiguous Unicode and double decoding.

Preferred QR payload:

\`\`\`text
https://qrv.network/verify/QRV-PROD-CERT-000001
\`\`\`

For backwards compatibility, preexisting \`QRV://registry/type/objectID\`, \`qrv://...\` or \`qrv:...\` forms MAY be accepted by a **documented alias resolver** with an explicit namespace mapping. There is no claim of official registration of a \`qrv\` URI scheme. Unknown legacy namespaces MUST NOT be silently treated as current issuer authority.

Resolution MUST:

- parse and validate the QRVID and percent-decode at most once;
- map the QRVID to exactly one canonical record or an explicit NOT_FOUND;
- resolve issuer identity/authorization and key status separately;
- reject open redirects, user-supplied verification hosts and server-side request forgery;
- return the exact canonical HTTPS verification URL; and
- never treat a screenshot, PDF, QR graphic or issuer-supplied URL as sufficient evidence of record authenticity.

## 5. Minimum registry objects

Implementations MUST support these logical entities; physical database table names are not mandated:

- **issuer:** immutable issuer ID; controlled display name; organizational evidence and verification status; authority scopes; suspension/revocation status; creation and modification events.
- **issuer_key:** stable key ID; algorithm; public key; issuer ID; activation, expiry, revocation and replacement dates. Private keys MUST remain in a protected key service.
- **record:** immutable QRVID; issuer ID; type; schema version; data/payload digest; created/issued/expiration timestamps; privacy classification; canonical immutable issuance envelope; active lifecycle reference.
- **record_proof:** key ID, algorithm, payload canonicalization version, signature and immutable record digest.
- **lifecycle_event:** authorized issue/revoke/suspend/expire or restore action as policy permits; subject, actor, timestamp, reason, idempotency reference, sequence number and integrity evidence.
- **audit_event:** trace ID, actor/operation, result, timestamp, access decision and source system with restricted retention.

Data models MUST enforce unique QRVIDs, foreign keys/issuer association, non-reuse of revoked IDs and authorization scoped to issuer and record. A public status endpoint MUST NOT expose complete subjects, personal details, signing private keys or internal audit logs.

## 6. Immutable signed issuance envelope

The signed statement MUST be immutable. Mutable lifecycle state such as revoked, suspended, verification count, scan timestamp and "currently verified" MUST **NOT** be included in the original signed issuance envelope. A change to signed claims requires a new versioned attestation or reissuance, preserving history.

Proposed v1.1 signing envelope example (illustrative placeholders, **not** a real signature):

\`\`\`json
{
  "schemaVersion": "qrvp-1.1",
  "qrvid": "QRV-PROD-CERT-000001",
  "issuerId": "issuer-example-001",
  "keyId": "issuer-example-001#ed25519-2026-01",
  "recordType": "certificate",
  "payloadDigest": "sha256:PLACEHOLDER_64_LOWERCASE_HEX",
  "issuedAt": "2026-10-11T12:00:00Z",
  "expiresAt": null
}
\`\`\`

Production values MUST satisfy a published JSON Schema; \`payloadDigest\` MUST contain a real 64-character lowercase hex SHA-256 digest. The envelope MUST be serialized using **RFC 8785 JSON Canonicalization Scheme (JCS)**. Arbitrary JSON.stringify with sorted keys is NOT asserted to be RFC 8785 compliant. All signed timestamps MUST be UTC ISO-8601/RFC 3339 with explicit Z and a single documented precision. Supplementary OneGodian Time™ MAY be recorded for provenance but MUST NOT replace UTC as the controlling system timestamp.

The signature input is:

\`\`\`text
UTF-8("QRV-QVS-1.1" + NUL) || UTF-8(JCS(issuanceEnvelope))
\`\`\`

and the detached Ed25519 signature is encoded as base64url without padding. Verifiers MUST check the exact bytes, key ID, issuer/key association, trust status and cryptographic signature. The digest of the canonical envelope MAY be recorded as \`recordDigest = "sha256:" + lowercase_hex(SHA256(JCS(envelope)))\`. Use a different field for the digest of certificate/document content; never confuse an issuance envelope hash with a proof that an external artifact matches.

Where a low-entropy private field might be guessed (for example a name or member number), the commitment/digest scheme MUST include sufficient entropy or store the protected data behind authorization to avoid dictionary attacks.

## 7. Cryptographic assurance profiles

- **Legacy / registry-integrity profile**: record lookup and SHA-256 integrity may be available without issuer signing. The result MUST disclose \`assuranceLevel: "REGISTRY_ONLY"\` and a nonvalid signature state. It MUST NOT be presented as issuer-signature-verified.
- **QRVP-1.1 signed profile**: MUST include JCS canonicalization, SHA-256, Ed25519 issuer signature, verified issuer-key association, current key validity, lifecycle evaluation and fail-closed error handling; return \`assuranceLevel: "SIGNED_ISSUER"\` only when all checks succeed.
- Optional W3C Verifiable Credentials 2.0 export is a **separate interoperability profile**, not automatic from QRVP conformance. A W3C-compliant VC requires its own data-model and secured-credential conformance validation.

Cryptographic signing alone cannot prevent copying a static QR code. Anti-clone, single-use admission or proof-of-possession claims require a separate online challenge, binding or consumption protocol and explicit threat-model tests.

## 8. Key and issuer management

Only an authenticated actor authorized for the specific issuer and scope MAY create, update, revoke, suspend or rotate records/keys. A shared backend service key MAY authenticate the platform node, but it MUST NOT substitute for per-issuer object-level authorization or allow a caller to choose any \`issuer\` text freely.

Issuer onboarding MUST verify claimed organizational control and clearly document the issuer's authority scope. Keys MUST be associated with an immutable issuer ID and not just a display name. Signing private keys MUST remain server-side under approved secret management/HSM/KMS as feasible. Rotation MUST retain old verification public keys as needed for previously issued records, while distinguishing a normal rotation from key compromise; compromise MUST trigger documented invalidation/review of affected attestations. Every key-management change MUST be auditable.

## 9. Verification algorithm

Given QRVID, the verification service MUST perform, in order:

1. Validate syntax and record type/namespace.
2. Resolve the authoritative registry; if storage is unavailable return UNAVAILABLE, **not** NOT_FOUND.
3. Retrieve record and proof; for a known record check required-field and digest integrity.
4. Resolve issuer, authorization scope, issuer-key association, key lifecycle and signature; fail closed on missing/invalid proof in signed mode.
5. Evaluate issuer suspension and record lifecycle events (revocation takes precedence over expiry).
6. Evaluate expiration at the verifier's trusted current UTC time.
7. Return a deterministic result with assurance, evidence summary, requestId, observation timestamp and authorized disclosure fields.
8. Record a privacy-minimized audit event, without disclosing privileged information to the caller.

Proposed **strict v1.1** verification states are \`VERIFIED\`, \`REGISTRY_VALID\`, \`REVOKED\`, \`EXPIRED\`, \`NOT_FOUND\`, \`INVALID_QRVID\`, \`INVALID_SIGNATURE\`, \`INTEGRITY_FAILED\`, \`ISSUER_SUSPENDED\` and \`UNAVAILABLE\`. Only \`VERIFIED\` has signed-issuer assurance; \`REGISTRY_VALID\` indicates an unsigned or transitional record. For records with integrity/signature failure, no positive lifecycle assurance may be returned, even if their stored status says active.

The currently deployed /api/v1 contract uses \`VERIFIED\` for active registry records **without Ed25519**. Maintain that old wire contract during migration, but expose \`assuranceLevel: REGISTRY_ONLY\` and do **not** silently redefine an existing field. Deploy strict v1.1 behavior behind a separately versioned public interface, proposed \`/api/v2/verify/:qrvid\`, after consumer tests and version adoption. The /api/v2 route is a **proposal**, not a claim of implementation.

## 10. API wire contract and HTTP semantics

Current compatibility endpoints:

\`\`\`http
GET  https://api.qrv.network/api/v1/verify/{qrvid}
GET  https://api.qrv.network/api/v1/records/{qrvid}
POST https://api.qrv.network/api/v1/records
POST https://api.qrv.network/api/v1/records/{qrvid}/revoke
GET  https://api.qrv.network/api/v1/audit/{qrvid}
\`\`\`

The strict-profile response is proposed as:

\`\`\`json
{
  "protocol": "QRVP-1.1",
  "standard": "QVS-1.1",
  "qrvid": "QRV-PROD-CERT-000001",
  "verificationState": "VERIFIED",
  "verified": true,
  "assuranceLevel": "SIGNED_ISSUER",
  "issuer": {"id": "issuer-example-001", "displayName": "Example Training Organization"},
  "recordType": "certificate",
  "integrity": {"hashAlgorithm": "SHA-256", "hashValid": true},
  "signature": {"algorithm": "Ed25519", "keyId": "issuer-example-001#ed25519-2026-01", "valid": true},
  "issuedAt": "2026-10-11T12:00:00Z",
  "expiresAt": null,
  "verifiedAt": "2026-10-11T12:00:04Z",
  "canonicalUrl": "https://qrv.network/verify/QRV-PROD-CERT-000001",
  "requestId": "illustrative-request-id"
}
\`\`\`

This is **illustrative**, not an active production API response. Machines MUST use \`verificationState\` and \`assuranceLevel\` together. \`verified: true\` in the **new strict contract** MUST only correspond to \`VERIFIED\` with \`SIGNED_ISSUER\`.

Transport status: 200 for a successfully evaluated existing record (including REVOKED/EXPIRED/invalid signature as applicable), 404 for absent valid QRVID, 422 malformed input, 401 missing/invalid caller authentication on protected routes, 403 authenticated-but-not-authorized, 409 state/idempotency conflicts, 429 rate limiting, and 503 upstream/data authority unavailability. Never use HTTP 401 to mean an invalid record signature. Errors MUST return JSON with machine-readable code, requestId and timestamp; retryable outages MUST be distinguishable from a final negative result.

New mutation endpoints MUST require idempotency keys or equivalent request deduplication, strict issuer scoping and atomic registry/lifecycle/audit writes.

## 11. Cache, replay and consistency

Current status, revocation and issuer-suspension verification responses MUST be non-cacheable by default: \`Cache-Control: no-store\`. Clients MUST NOT treat an offline/cached "VERIFIED" result as fresh; offline verification MUST label freshness and inability to check revocation. Reusable signed issuance proof MAY be cached with separate validity rules, but not conflated with live status. A 5-minute cache of revocation data (allowed in original QRVP-1 outline) is **not** acceptable for the strict fresh-status profile.

For geographically distributed future deployments, each status response SHOULD include monotonic lifecycle version/sequence. Define an operational freshness SLA separately; do not claim instantaneous global revocation unless proven by acceptance tests.

## 12. Privacy, audit and data protection

Default public verification discloses only status, issuer, record category and non-sensitive dates. Restricted fields need consent/authorization and record-specific access checks; private mode returns a minimal status result. Avoid plaintext names, contact details, government identifiers, exact scans/location, biometric data, token secrets and unneeded personal details in public verification and logs. Logs SHOULD use minimized IP treatment, access controls, retention limits, and auditable deletion/retention policies.

Audit events SHOULD be append-only or tamper-evident and persist with critical lifecycle transactions. A best-effort audit insert that silently fails is **not compliant** for issue, revoke, key rotation or privileged access.

## 13. Security requirements

Threat-model and test: malicious QR substitution, QR duplication, lookalike verification domains, malicious issuer and key takeover, replay, forged proofs, authorization bypass/BOLA, brute-force enumeration, object-field exposure, SSRF, compromised signing key, stale status/cache, database outage and verifier clock skew. Use HTTPS, secure session cookies, CSRF controls for cookie-authorized writes, rate limits, monitoring, protective headers, explicit CORS origins and server-side secret handling. A QR-linked record is not automatically "fraud-proof" or "tamper-proof" in an absolute sense.

## 14. Conformance, compatibility and publication

A QRVP-1.1 implementation is **conformant** only if independent test vectors and the QVS-1.1 conformance suite pass, including canonicalization across languages, Ed25519 positive/negative tests, issuer authorization isolation, key rotation/compromise, status precedence, revocation freshness, outages, private disclosure, legacy aliases and no false positive verification. Provide signed release evidence, runtime version/SHA, deploy provenance and rollback procedure.

Until then use the label **"QRVP-1.1 Proposed; QRVP-1/QVS-1.0 legacy production behavior"** with the exact observed capabilities. Release of this specification does NOT automatically upgrade runtime code, customer terms or an independent standards status.

## 15. External references (not claims of third-party endorsement)

- RFC 2119 / RFC 8174 — requirement language: https://www.rfc-editor.org/rfc/rfc2119 and https://www.rfc-editor.org/rfc/rfc8174
- RFC 8785 — JSON Canonicalization Scheme: https://www.rfc-editor.org/rfc/rfc8785
- RFC 8032 — Ed25519 / EdDSA: https://www.rfc-editor.org/rfc/rfc8032
- RFC 9110 — HTTP semantics: https://www.rfc-editor.org/rfc/rfc9110
- W3C Verifiable Credentials Data Model 2.0 (May 2025 Recommendation): https://www.w3.org/TR/vc-data-model-2.0/
- OWASP API Security Top 10 (2023): https://owasp.org/API-Security/

## 16. Revision control

| Edition | Date | Historical / operative meaning |
|---|---|---|
| QRVP-1 original | March 3, 2026 | Foundational identifier/resolver/registry design; remains archival |
| QRVP-1.1 proposed | October 11, 2026 | Strict canonical signing, issuer authority, assurance, API error discipline and operational conformance |

**No automatic change to deployed services is authorized by publishing this document.**