# QR-V™ Multi-Builder Node Development Environment

## Purpose

QR-V uses one canonical production repository while allowing ChatGPT Sites and Google AI Studio to work independently on the same application.

This avoids competing production origins and gives each builder a controlled lane with its own local Node/Vite ports, Git branch, CI validation, and integration path.

## Canonical architecture

```text
                    ohi-stack/qrv-node
                           main
                            │
              ┌─────────────┴─────────────┐
              │                           │
    work/chatgpt-sites         work/google-ai-studio
              │                           │
              └─────────────┬─────────────┘
                            │
              integration/multi-builder
                            │
                            ▼
                           main
                            │
                            ▼
                    https://qrv.network
                            │
                            ▼
              https://api.qrv.network/api/v1
```

`main` remains the only production branch.

## Local development lanes

| Lane | Branch | Frontend | Node/Express |
|---|---|---:|---:|
| ChatGPT Sites | `work/chatgpt-sites` | `3101` | `3201` |
| Google AI Studio | `work/google-ai-studio` | `3102` | `3202` |
| Integration | `integration/multi-builder` | `3103` | `3203` |

Run one lane with:

```bash
npm install
npm run dev:chatgpt
```

or:

```bash
npm run dev:aistudio
```

or:

```bash
npm run dev:integration
```

Each command starts:

1. the Express platform runtime on the lane's Node port;
2. the Vite frontend on the lane's web port;
3. Vite proxying for Express-owned operational routes.

The development API defaults to a closed local target (`127.0.0.1:3999`) unless `QRV_DEV_API_BASE_URL` is explicitly set. This prevents an experimental lane from accidentally mutating production.

## Vite/Express boundary

The Vite preview proxies these route families to the lane's Express process:

```text
/api
/verify
/issuer
/registry
/healthz
/health
/readyz
/version
/metrics
/qr
/explorer
/status
/robots.txt
/sitemap.xml
/site.webmanifest
```

Everything else is available to the React development server for customer-facing UI work.

This mirrors the production runtime boundary already enforced by `qrv-node`.

## ChatGPT Sites lane

Use `work/chatgpt-sites` for customer experience work.

Preferred work:

- homepage and public page design;
- navigation and mega menus;
- responsive/mobile behavior;
- visual system and animations;
- product, solution, developer, documentation, pricing and company pages;
- accessibility;
- public SEO presentation;
- conversion UX.

ChatGPT Sites should not redefine verification states, issuer authorization, signing rules, registry authority, or API semantics.

### Recommended workflow

```bash
git switch work/chatgpt-sites
git pull
npm install
npm run dev:chatgpt
```

Commit completed work to `work/chatgpt-sites`, then open a PR into `integration/multi-builder`.

## Google AI Studio lane

Google AI Studio supports importing an existing GitHub repository and two-way GitHub synchronization for web applications. Use `work/google-ai-studio` as the isolated development lane for AI Studio work.

Preferred work:

- full-stack feature prototypes;
- Gemini-assisted QR-V features;
- developer utilities;
- interactive data views;
- workflow experiments;
- server-side integrations that benefit from Node/npm;
- experimental tools for issuers or developers.

Do not place a Gemini key in browser code or committed environment files. Keep experimental AI keys in AI Studio's server-side secret facility.

### Recommended workflow

1. Import or connect `ohi-stack/qrv-node` in Google AI Studio.
2. Work against the Google AI Studio lane rather than production.
3. Pull current upstream changes before starting a new task.
4. Keep changes scoped to the requested feature.
5. Push changes for review rather than publishing a competing production deployment.
6. Merge approved work into `integration/multi-builder`.

If the AI Studio GitHub synchronization UI does not allow selecting the intended branch for a particular project, use a dedicated non-production mirror/fork tied to `work/google-ai-studio`, then submit the resulting changes back to the canonical repository by PR. Do not connect AI Studio directly to a production deployment simply to work around branch limitations.

## Integration lane

`integration/multi-builder` is where overlapping work is reconciled.

Use it to:

- resolve conflicts between ChatGPT Sites and AI Studio changes;
- normalize shared components;
- verify API and route assumptions;
- run full production validation;
- create the release candidate for `main`.

Before promotion to `main`:

```bash
npm install
npm run check:lanes
npm run validate:prod
```

## Recommended local Git worktrees

A solo operator can keep all three lanes open simultaneously without repeatedly switching branches:

```bash
git clone https://github.com/ohi-stack/qrv-node.git qrv-node
cd qrv-node

git worktree add ../qrv-chatgpt-sites work/chatgpt-sites
git worktree add ../qrv-google-ai-studio work/google-ai-studio
git worktree add ../qrv-integration integration/multi-builder
```

Result:

```text
qrv-node/                 main / production source
qrv-chatgpt-sites/        ChatGPT Sites workspace
qrv-google-ai-studio/     Google AI Studio workspace
qrv-integration/          reconciliation workspace
```

The three Node/Vite port pairs can run simultaneously.

## Production promotion

No builder pushes directly to production.

```text
ChatGPT Sites ─┐
               ├─> integration/multi-builder
Google AI ─────┘             │
                             ▼
                     npm run validate:prod
                             │
                             ▼
                            main
                             │
                             ▼
                      Hostinger build
                             │
                             ▼
                       qrv.network
```

After production deployment, run live QR-V acceptance:

```text
issuer login
→ create record
→ QRVID
→ QR
→ VERIFIED
→ revoke
→ REVOKED
→ audit events present
```

## Non-negotiable trust boundary

Neither ChatGPT Sites nor Google AI Studio is the source of verification truth.

The production trust chain remains:

```text
qrv.network
    ↓
api.qrv.network/api/v1
    ↓
canonical registry
```

Experimental AI functionality may assist users and developers, but it must not override deterministic QRVP-1 / QVS-1.0 verification outcomes.
