# QR-V Platform Operations

## Objectives

- Browser platform availability objective: 99.9% monthly after the production baseline is established.
- Public page p95 response objective: under 1 second at the platform boundary, excluding the user's network.
- Verification requests use a bounded upstream timeout and must show UNAVAILABLE rather than a verification claim when the API cannot be trusted.

These are operating objectives, not current performance claims.

## Monitoring

Monitor `/healthz` for process reachability and `/readyz` for issuer configuration plus API readiness. Monitor the end-to-end path separately with a known, non-sensitive record. Alert on readiness failure, 5xx growth, login throttling growth, API timeouts, and failed live acceptance.

The public `/status` page reports API readiness, not health alone. Incident history and external status-provider integration remain release work.

## Release record

Retain the platform commit, API commit, deploy time, operator, environment key names installed, health/readiness output, live acceptance output, accessibility result, legacy-redirect decision, and rollback endpoint. Do not record secret values.
