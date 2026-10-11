# QR-V™ — Production blocker investigation and release plan (11 October 2026)

**Branch of baseline:** `main` at `813d2cb87f9d3fbf65bcac0b622814d8ce8ad45f`.
**Live acceptance run:** https://github.com/ohi-stack/qrv-node/actions/runs/38116011165
**Dependency CI:** https://github.com/ohi-stack/qrv-node/actions/runs/38053498830
**Security blocker:** https://github.com/ohi-stack/qrv-node/issues/49

## Confirmed live acceptance failures

The October 11 scheduled run shows **PASS** on desktop/mobile home, platform health/version, verify entry, issuer entry, registry, docs, developers, status, and public demonstration record page.

**FAIL**:
- `qrv.network/readyz` → HTTP 503 (correctly indicates an unavailable API dependency).
- `api.qrv.network/healthz`, `/readyz`, `/version` → login redirect HTML, not JSON. The recorded final URLs include `/login?next=%2Fhealthz`, etc.
- `api.qrv.network/api/v1/status` and `/api/v1/verify/*` → framework HTML 404, not canonical API JSON.
- `verify.qrv.network/{QRVID}` → connection/DNS failure. This hostname is an **optional compatibility service** under the later consolidated architecture and should only be a release gate if historical QR codes use it.

**Primary cause boundary:** The production API hostname is not routing to the expected Node `ohi-stack/qrv-api` runtime. That cannot be repaired by changing this public platform's landing-page text or weakening acceptance assertions. Inspect Hostinger application target, custom-domain binding, reverse proxy, edge auth middleware, edge rewrite priority, port, CORS and runtime environment. Public health/version/status/verification must reach the canonical API; **privileged issuance must stay authenticated**.

## API-owner correction sequence (not changed by this qrv-node PR)

1. Back up the canonical registry, verify ownership and the chosen writable PostgreSQL authority.
2. Bind `api.qrv.network` to the `ohi-stack/qrv-api` Node service, not a login SPA or unrelated site's web root.
3. Configure production secrets on the API server only. Ensure `GET /healthz`, `/readyz`, `/version`, `/api/v1/status` and `/api/v1/verify/:qrvid` are routed to the API without forced browser login. Preserve API-key/issuer protection on write/list/audit endpoints.
4. Validate responses with no browser cookies: JSON content type, expected status and response body; no HTML redirects.
5. Confirm readiness is connected to the intended single PostgreSQL registry. Run approved migrations only after backup.
6. Rerun `npm run acceptance:live` in `qrv-node`, then protected issuer lifecycle tests with human-approved credentials.

Do not return fake 200 responses, disable readiness checks, white-list all write routes publicly, or change `api.qrv.network` references to unverified origins merely to make CI green.

## Dependency remediation gate (#49)

2026-10-10 CI: application validation succeeded; `npm audit --omit=dev --audit-level=high` failed due to `@grpc/grpc-js` transitively reachable through `firebase → @firebase/firestore-compat → @firebase/firestore → @grpc/grpc-js`.

This branch proposes a narrow npm override `@grpc/grpc-js: ^1.14.6`, a compatible patched series according to the September 2026 GitHub security advisories. This is a **proposed remediation, not yet a verified clean audit**. Preserve Firebase Google/email login and bookmark behavior.

Before merging:
- generate and **commit** `package-lock.json` from a vetted Node 22/npm environment using `npm install --package-lock-only`;
- `npm ci` and `npm ls @grpc/grpc-js firebase @firebase/firestore`;
- `npm audit --omit=dev --audit-level=high` and the stricter `npm audit --audit-level=high` (review any dev-only alerts);
- `npm run validate:prod` / fail-closed/route regression and real Google/email auth smoke tests;
- compare the exact lockfile transitive tree, then close issue #49 only on passed evidence.

No `npm audit fix --force` Firebase downgrade. No audit suppression.

## Remaining critical platform/API gaps

- **Single-issuer pilot auth only:** current public node supports a shared issuer access-code session. This branch binds it to one configured issuer ID/name and rejects out-of-scope reads/revokes in the platform, but **`qrv-api` currently checks a shared API key, not an issuer-scoped authorization claim**. Consequently multi-tenant issuer SaaS cannot be certified until API-side identities, roles and tenant isolation are implemented and tested.
- **Public data minimization:** `qrv-api` currently includes owner/recipient fields in its public record response and lacks fully enforced per-record public/restricted/private disclosure modes. This branch stops echoing those details in the platform HTML, but the API must enforce privacy at source before sensitive production data is registered.
- **Real telemetry:** `qrv-api` does not yet provide measured `/api/v1/metrics/activity`. This branch removes fabricated frontend fallback and client-constructed audit history. The graph will state unavailable until a trusted endpoint exists.
- **Ed25519:** signature/key lifecycle remains pending; do not equate a present SHA-256 hash with completed cryptographic signing.
- **Stripe entitlements:** signed webhook → idempotent paid-plan entitlement → issuer approval/provisioning is not yet evidenced. Do not infer this from public price pages or prior payment links.
- **QRCode/PNG:** inspect PR #44 and API-integrated record detail before claiming production download.
- **Sites integration:** reconcile existing PRs #40–#48 against the canonical router and protected Express route boundaries; do not bulk overwrite `App.jsx` or treat draft features as live.

## Acceptance and release order

1. Complete the audited dependency tree and lockfile; pass PR CI.
2. Correct API-host routing and database readiness **in API hosting/runtime**.
3. Verify public fail-closed semantics and authenticated issuer scope, privacy policy and signed record requirements.
4. Run controlled `CREATE → VERIFIED → REVOKE → REVOKED` on the same QRVID; confirm audit and cache invalidation.
5. Verify desktop/mobile routing, Google/email login, issuer sessions, security headers, billing handoff and monitoring.
6. Obtain human security/release approval, then merge and deploy.
7. Enroll one **external** issuer and measure paid activation independently of affiliated pilots.

Never label a release PRODUCTION-VERIFIED while any hard gate remains unresolved.
