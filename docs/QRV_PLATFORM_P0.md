# QRV-PLATFORM-P0 — Consolidated Customer, Issuer, and Wallet Workflows

**Priority:** P0 — production/customer-launch blocker  
**Canonical platform:** `https://qrv.network`  
**Trusted data plane:** `https://api.qrv.network`

## Architecture boundary

`qrv.network` owns human-facing workflows. `api.qrv.network` remains the sole trusted JSON/API data plane and PostgreSQL authority. The platform MUST NOT create a second writable registry, perform browser-side signing, expose privileged credentials, or fabricate a VERIFIED state.

The platform must fail closed whenever the API cannot prove the normative QVS-1.0 verification result.

## Primary human workflows

1. **Verify** — anyone can scan or enter a QRVID and receive the current API-authoritative verification state.
2. **Issuer** — authorized organizations can onboard, issue, manage, and revoke records through server-side API calls.
3. **Wallet** — holders can receive, organize, present, share, and re-verify QR-V records. Wallet possession is not proof of ownership and Wallet is not a verification authority.
4. **Registry** — public registry/explorer views resolve canonical API data.
5. **Developers / agents** — integrations consume the normative API contract; only VERIFIED may be treated as verified according to the consuming application's policy.

## P0 Wallet routes

- `/wallet`
- `/wallet/login`
- `/wallet/register`
- `/wallet/dashboard`
- `/wallet/records`
- `/wallet/records/:qrvid`
- `/wallet/add`
- `/wallet/scan`
- `/wallet/share`
- `/wallet/settings`
- `/wallet/security`
- `/wallet/help`

Wallet authentication and authorization MUST remain separate from issuer privileges.

## Wallet trust workflow

```text
Receive QR-V record
        ↓
Add QRVID / scan QR
        ↓
Validate and normalize input
        ↓
Resolve through api.qrv.network
        ↓
Evaluate QVS-1.0 state + disclosure policy
        ↓
Store only permitted wallet reference/metadata
        ↓
Display record
        ↓
Re-verify when opened or explicitly refreshed
        ↓
Display current authoritative state
```

Required states include VERIFIED, REVOKED, EXPIRED, NOT_FOUND, integrity/signature failure, and UNAVAILABLE/ERROR. No uncertain or unavailable condition may be translated into VERIFIED.

A record previously saved as VERIFIED MUST stop presenting as VERIFIED when the authoritative API reports REVOKED, EXPIRED, invalid integrity, or another non-VERIFIED state.

## Wallet security requirements

Prevent cross-user wallet access, IDOR, CSRF, session fixation, unauthorized record association, protected metadata leakage, open redirects, and unsafe QR navigation. Do not place session data, credentials, protected subject data, signing keys, or secrets into QR payloads/public URLs. Do not store signing private keys in Wallet.

Removing an item from Wallet removes the holder's reference only; it MUST NOT mutate the authoritative registry record.

Sharing defaults to the canonical public verification URL:

`https://qrv.network/verify/{qrvid}`

unless qrv-api explicitly provides another authorized disclosure mechanism.

## Compatibility routing

Prepare, but do not activate before canonical live acceptance:

```text
verify.qrv.network     → https://qrv.network/verify
issuer.qrv.network     → https://qrv.network/issuer
registry.qrv.network   → https://qrv.network/registry
wallet.qrv.network     → https://qrv.network/wallet
docs.qrv.network       → https://qrv.network/docs
developers.qrv.network → https://qrv.network/developers
explorer.qrv.network   → https://qrv.network/registry
```

Preserve compatible deep links, including:

`wallet.qrv.network/records/{qrvid} → qrv.network/wallet/records/{qrvid}`

Compatibility redirects are 308 only after their canonical routes pass acceptance.

## P0 Wallet acceptance

The implementation is not complete until these are evidenced:

- [ ] Wallet landing route is operational.
- [ ] Wallet authentication/authorization works.
- [ ] Holder can add a valid QR-V record by QRVID.
- [ ] Holder can add a valid QR-V record by scan.
- [ ] Wallet resolves current state through api.qrv.network.
- [ ] Wallet does not become an independent verification authority.
- [ ] Wallet does not equate possession with ownership.
- [ ] API disclosure/privacy rules are enforced.
- [ ] Saved records can be re-verified.
- [ ] A revoked saved record changes to REVOKED.
- [ ] An expired saved record changes to EXPIRED.
- [ ] Invalid integrity fails closed.
- [ ] API outage cannot produce VERIFIED.
- [ ] Sharing uses canonical verification URLs.
- [ ] Wallet and issuer authorization remain separated.
- [ ] `wallet.qrv.network` redirect is prepared but gated.
- [ ] Mobile, tablet, and desktop acceptance passes.

Critical regression:

```text
Add VERIFIED R1 to Wallet
        ↓
Wallet displays VERIFIED
        ↓
Issuer revokes R1
        ↓
Open/re-verify R1
        ↓
api.qrv.network returns REVOKED
        ↓
Wallet displays REVOKED = PASS
Wallet displays VERIFIED = FAIL
```

## Production gate

Do not merge or deploy solely because local tests pass. Do not fabricate records, prices, operational status, or verification evidence. Production acceptance requires real API-backed workflows, security/CI gates, cross-device testing, and rollback evidence.
