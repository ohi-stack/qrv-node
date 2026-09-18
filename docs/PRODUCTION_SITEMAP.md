# QR-V™ Global Verification Network — Canonical Production Sitemap

**Effective:** 2026-09-17  
**Canonical platform:** https://qrv.network  
**Canonical API/data plane:** https://api.qrv.network

This repository implements the human-facing QR-V platform. The canonical route inventory is machine-readable in `config/routes.manifest.json`.

## Production rule

QR-V uses two runtime boundaries only:

1. `qrv.network` — human-facing platform and application workflows.
2. `api.qrv.network` — trusted API, registry, cryptographic, audit, persistence and machine-integration boundary.

Legacy QR-V service hostnames are compatibility entry points and must not become competing production applications.

## Header contract

Primary navigation is fixed to:

`Products · Solutions · Developers · Documentation · Pricing · About`

Prominent actions are:

`Verify Record · Issuer Login · Get Started`

## Tiering

Tier 1 is the release-critical surface and includes the homepage, verification, issuer onboarding/dashboard/records, registry, developers, docs, products, pricing, security, status, support and legal.

Tier 2 adds complete product/solution/developer/protocol/issuer-management/analytics/API-key/webhook/enterprise surfaces.

Tier 3 adds deeper educational and resource content.

A route's presence in the sitemap does **not** mean the capability is operational. Product claims are controlled by implementation status and live acceptance.

## Compatibility redirects

- `verify.qrv.network` → `qrv.network/verify`
- `registry.qrv.network` → `qrv.network/registry`
- `issuer.qrv.network` → `qrv.network/issuer`
- `docs.qrv.network` → `qrv.network/docs`
- `developers.qrv.network` → `qrv.network/developers`
- `explorer.qrv.network` → `qrv.network/explorer`

Enable permanent redirects only after canonical route parity and production acceptance are verified.

## API authority

Human-facing API documentation may appear under `qrv.network/docs` and `qrv.network/api-reference`, but the normative API contract is the OpenAPI specification maintained in `ohi-stack/qrv-api`.

Do not maintain a competing manually-authored API contract.
