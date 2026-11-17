# QR-V Standards Registry — October 11, 2026

**Status: proposed documents under engineering review; no runtime conformance promotion.**

| Artifact | Version | Status | Location |
|---|---:|---|---|
| QR-V Internet Protocol | QRVP-1 (March 3, 2026) | Historical baseline | Original user-established specification / existing public site |
| QR-V Global Verification Standard | QVS-1.0 (March 5, 2026) | Historical baseline | Original user-established specification / existing public site |
| QR-V Internet Protocol | [QRVP-1.1](./QRVP-1.1.md) | PROPOSED | This directory |
| QR-V Global Verification Standard | [QVS-1.1](./QVS-1.1.md) | PROPOSED | This directory |
| Migration / release controls | [Implementation and migration](./IMPLEMENTATION_AND_MIGRATION.md) | Review annex | This directory |

## Roles

- **QRVP** specifies identifier syntax, registry resolution, cryptographic verification, API and lifecycle behavior.
- **QVS** specifies verification evidence, conformance profiles, issuer controls, privacy, tests and honest public claims.
- **qrv-node** implements qrv.network public UX; **qrv-api** implements trusted API and canonical registry boundary.
- The public platform cannot publish a signed-issuer conformance claim until hosted implementation, conformance tests and release acceptance pass.

The protocol name and attribution are preserved from the original March 2026 documents. These proposed revisions are private technical specifications administered by ONEGODIAN, LLC; neither is an IETF standard or a W3C Recommendation.

**Review gates:** approve drafts → remediate production/security blockers → implement in API node → migrate safely → independently verify → approve deployed version → publish supported claims.