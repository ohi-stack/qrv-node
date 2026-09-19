# QR-V Site Synchronization Record

## Source

- Site slug: `qrv-global-verification`
- Public origin: `https://qrv.network`
- Current validated Site version: **12**
- Site source commit: `b551e69d9a797d18376315a8353e7521c07b175f`
- Site validation: `npm test` — 7 tests passed

## Canonical repository mapping

- `ohi-stack/qrv-node`: public platform source and Express runtime
- `ohi-stack/qrv-api`: trusted API/data plane and registry authority
- `ohi-stack/qrv-marketing-site`: historical and migration reference source

## Synchronization scope

The current Site baseline is represented in `src/web/`, including the QR-V header, multi-route navigation, verification-focused hero, public record card, trust/status treatments, news archive, responsive layout, and current motion system. The Node build keeps the Express verification, issuer, registry, health, readiness, and API boundaries authoritative while serving the Site presentation for public content routes. The source revision is recorded in `sites/qrv-global-verification/site.manifest.json`.

## Protected boundaries

Do not move database credentials, signing keys, issuer secrets, payment secrets, or privileged registry operations into the public frontend. A public status label or illustrative issuer preview is not evidence of a live backend capability.
