# QR-V™ Sites Source

This directory is the GitHub landing area for the QR-V™ ChatGPT Sites project named:

```text
qrv-global-verification
```

## Direction

```text
QR-V Network in ChatGPT Sites
          ↓
site files / exported source / assets
          ↓
ohi-stack/qrv-marketing-site
```

The intent is to keep the public QR-V website source in one GitHub repository so desktop and mobile cannot drift between independent codebases.

## What belongs here

When the Sites project source is available, preserve and commit:

```text
pages/
components/
layouts/
styles/
assets/
animations/
content/
public/
site.config.*
```

If the Sites export uses a different framework structure, preserve that structure first. Refactoring should happen in a separate reviewed change after the source has been captured faithfully.

## Do not put secrets here

Never commit:

- database URLs
- signing private keys
- JWT secrets
- Stripe secret keys
- issuer API secrets
- Hostinger credentials
- private registry credentials

Use repository or deployment environment variables instead.

## Public design baseline

The current public design direction includes:

- QR-V logo in the header
- responsive navigation / mega menu
- light-header presentation where used by the current Sites design
- strong verification-focused hero
- QR-V network animation / visual representation in hero sections
- Verify and Become an Issuer conversion actions
- public protocol, registry, use-case, developer, pricing, and documentation sections
- responsive mobile presentation derived from the same source as desktop

## Runtime boundary

The site source lives here. Server-side QR-V behavior can remain implemented in:

```text
ohi-stack/qrv-node
ohi-stack/qrv-api
```

The public design should not be independently re-authored in those repositories. Instead, public site changes should originate from `qrv-marketing-site` and be integrated into runtime as a controlled build/deployment step.
