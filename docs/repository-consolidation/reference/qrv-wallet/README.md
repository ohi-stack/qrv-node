# QR-V™ Wallet — Consolidated Module Source

Holder-facing saved-record functionality is now planned as a route inside the primary QR-V platform rather than a standalone public node.

## Canonical route

```text
https://qrv.network/wallet
```

## Purpose

The wallet module may allow authenticated users to:

- save QR-V records;
- organize credentials;
- re-verify current registry state;
- view expiration or revocation changes;
- access public-safe record references.

## Runtime architecture

```text
qrv.network/wallet
  ↓
api.qrv.network/api/v1/*
  ↓
canonical QR-V registry
```

The wallet must never become an independent source of verification truth. Every current-state assertion must resolve through the canonical API/registry.

## Repository status

Retain this repository as the wallet source module and product workspace. It is not a separate production deployment in the two-node QR-V architecture.

If `wallet.qrv.network` was ever published or reserved, treat it only as a compatibility alias to `https://qrv.network/wallet`.
