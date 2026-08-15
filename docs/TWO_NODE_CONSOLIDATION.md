# QR-V™ Two-Node Consolidation

## Target State

Production deploys only two application nodes:

1. `qrv.network` — platform UI and browser routes.
2. `api.qrv.network` — versioned JSON API and canonical registry operations.

The QR-V protocol still preserves identifier, resolution, verification, registry, cryptographic, response, privacy, and revocation layers. Consolidation changes deployment topology, not QRVP-1 semantics.

## Route Migration

| Legacy host | Canonical route |
|---|---|
| `verify.qrv.network` | `qrv.network/verify` |
| `issuer.qrv.network` | `qrv.network/issuer` |
| `registry.qrv.network` | `qrv.network/registry` |
| `explorer.qrv.network` | `qrv.network/explorer` |
| `docs.qrv.network` | `qrv.network/docs` |
| `developers.qrv.network` | `qrv.network/developers` |
| `status.qrv.network` | `qrv.network/status` |
| `store.qrv.network` | `qrv.network/pricing` or a configured commerce route |

## API Mapping

All application data calls use:

```text
https://api.qrv.network/api/v1
```

Canonical public verification URLs become:

```text
https://qrv.network/verify/{qrvid}
```

## Required Redirects

During migration, configure permanent redirects from legacy browser-facing subdomains to the new path equivalents. Preserve query strings and QRVID path segments.

Examples:

```text
https://verify.qrv.network/QRV-PROD-CERT-000001
→ 308 https://qrv.network/verify/QRV-PROD-CERT-000001

https://issuer.qrv.network/login
→ 308 https://qrv.network/issuer/login
```

Do not redirect `api.qrv.network`.

## Deployment Order

1. Deploy the upgraded `api.qrv.network` with direct PostgreSQL access.
2. Validate health, readiness, migrations, create, verify, revoke, and audit.
3. Deploy `qrv.network` consolidated routes.
4. Validate `qrv.network/verify/{qrvid}` against the API.
5. Validate issuer workflows.
6. Apply legacy-host 308 redirects.
7. Remove legacy subdomains from primary navigation, environment templates, docs, and new QR payloads.
8. Keep legacy redirects for previously issued QR codes.

## Acceptance Gate

A consolidation release passes only when:

```text
GET  qrv.network/healthz                              → 200
GET  api.qrv.network/healthz                          → 200
GET  api.qrv.network/readyz                           → 200
POST api.qrv.network/api/v1/registry/create           → 201
GET  qrv.network/verify/{new_qrvid}                   → VERIFIED UI
GET  api.qrv.network/api/v1/verify/{new_qrvid}        → VERIFIED JSON
POST api.qrv.network/api/v1/revoke                    → REVOKED
GET  qrv.network/verify/{new_qrvid}                   → REVOKED UI
```

## Repository Disposition

Legacy service repositories should not be deleted immediately. Mark them as migration/reference repositories and keep only compatibility redirect or archived implementation history until all previously issued links and deployment dependencies have been accounted for.
