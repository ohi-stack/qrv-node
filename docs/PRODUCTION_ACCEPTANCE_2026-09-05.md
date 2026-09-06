# QR-V™ Production Acceptance — 2026-09-05

**Status:** FAILED

**Architecture under test:** QR-V Production Architecture v1.0

```text
qrv.network
PUBLIC PLATFORM
      ↓
api.qrv.network
TRUSTED BACKEND
      ↓
Canonical QR-V Registry
```

## Confirmed passing surfaces

| Surface | Result | Finding |
|---|---|---|
| `https://qrv.network/` | PASS | 200; branded platform loads |
| `https://qrv.network/status` | PASS | 200 |
| `https://qrv.network/registry` | PASS | 200 |
| Demo verification page | PASS | 200 |
| Embedded verification API | PASS | Returns `VERIFIED` with valid SHA-256 hash |
| Revoked demo record | PASS | Structured `REVOKED` result |
| Local build | PASS | Build completed |
| Lint | PASS | No errors |
| Automated tests | PARTIAL | 5/6 passing |

## Release blockers

### P0 — `api.qrv.network` is mapped to the wrong application

Observed behavior:

- `/healthz` and `/readyz` return frontend HTML instead of JSON.
- `/api/v1/verify/:qrvid` returns a frontend/Next.js 404.

Required correction:

1. Map `api.qrv.network` to `ohi-stack/qrv-api`.
2. Confirm Node starts with `npm start` and binds to `process.env.PORT`.
3. Configure the canonical registry database and API environment.
4. Run migrations before enabling production writes.
5. Require `/healthz`, `/readyz`, and `/version` to return JSON.

### P0 — API production contract is not reachable

The canonical backend contract is:

```http
GET /healthz
GET /readyz
GET /version
GET /api/v1/status
GET /api/v1/verify/:qrvid
```

Acceptance requires:

- known active QRVID → HTTP 200 JSON `VERIFIED`;
- known revoked QRVID → deterministic `REVOKED`;
- valid but absent QRVID → HTTP 404 JSON `NOT_FOUND`;
- malformed QRVID → HTTP 422 JSON `INVALID_QRVID`;
- dependency failure → 5xx/`UNAVAILABLE`, never `VERIFIED` or `NOT_FOUND`.

### P1 — legacy verification hostname does not resolve

`verify.qrv.network` currently has no DNS resolution.

Under the consolidated architecture it does not need to run an independent verifier application. It **does** need to remain resolvable for compatibility with previously published URLs and printed QR codes.

Required compatibility behavior:

```text
https://verify.qrv.network/{QRVID}
  → HTTP 308
https://qrv.network/verify/{QRVID}
```

The same redirect-only policy should be used for legacy issuer, registry, explorer, docs, developer, and status hostnames when those DNS names are retained.

### P1 — Ed25519 remains incomplete

Current verification validates SHA-256 record integrity. Ed25519 issuer signature verification remains pending.

Do not claim full QRVP-1 issuer-signed verification until all of the following are operational:

1. issuer signing keys provisioned and protected;
2. canonical payload serialization locked;
3. records signed during issuance;
4. signature and key ID persisted;
5. issuer public key loaded during verification;
6. invalid signatures fail verification;
7. key rotation and compromise revocation are auditable.

Until then, production status must state:

> SHA-256 integrity validation active. Ed25519 issuer signature verification pending.

### P2 — news article route regression

`/news/introducing-the-qr-v-global-verification-network` currently renders the news index instead of the requested article.

This route is not a cryptographic blocker, but it prevents a fully green release test suite. Fix the slug-specific route and restore 6/6 automated tests before release.

## Required live acceptance matrix

| Check | Expected |
|---|---|
| `qrv.network/healthz` | 200 JSON |
| `qrv.network/readyz` | 200 JSON |
| `qrv.network/version` | 200 JSON |
| `qrv.network/verify/{known}` | VERIFIED page |
| `qrv.network/verify/{revoked}` | REVOKED page |
| `api.qrv.network/healthz` | 200 JSON |
| `api.qrv.network/readyz` | 200 JSON and DB connected |
| `api.qrv.network/version` | 200 JSON |
| `api.qrv.network/api/v1/status` | OPERATIONAL |
| `api.qrv.network/api/v1/verify/{known}` | 200 JSON VERIFIED |
| `api.qrv.network/api/v1/verify/{unknown}` | 404 JSON NOT_FOUND |
| `api.qrv.network/api/v1/verify/{malformed}` | 422 JSON INVALID_QRVID |
| `verify.qrv.network/{qrvid}` | 308 to canonical verification URL |
| Build | PASS |
| Lint | PASS |
| Automated tests | 6/6 |

## Release decision

**QR-V™ Production Architecture v1.0 remains RELEASE BLOCKED.**

Do not redesign the topology. The remaining work is deployment convergence and protocol-conformance completion:

```text
1. Correct API hostname mapping
2. Configure canonical backend environment
3. Run registry migration
4. Pass API acceptance
5. Restore legacy verification DNS + 308 redirects
6. Complete Ed25519 production gate
7. Fix news slug route
8. Reach 6/6 tests
9. Run full CREATE → VERIFIED → REVOKE → REVOKED acceptance
10. Mark production launch only after all gates pass
```
