# QR-V™ Multi-Agent Production Engineering Program

**Effective:** 2026-09-17  
**Release authority:** qrv-node#7  
**Control-plane integration:** qrv-node#29  
**Production blocker:** qrv-node#14

## Purpose

This document defines how human operators, ACC, Codex-class builder agents, independent reviewer agents, GitHub CI, and live acceptance testing cooperate to build and release QR-V™.

It does not modify QRVP-1 or QVS-1.0 and does not create a new QR-V production runtime node.

## Canonical runtime boundary

- `https://qrv.network` — public/browser application
- `https://api.qrv.network` — trusted JSON API and data boundary
- PostgreSQL — canonical writable registry

Legacy QR-V hostnames are compatibility aliases only after the release gate passes.

## Execution loop

1. Human authority defines a goal.
2. ACC records the goal, constraints, dependencies, and release class.
3. ACC maps the goal to a bounded GitHub issue.
4. A builder agent implements only the approved scope.
5. The builder opens a PR with tests, documentation, migration notes, rollback notes, and acceptance evidence.
6. An independent reviewer checks protocol drift, authorization, tenant isolation, cryptography, database safety, idempotency, secret exposure, API drift, accessibility, and failure behavior.
7. Exact-head CI must pass.
8. Human approval is required.
9. Deployment occurs in the release-authorized order.
10. Live acceptance evidence is attached to the release issue and ACC run record.

## Agent authority boundaries

### Builder agents

May:
- modify code within an assigned issue
- create tests and documentation
- create versioned migrations
- open and update PRs

May not:
- redefine QRVP-1/QVS-1.0 semantics
- merge or deploy around failed release gates
- expose secrets
- self-approve production
- introduce additional production runtime hostnames

### Reviewer agents

Review:
- QRVP-1/QVS-1.0 conformance
- authentication and RBAC
- issuer/tenant isolation
- Ed25519 key lifecycle
- database and migration safety
- concurrency and idempotency
- API/OpenAPI consistency
- secret handling
- accessibility and UX failure states
- deployment, rollback, and disaster behavior

Reviewer conclusions are advisory. CI, human approval, and live acceptance remain authoritative.

## Required task contract

Each ACC-dispatched task must include:

- repository and issue
- objective
- non-goals
- authoritative references
- dependencies
- modules/files in scope
- required tests
- security requirements
- acceptance criteria
- migration requirements
- rollback requirements
- prohibited changes

## Evidence record

Each completed task should retain:

- GitHub issue
- branch
- PR
- commit SHA
- CI run
- reviewer report
- human approval
- deployment/release identifier
- live acceptance result
- rollback result where exercised

## Production waves

### Wave 0 — release acceptance
Close qrv-node#14 with live proof of:
`CREATE → QRVID → VERIFIED → revoke → REVOKED → audit`.

### Wave 1 — trust/API foundation
Complete qrv-api#16 and qrv-api#6:
organizations, users, service accounts, scoped credentials, tenant isolation, RBAC, Ed25519 key lifecycle, audit attribution.

### Wave 2 — people/company product
Complete qrv-node#26:
onboarding, issuer workspace, certificate lifecycle, team management, API access, billing visibility, admin, support.

### Wave 3 — developer platform
Complete qrv-sdk#1 and OpenAPI-aligned developer experience.

### Wave 4 — agent interoperability
Complete qrv-agent-demos#2 and machine-readable conformance fixtures.

### Wave 5 — commercial provisioning
Enable Stripe entitlement provisioning only after the core lifecycle release gate passes.

### Wave 6 — issuer adoption
Run founding issuer pilots and then external issuer onboarding.

## Release invariant

The number of repositories, PRs, or generated lines of code is not evidence of production readiness.

QR-V is production-ready only when the complete live system passes the acceptance matrix defined in qrv-node#7.
