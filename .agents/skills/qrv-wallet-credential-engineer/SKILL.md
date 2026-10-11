---
name: qrv-wallet-credential-engineer
description: Build holder wallet references, scanning, sharing and live re-verification without claiming wallet authority.
---
# QRV-07 — qrv-wallet-credential-engineer

**Priority:** P1  
**Lead:** Holder experience engineer  
**Primary implementation repository:** `ohi-stack/qrv-node`  
**Maturity:** SPECIFIED — no execution, CI pass, deployment or production acceptance implied.

## Trigger
Wallet P0 development, QR scans, holder registration, credential display or share link changes.

## Normative authority and trust boundary
QRVP-1 defines the protocol layers; QVS-1.0 governs deterministic verification. `qrv.network` is the human-facing platform, `api.qrv.network` is the trusted JSON API, and `qrv-api` alone owns the canonical PostgreSQL registry, protected writes and signing keys. Do not create another registry or change protocol semantics as an incidental implementation detail. An AI agent does not approve its own production release.

## Required inputs
Wallet route contract, QRVID, holder authorization, privacy policy and verified backend status.

## Procedure
1. Support `/wallet`, `/wallet/login`, `/wallet/register`, `/wallet/dashboard`, `/wallet/records`, `/wallet/records/:qrvid`, `/wallet/add`, `/wallet/scan`, `/wallet/share`, `/wallet/settings`, `/wallet/security` and `/wallet/help` as scoped.
2. Accept a QRVID or scan only as a reference; verify via qrv-api before retaining permitted metadata and never create a second authoritative credential record.
3. Revalidate status when opening or sharing a saved record; never continue to display VERIFIED after it is revoked, expired, unresolvable or integrity-invalid.
4. Do not equate saving a credential with proof of ownership or holder identity; enforce account and share permissions.
5. Respect public/restricted/private data modes and provide clear degraded/offline states.

## Verification and evidence
- Add by QRVID, add by scan, revoke after saved VERIFIED, expiry, unauthorized access, stale cache, public-safe sharing.
- Route accessibility and session/CSRF tests where forms mutate state.
- Record target repository, branch, commit SHA, environment, test commands/results, CI links, relevant PR/issue, and evidence artifacts; redact secrets and personal data.
- Fail closed. A page rendering, a mock fixture or design specification does not constitute a production-accepted capability.

## Definition of done
Live Wallet state always reflects canonical verification; no shadow registry or unauthorized credential disclosure.

## Escalation / approval
Identity binding, transfer claims and disclosure-policy changes require product/security review.

## Response contract
Return: `status` (NOT_STARTED | IN_PROGRESS | BLOCKED | READY_FOR_REVIEW | PASSED | FAILED | COMPLETE), `owner`, `repository`, `branch/PR`, `dependencies`, `evidence`, `blockers`, `next_action`. Use COMPLETE only when all applicable acceptance evidence exists.
