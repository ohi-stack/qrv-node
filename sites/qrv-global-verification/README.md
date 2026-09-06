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

The Sites-derived React visual system is maintained under `src/web/`. Server-side trust behavior remains in the Express platform runtime and `api.qrv.network` backend.

## Public design baseline

- QR-V identity in the header
- responsive navigation / mega-menu-ready IA
- verification-focused hero
- network visual treatment
- Verify and Become an Issuer conversion actions
- protocol, registry, use-case, developer, pricing and documentation sections
- responsive mobile presentation from the same source revision

## Security rule

Never commit database URLs, signing private keys, JWT/session secrets, Stripe secret keys, issuer API secrets, Hostinger credentials or private registry credentials with public site source.

## Migration policy

`qrv-marketing-site` remains available as historical/migration source until every unique source, SEO, content-strategy and Sites-provenance artifact is classified as migrated, merged, superseded, preserved as reference or intentionally retired.
