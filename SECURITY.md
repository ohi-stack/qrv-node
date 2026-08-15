# QR-V Platform Security Policy

Report suspected vulnerabilities through GitHub private vulnerability reporting. Do not place credentials, personal data, signing material, or exploit details in a public issue.

## Boundary

- Browser users interact only with `qrv.network`.
- `qrv.network` calls `api.qrv.network` from the server side.
- The write credential, issuer portal password verifier, and session secret must never be delivered to browser JavaScript or committed to GitHub.
- The platform must not present VERIFIED unless the API returns VERIFIED and both integrity checks are true.
- Issuer mutations require an authenticated signed session and CSRF validation.

TLS, host secrets, WAF policy, alerting, backup, database controls, and incident coordination are external deployment responsibilities and must pass the release runbook.
