# QR-V repository consolidation

Use these pinned references to review the two-node architecture and plan runtime changes. The snapshots retain upstream wording and dates. The active runtime and its validated contracts determine current behavior.

| Source | Selected material and disposition |
| --- | --- |
| [ohi-stack/qrv-admin](https://github.com/ohi-stack/qrv-admin/tree/a8a8c6065b09d52bfe13261b3fdeb6098ec6c130) | Private admin workflow. Legacy dashboard uses its own implementation and stays out of the protected Node routes. [README.md](../../docs/repository-consolidation/reference/qrv-admin/README.md) |
| [ohi-stack/qrv-agent-demos](https://github.com/ohi-stack/qrv-agent-demos/tree/1fdbbc7f48cc77a895bda7cc0ee78d43fad298d5) | Adapted the hiring-agent lookup into examples/verify-record.mjs. Legacy endpoints and automated acceptance are excluded.  |
| [ohi-stack/qrv-billing](https://github.com/ohi-stack/qrv-billing/tree/23b60932cfb150aa741b5c7e5b2e6c7ff1abcc73) | Planning reference for canonical pricing, store and billing routes. Payment activation remains separate. [PLANS.md](../../docs/repository-consolidation/reference/qrv-billing/PLANS.md) |
| [ohi-stack/qrv-developer-portal](https://github.com/ohi-stack/qrv-developer-portal/tree/469827f52a3853cbdb8d0d385220af2c3dec2071) | Replaced stale quickstart paths with the read-only example.  |
| [ohi-stack/qrv-explorer](https://github.com/ohi-stack/qrv-explorer/tree/c73d55bf03799256911fbf81158338b4094293b7) | Already routes through the canonical Node registry. Standalone server adds no required capability.  |
| [ohi-stack/qrv-marketing-site](https://github.com/ohi-stack/qrv-marketing-site/tree/b0660af958a1a3ba3be0df036e671a25ed4d5647) | Published Sites v15 source is already in sites/current-source on the builder lane.  |
| [ohi-stack/qrv-sdk](https://github.com/ohi-stack/qrv-sdk/tree/72d2bfe618b1252492ffe12825b04614fbdcaece) | Canonical endpoint convention incorporated into the read-only example.  |
| [ohi-stack/qrv-verify](https://github.com/ohi-stack/qrv-verify/tree/45b880186a1ccadd1269dda29afceedd1d053e09) | Canonical verifier already exists in Node. Standalone redirect service adds no required capability.  |
| [ohi-stack/qrv-wallet](https://github.com/ohi-stack/qrv-wallet/tree/39d18e41d10d6917bcb89d2d913b933e74a0cd5a) | Holder-workflow reference. Persistence and authorization remain open. [README.md](../../docs/repository-consolidation/reference/qrv-wallet/README.md) |
| [ohi-stack/issuer-qrv](https://github.com/ohi-stack/issuer-qrv/tree/0263e3778d49aa5446eda145f22cff8deed15c9d) | Issuer UX reference. Legacy mock data and independent auth are excluded. [qrv-ui-backend-integration-checklist.md](../../docs/repository-consolidation/reference/issuer-qrv/docs/qrv-ui-backend-integration-checklist.md) |

The API owns registry persistence and privileged operations. Node owns the public verification, registry and issuer entry points. The remaining runtime work includes issuer-scoped authorization, signature enforcement, public-field disclosure, and hosted lifecycle acceptance. See [API PR #5](https://github.com/ohi-stack/qrv-api/pull/5) and [Node PR #62](https://github.com/ohi-stack/qrv-node/pull/62).

## Read-only developer example

Run `node examples/verify-record.mjs QRV-PROD-CERT-000001` with a QRVID supplied by the issuer. Use `QRV_API_ORIGIN` to point the example at a local API. It reports the HTTP status and API-reported status. The example performs no independent cryptographic check or credential acceptance decision.
