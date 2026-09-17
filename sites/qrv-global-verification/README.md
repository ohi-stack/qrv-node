# QR-V™ Sites Source Provenance

This directory preserves provenance for the QR-V™ ChatGPT Sites project `qrv-global-verification` after consolidation into the canonical `ohi-stack/qrv-node` repository.

## Current direction

```text
QR-V Sites design/content source
          ↓
qrv-marketing-site migration source
          ↓
ohi-stack/qrv-node
canonical qrv.network platform source + runtime
```

The Sites-derived React visual system is maintained under `src/web/`. Server-side trust behavior remains in the Express platform runtime and the `api.qrv.network` backend.

## Visual convergence — September 17, 2026

The canonical `src/web/` frontend now carries the current public QR-V Sites identity:

- official QR-V logo on the white/light header;
- desktop navigation plus mobile hamburger navigation;
- dark navy/black grid system;
- oversized white verification-focused typography;
- cyan verification CTA treatment;
- green issuer/status CTA treatment;
- PUBLIC LAUNCH / QRVP-1 / QVS-1.0 status row;
- SHA-256 active, Ed25519 pending, Canonical JSON, and TLS 1.3 badges;
- animated network beams, glowing nodes, and scanning-card treatment;
- live public record card for `QRV-PROD-CERT-000001`;
- mobile-first layout matching the Sites presentation;
- platform, issuer, solution, developer, standard, pricing, founder, and verification marketing sections.

The live public record card is fail-safe: it only renders `VERIFIED` when the QR-V verification API actually returns `VERIFIED`. A page render alone is never treated as proof.

## Public design baseline

- QR-V identity in the header
- responsive navigation / mega-menu-ready IA
- verification-focused hero
- network visual treatment
- Verify and Become an Issuer conversion actions
- protocol, registry, use-case, developer, pricing and documentation sections
- responsive mobile presentation from the same source revision

## Security rule

Never commit database URLs, signing private keys, JWT/session secrets, Stripe secret keys, issuer API secrets, Hostinger credentials, or private registry credentials with public site source.

## Migration policy

`qrv-marketing-site` remains available as historical/migration source until every unique source, SEO, content-strategy and Sites-provenance artifact is classified as migrated, merged, superseded, preserved as reference, or intentionally retired.
