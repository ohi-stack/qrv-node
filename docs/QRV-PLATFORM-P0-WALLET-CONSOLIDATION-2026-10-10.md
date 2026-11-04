# QRV-PLATFORM-P0 — Customer + Issuer + Wallet consolidation

Date: 2026-10-10. Status: SPECIFICATION / NOT PRODUCTION ACCEPTED.

## Authority
- qrv.network (ohi-stack/qrv-node): human-facing Verify, Issuer, Wallet, Registry, Developers, public content.
- api.qrv.network (ohi-stack/qrv-api): sole verification decision, registry writes, issuer authorization, cryptographic validation, revocation and audit.
- PostgreSQL: canonical authoritative registry. No second writable registry in the platform or Wallet.
- qrv-marketing-site and ChatGPT Sites qrv-global-verification: presentation/SEO/content sources only. Preserve Express routes and security contracts when integrating.

## P0 Wallet routes
/wallet; /wallet/login; /wallet/register; /wallet/dashboard; /wallet/records; /wallet/records/:qrvid; /wallet/add; /wallet/scan; /wallet/share; /wallet/settings; /wallet/security; /wallet/help.

## Wallet lifecycle
Receive QRVID or approved QR URL → validate input and safe origin → authoritative API verification → apply disclosure rules → holder confirms association → persist only holder-specific reference and permitted metadata → show current API result → re-verify on record open and on Verify Again.

Wallet ownership is not established by possession of a QR code. Removing a Wallet association must never revoke or delete the canonical record. Wallet auth is separate from issuer privileges. Never store signing private keys or private credentials in QR payloads, URLs, browser storage or public output. Wallet is not a cryptocurrency wallet.

## Verification states
VERIFIED; REVOKED; EXPIRED; NOT_FOUND; INVALID_SIGNATURE/integrity failure; UNAVAILABLE/ERROR. A cached VERIFIED value is not authoritative. If the API is unreachable, show UNAVAILABLE rather than VERIFIED. On reopening a revoked or expired record, replace any stale VERIFIED presentation with the current authoritative state. Respect public disclosure limits.

## Holder functions
Registration/login; dashboard; add by QRVID or hardened scanner; list/detail; permitted issuer/issued/expiry/integrity metadata; QR and canonical public verification link; re-verify; authorized sharing; remove association; settings/security/logout. Use https://qrv.network/verify/{qrvid} for public sharing unless the API authorizes a different disclosure mechanism. Reject unsafe QR navigation, cross-user access, IDOR, CSRF, session fixation and open redirects.

## Legacy host compatibility (gated)
verify.qrv.network → /verify
issuer.qrv.network → /issuer
registry.qrv.network → /registry
wallet.qrv.network → /wallet
docs.qrv.network → /docs
developers.qrv.network → /developers
explorer.qrv.network → /registry

Preserve compatible deep links: wallet.qrv.network/records/{qrvid} → qrv.network/wallet/records/{qrvid}. Prepare mapping, but DO NOT activate 308 redirects until the destination passes production acceptance. Keep api.qrv.network separately operated.

## Critical regression
1. Issue actual PostgreSQL-backed record R1; API returns VERIFIED.
2. Holder adds R1; Wallet displays VERIFIED.
3. Authorized issuer revokes same R1.
4. Holder opens R1 or selects Verify Again.
5. API returns REVOKED; Wallet displays REVOKED. Stale VERIFIED is a FAIL.
Also test EXPIRED, INVALID_SIGNATURE, NOT_FOUND, API outage, unauthorized association, holder/issuer role separation, cross-user access, share privacy, scan safety, removal, logout, mobile/tablet/desktop.

## Release gates
[ ] Real issuance → PostgreSQL → QR → VERIFIED → revoke → REVOKED → audit evidence
[ ] Wallet routes and holder auth/authorization functional
[ ] Add by QRVID and scan; list/detail; re-verify; share/remove/logout
[ ] Fail closed on expiry, revocation, integrity failure and API outage
[ ] No ownership claim from possession; no second trust authority
[ ] API disclosure and issuer/holder role separation proven
[ ] Security, QA, cross-device and live production acceptance green
[ ] Existing Express/API routes, health/readiness/version and redirects unchanged
[ ] 308 compatibility redirects enabled only after verified destination acceptance

## Content integrity
Explain QR-V as registry-backed verification infrastructure (QRVP-1 protocol; QVS-1.0 standard), not a QR generator or government title authority. Label intended features as planned until operational, documented, repeatable and evidenced. Do not claim live Ed25519 or full production acceptance without current runtime evidence. Commercial entry points prioritize Issuer Portal and Verified Certificates. Preserve existing ChatGPT Sites assets and SEO rather than overwriting operational Express files.

## Deployment
PR review → exact-head CI → API/data lifecycle validation → platform acceptance → approved merge → Hostinger build/redeploy → live evidence and rollback check. Never auto-deploy a specification-only change.
