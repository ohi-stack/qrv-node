# QR-V Global Verification Network

Public QR-V platform experience built with Sites/Vinext.

## Canonical production topology

The public launch uses one verified production origin:

- `https://qrv.network` — the human-facing platform for public verification, issuer workflows, documentation, pricing, products, news, legal notices, status, and compatibility routes.
- `https://api.qrv.network` — the only separately operated API, registry, cryptographic, audit, and mutation boundary. It must remain labeled activation-pending until live endpoint and lifecycle validation is complete.

New QR-V records use `https://qrv.network/verify/{QRVID}`. Legacy service subdomains are compatibility aliases and should return HTTP 308 redirects to the matching `qrv.network` routes.

The launch trust boundary is browser or API client → `qrv.network` → canonical API proxy/route → `api.qrv.network/api/v1` → the single writable PostgreSQL registry authority. This Site must not become a second verification or registry authority. Public responses expose only the permitted public record fields.

The public platform exposes `/healthz`, `/readyz`, and `/version` for delivery checks. `/readyz` is dependency-aware and returns a non-ready response until `api.qrv.network/readyz` confirms a connected canonical backend. Registry search is intentionally disclosed as activation-gated until the canonical API exposes its public search contract.

The current route and sitemap baseline is synchronized from `ohi-stack/qrv-node` commit `0949815c020e7f27f388f48f696bd931a6504b0a`. The backend contract and registry authority are synchronized from `ohi-stack/qrv-api` commit `bc9ce14805c69bfe9f08c3d9748a06b55c7cbcdd`.

See `config/routes.manifest.json`, `docs/PRODUCTION_SITEMAP.md`, and `config/repository-sync.json` for the synchronized architecture record.

## Cryptographic implementation status

Canonical serialization and SHA-256 hashing are implemented in the live API. Full issuer-specific Ed25519 signing and signature validation remain activation-pending. UI and documentation must not claim complete QRVP-1 cryptographic compliance until that work is verified live.

## Local validation

```bash
npm run build
npm test
npm run lint
npm run validate:artifact
```

The Sites project identifier is declared in `.openai/hosting.json`. Publish only a tested source commit through the Sites version and deployment workflow.
