# QR-V Platform Production Readiness

## Production role

`qrv.network` is the public and issuer browser platform. `api.qrv.network` is the JSON API and canonical registry backend. Logical services remain available as paths and compatibility redirects:

| Logical service | Canonical production location | Legacy compatibility host |
|---|---|---|
| Verify | `qrv.network/verify` | `verify.qrv.network` |
| Registry and explorer | `qrv.network/registry` | `registry.qrv.network`, `explorer.qrv.network` |
| Issuer Portal | `qrv.network/issuer` | `issuer.qrv.network` |
| Documentation | `qrv.network/docs` | `docs.qrv.network` |
| Developers | `qrv.network/developers` | `developers.qrv.network` |
| Status | `qrv.network/status` | `status.qrv.network` |

The legacy hosts are redirects only after acceptance confirms that historical QRVIDs remain resolvable.

## Implemented release controls

- accessible responsive mega menu and mobile navigation;
- self-hosted assets and self-only content security policy;
- bounded API timeouts and fail-closed verification rendering;
- live demo state derived from the API, with no static VERIFIED claim;
- signed HTTP-only SameSite issuer sessions;
- scrypt password verifier, login throttling, CSRF validation, no-store issuer responses;
- issuer create, list, detail, QR, update, analytics, and revoke workflows;
- health, readiness, version, status, sitemap, robots, compatibility, and deterministic 404 routes;
- non-root container build, dependency audit, CodeQL, dependency review, SBOM, CODEOWNERS, and Dependabot.

## Deployment gate

1. API PR #5 must be migrated, deployed, ready, and accepted first.
2. Install only server-side environment values from `.env.example`.
3. Confirm `qrv.network` points to this application and all TLS certificates are valid.
4. Run `npm run validate:prod` for the exact deployment commit.
5. Require `/healthz` and `/readyz` to return JSON without redirects.
6. Run `npm run acceptance:live` and retain its output.
7. Complete keyboard, screen-reader landmark, 200% zoom, mobile overflow, form error, issuance, QR download, verification, and revocation checks.
8. Enable legacy-host redirects only after previously issued links pass acceptance.

## Not yet operational

The API-key, team, billing, settings, and support routes deliberately fail closed as restricted provider placeholders. They must not be advertised as functioning controls until their provider integration, authorization model, audit evidence, tests, and deployment configuration are completed.
