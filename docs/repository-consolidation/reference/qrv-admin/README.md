# QR-V™ Admin — Commercial Operations Control Plane

The administrative control plane is a private module of the canonical QR-V™ platform. It is not a separate public node.

## Canonical route

```text
https://qrv.network/admin
```

`/admin` must remain private, authenticated, role-restricted, excluded from ordinary public navigation, and blocked from search indexing.

## Runtime boundary

```text
qrv.network/admin
  ↓ server-side authorized requests
api.qrv.network/api/v1/admin/*
  ↓
PostgreSQL / audit / billing metadata
```

The browser must never receive database credentials, platform write secrets, payment-provider secrets, or unrestricted administrative API keys.

## 30-day operating objective

QR-V is now in commercial validation. The Admin Dashboard must optimize for the Verified Certificate Pilot and the first paying third-party issuers.

Primary commercial target:

```text
3–5 paying issuers
$4,500–$15,000+ implementation revenue
$897–$1,495+ contracted MRR
500+ production records
```

Do not treat website traffic, speculative features, or protocol-page count as primary operating KPIs.

## Admin Dashboard v1

### Executive scorecard

Display these cards first:

- Paying Issuers
- Active Pilot Issuers
- Implementation Revenue
- Contracted MRR
- Production Records
- Verifications — 24h / 7d / 30d
- Revocations
- Expired Records
- API Calls
- Failed / Suspicious Verification Events

### Revenue Pipeline

Track:

- qualified prospects;
- demos scheduled;
- demos completed;
- proposals sent;
- pilots awaiting payment;
- implementations in progress;
- paid issuers live;
- churned / suspended issuers.

Recommended 30-day funnel benchmark:

```text
100 qualified prospects
→ 10+ demos
→ 5+ proposals
→ 3+ paying issuers minimum
```

### Issuer Operations

For each issuer show:

- issuer name and ID;
- approval state;
- plan / commercial package;
- billing state;
- implementation status;
- active record count;
- total verification count;
- revoked / expired count;
- last issuance;
- last verification;
- API key status;
- Ed25519 signing status;
- support / risk flags.

Admin actions may include approve, suspend, reactivate, rotate API credentials, inspect records, review revocations, and open audit history. Every privileged action must be audited.

### Record Operations

Provide filters for:

- VERIFIED
- REVOKED
- EXPIRED
- NOT_FOUND investigations
- record type
- issuer
- issue date
- expiration date
- signature state
- verification volume

The canonical registry state must come from `api.qrv.network`; WordPress or public-platform caches must never become the source of truth.

### Verification Operations

Show:

- total verification requests;
- successful VERIFIED responses;
- REVOKED responses;
- EXPIRED responses;
- NOT_FOUND responses;
- signature failures;
- hash integrity failures;
- latency;
- top verified records;
- top issuers by verification volume;
- suspicious request spikes.

### Security / Production Gate

The dashboard must expose the production-readiness state of:

- SHA-256 integrity validation;
- Ed25519 issuer signing;
- issuer authentication;
- revocation workflow;
- audit logging;
- rate limiting;
- database readiness;
- API readiness;
- payment / entitlement provisioning.

Ed25519 must not be shown as active until generation, issuer key management, signature persistence, and verification are operational end-to-end.

## Admin scope

- issuer approvals and suspension;
- issuer onboarding status;
- record audits;
- revocation review;
- issuer/API key lifecycle;
- verification/network metrics;
- revenue and account metrics;
- suspicious record investigation;
- support escalations;
- billing/account cross-checks;
- production gate monitoring;
- commercial pipeline oversight.

## Required before activation

1. Individual administrator authentication.
2. MFA for privileged accounts.
3. Role-based authorization.
4. Admin audit logs.
5. CSRF protection for browser mutations.
6. Session rotation and revocation.
7. Rate limiting and security headers.
8. Explicit admin API authorization on `api.qrv.network`.
9. No administrative secrets in browser-readable configuration.
10. `robots.txt` / indexing exclusion.
11. Server-side entitlement and billing reads.
12. Fail-closed behavior when admin authorization or upstream registry dependencies are unavailable.

## Deferred from the 30-day sprint

Do not make the Admin Dashboard dependent on:

- a mobile scanner app;
- blockchain registry migration;
- wallet infrastructure;
- federated nodes;
- multi-region replication;
- separate explorer/docs/developer deployments.

## Definition of Done

Admin Dashboard v1 is commercially useful when an authorized administrator can:

```text
see prospect → demo → proposal → paid issuer status
see implementation revenue + MRR
approve an issuer
observe issuer issuance
inspect a production QR-V record
observe public verification activity
review/revoke a record
confirm the same record resolves REVOKED publicly
review audit history
see signing/security readiness
```

## Repository status

This repository remains the canonical administrative source module and requirements record for `qrv.network/admin`. Production implementation belongs in the consolidated QR-V platform and API boundary, not as an independent public deployment.
