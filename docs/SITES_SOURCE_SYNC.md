# QR-V Site Synchronization Record

## Source

- Site slug: `qrv-global-verification`
- Public origin: `https://qrv.network`
- Current validated Site version: **11**
- Site source commit: `3ca2be27b40e2eb8eb47891beea7ff7bf9906e22`
- Site validation: `npm test` — 6 tests passed

## Canonical repository mapping

- `ohi-stack/qrv-node`: public platform source and Express runtime
- `ohi-stack/qrv-api`: trusted API/data plane and registry authority
- `ohi-stack/qrv-marketing-site`: historical and migration reference source

## Synchronization scope

The current Site baseline is represented in `src/web/`, including the QR-V header, navigation, verification-focused hero, public record card, trust/status treatments, responsive layout, and current motion system. The latest news slug normalization fix is preserved in the Site source and its source revision is recorded in `sites/qrv-global-verification/site.manifest.json`.

## Protected boundaries

Do not move database credentials, signing keys, issuer secrets, payment secrets, or privileged registry operations into the public frontend. A public status label or illustrative issuer preview is not evidence of a live backend capability.
