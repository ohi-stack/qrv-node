# October 11, 2026 — QR-V Live Acceptance Triage

**Evidence:** [QR-V Live Production Acceptance run 38116011165](https://github.com/ohi-stack/qrv-node/actions/runs/38116011165) at `813d2cb87f9d3fbf65bcac0b622814d8ce8ad45f`. Production CI findings tracked separately in [issue #49](https://github.com/ohi-stack/qrv-node/issues/49).

**Classification:** Live acceptance FAILED, not production accepted. Do not infer root-cause certainty from HTTP status alone.

| Check | Observed | Classification / first action |
|---|---|---|
| `platform-ready` | 503 vs expected 200 | Downstream API readiness unavailable; this is safe fail-closed behavior, investigate API before platform change |
| `api-health`, `api-ready`, `api-version` | 200 text/html, expected JSON | Incorrect API hostname app/proxy mapping is likely. Compare deployed Hostinger app, domain, and qrv-api JSON route definitions; do not accept HTML as JSON |
| `api-status` | 404 HTML | Determine whether wrong backend target or missing `/api/v1/status` implementation |
| `api-verify-demo` | 404 HTML vs expected 200 VERIFIED JSON | Wrong app/route or missing canonical demo fixture; verify API mapping, contract then DB seed evidence, not a fake static fixture |
| `api-verify-unknown` | 404 HTML vs required JSON NOT_FOUND | Route contract/MIME mismatch; keep true missing-record 404 semantics |
| `api-verify-malformed` | 404 HTML vs expected 422 JSON INVALID_QRVID | Validation/route contract mismatch or wrong upstream |
| `platform-verify-demo` | 200 HTML with marker | **Potential false positive** if no matching authoritative API JSON; inspect server response provenance and make independent lifecycle proof mandatory |
| `legacy-verify-redirect` | network fetch failed | DNS/Hostinger binding/308 redirect not verified; retain old printed-link compatibility as release gate |

## Exact correction ownership

1. **Hostinger operations / DevOps:** inspect `api.qrv.network` domain app mapping and proxy. Map to production `ohi-stack/qrv-api` version serving the agreed JSON contract; do not point it at issuer/login or SPA. Confirm paths with curl including `Content-Type`, `Location` and deployed revision.
2. **API owner:** check actual qrv-api branch/migration/route status. Implement missing JSON routes only if truly absent; reconcile status/error contract against `scripts/live-acceptance.mjs` rather than changing expectations without review.
3. **Data/security:** validate connection to canonical PostgreSQL; prove a real demo record if required; rotate/activate Ed25519 keys per governed key lifecycle and verify signature, issuer, revocation and audit.
4. **Platform owner:** after API health restored, re-run `/readyz`; preserve 503 when unready. Inspect the platform's public VERIFIED state to ensure no upstream failure can be mislabeled VERIFIED.
5. **DNS/compatibility owner:** restore `verify.qrv.network` compatibility and prove HTTP 308 with QRVID deep-link preservation only after canonical verification is live.
6. **Dependency remediation:** resolve the four high-severity Firebase/Firestore chain findings through compatible dependency/lockfile changes with audit, Google login, sessions, routing and lifecycle regression tests. Do not `npm audit fix --force` or disable the gate.

## Reproduction and regression

```bash
curl -si https://api.qrv.network/healthz
curl -si https://api.qrv.network/readyz
curl -si https://api.qrv.network/version
curl -si https://api.qrv.network/api/v1/status
curl -si https://api.qrv.network/api/v1/verify/QRV-PROD-CERT-000001
curl -si https://qrv.network/readyz
curl -sSI https://qrv.network/verify/QRV-PROD-CERT-000001
npm run validate:prod
npm audit --omit=dev --audit-level=high
npm run acceptance:live
```

Do not send issuer credentials or test live mutations without approved test-issuer setup. All HTTP checks above are read-only. Captured live logs require careful PII/secret redaction. The published `npm run acceptance:live` is a read-only smoke and does **not** replace the approved PostgreSQL issue→revoke lifecycle acceptance run.

## Exit criteria

- Correct platform/API Hostinger SHA and mappings documented.
- JSON API health/readiness/status/verification responses conform to approved qrv-api contract.
- Real canonical QRVID returns VERIFIED and, after authorized revocation, the same QRVID returns REVOKED with audit.
- Negative/expiry/invalid signature/privacy/unauthorized/network failure scenarios pass.
- Legacy 308 hostname deep links pass; npm audit and exact-head CI pass.
- Independent QA and human release owner authorize deployment and record rollback evidence.

**Status until then:** BLOCKED.
