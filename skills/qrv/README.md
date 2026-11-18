# QR-V™ Production Engineering Skills

Canonical manifest: [manifest.json](manifest.json). Codex-compatible local skills live in [`.agents/skills/`](../../.agents/skills). These are **specifications**, not evidence of deployment or production acceptance.

| ID | Priority | Skill | Primary repository |
|---|---|---|---|
| QRV-01 | P0 | [qrv-production-failure-investigator](../../.agents/skills/qrv-production-failure-investigator/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-02 | P0 | [qrv-platform-architecture-engineer](../../.agents/skills/qrv-platform-architecture-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-03 | P0 | [qrv-postgresql-registry-engineer](../../.agents/skills/qrv-postgresql-registry-engineer/SKILL.md) | `ohi-stack/qrv-api` |
| QRV-04 | P0 | [qrv-verification-protocol-engineer](../../.agents/skills/qrv-verification-protocol-engineer/SKILL.md) | `ohi-stack/qrv-api` |
| QRV-05 | P0 | [qrv-cryptographic-security-engineer](../../.agents/skills/qrv-cryptographic-security-engineer/SKILL.md) | `ohi-stack/qrv-api` |
| QRV-06 | P0 | [qrv-issuer-portal-engineer](../../.agents/skills/qrv-issuer-portal-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-07 | P1 | [qrv-wallet-credential-engineer](../../.agents/skills/qrv-wallet-credential-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-08 | P1 | [qrv-api-sdk-engineer](../../.agents/skills/qrv-api-sdk-engineer/SKILL.md) | `ohi-stack/qrv-api` |
| QRV-09 | P1 | [qrv-automated-qa-engineer](../../.agents/skills/qrv-automated-qa-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-10 | P1 | [qrv-devops-release-engineer](../../.agents/skills/qrv-devops-release-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-11 | P2 | [qrv-commercial-platform-engineer](../../.agents/skills/qrv-commercial-platform-engineer/SKILL.md) | `ohi-stack/qrv-node` |
| QRV-12 | P2 | [qrv-documentation-standards-engineer](../../.agents/skills/qrv-documentation-standards-engineer/SKILL.md) | `ohi-stack/qrv-node` |

## Dispatch and trust

ACC / Codex may assign a skill by ID to a specific issue and immutable commit SHA. The primary repository determines where implementation belongs; this `qrv-node` manifest coordinates work and does **not** move qrv-api's privileged responsibilities into the public platform. Human release approval remains mandatory.

Mandatory response schema: `status`, `owner`, `repository`, `branch/PR`, `dependency`, `evidence`, `blocker`, `next_action`. Valid statuses: NOT_STARTED, IN_PROGRESS, BLOCKED, READY_FOR_REVIEW, PASSED, FAILED, COMPLETE. Never mark COMPLETE without evidence.

Start with QRV-01, QRV-03, QRV-04, QRV-05, QRV-06 and QRV-09; unblock live JSON API routing, production auth, PostgreSQL record lifecycle, Ed25519/key states, and dependency security before commercialization. QRV-07 Wallet is a P0 customer workflow in the larger platform program, though it is P1 in this skill-delivery order; it may not claim local cached status as truth.

## Local checks

```bash
npm run check:skills
npm run validate:prod
npm audit --omit=dev --audit-level=high
npm run acceptance:live # only against approved live environment
```

See [production release gates](../../docs/PRODUCTION_SKILLS_AND_RELEASE_GATES.md) for acceptance criteria.
