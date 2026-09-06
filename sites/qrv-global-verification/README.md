# QR-V™ Sites Source Provenance

This directory preserves the source provenance for the QR-V™ ChatGPT Sites project:

```text
qrv-global-verification
```

## Consolidated direction

The original public-site source was maintained in:

```text
ohi-stack/qrv-marketing-site
```

The canonical production repository is now:

```text
ohi-stack/qrv-node
```

The migration path is therefore:

```text
QR-V ChatGPT Sites
        ↓
qrv-marketing-site
        ↓ controlled frontend migration
qrv-node
        ↓
https://qrv.network
```

`qrv-node` preserves the production Express runtime while building the customer-facing Sites/React presentation layer from `web/`.

## Visual baseline carried forward

The public QR-V design direction includes:

- QR-V identity in the header;
- six-item primary navigation;
- verification and issuer conversion actions;
- responsive desktop/mobile presentation from one source revision;
- verification-focused hero messaging;
- network/registry visual language;
- protocol, registry, use-case, developer, pricing, security, and documentation pathways;
- strong contrast, premium dark-blue surfaces, gold action accents, cyan network accents, and accessible typography.

Where an original Sites asset is not present in the GitHub source, it must not be represented as already migrated. Missing logo variants, animation assets, or other exported media should be added only when the actual source asset is available or a separately reviewed replacement is created.

## Runtime boundary

Server-side QR-V behavior remains authoritative in:

```text
ohi-stack/qrv-node
ohi-stack/qrv-api
```

The browser bundle must never contain database URLs, signing private keys, issuer secrets, Hostinger credentials, payment-provider secrets, or privileged API credentials.
