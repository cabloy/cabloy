# SSR Build and Deploy Guide

This guide explains the public SSR build and deploy workflow in Zova within the Cabloy monorepo.

## Why this page exists

The other SSR pages explain architecture, behavior, and troubleshooting.

This page answers a more operational question:

- how do you build and package SSR output correctly for Cabloy?

That matters because Cabloy SSR is a fullstack workflow, not only a frontend build command.

A complete SSR deployment path usually needs all of these pieces to stay aligned:

- the correct frontend SSR flavor build
- any related REST/type generation steps used by the target workflow
- the backend runtime that consumes the built frontend output
- environment/config choices that differ between dev and prod

## Start from the shared root scripts

In Cabloy Basic, the root `package.json` is the first workflow surface.

Representative current root scripts include:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build:zova:admin
npm run build:zova:web
npm run build
```

A practical rule is:

1. start from the root wrapper when the normal repo workflow already covers your need
2. drop into deeper Zova flavor-specific scripts only when you need tighter control or debugging detail

Read together with:

- [Repo Scripts](/reference/repo-scripts)
- [Frontend Scripts](/frontend/scripts)
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

## Detect the edition first

Before documenting or automating SSR build commands, detect the active edition.

In the current public repo:

- `__CABLOY_BASIC__` means Cabloy Basic
- current public root wrappers target Basic-specific flavors such as `cabloyBasicAdmin` and `cabloyBasicWeb`

For Cabloy Start:

- the same high-level SSR workflow still applies
- but flavor names, site baselines, assets, and project paths can differ
- do not reuse Basic flavor examples blindly in Start-specific documentation or automation

## Two common workflow levels

### Level 1: root-wrapper workflow

Use this when you want the standard Cabloy Basic monorepo workflow.

Representative commands:

```bash
npm run dev:zova:admin
npm run dev:zova:web
npm run build:zova
npm run build
```

Practical interpretation:

- `dev:zova:*` is for normal frontend SSR development entry
- `build:zova` builds frontend SSR output in batch mode
- `build:zova:admin` and `build:zova:web` are explicit root-wrapper paths for flavor-specific SSR output plus related REST generation
- `build` is the fullstack alignment path when frontend and backend output should move together

### Level 2: flavor-specific Zova workflow

Use this when you need appMode/flavor detail explicitly.

Representative current Basic examples include:

```bash
cd zova && npm run dev:ssr:cabloyBasicAdmin
cd zova && npm run dev:ssr:cabloyBasicWeb
cd zova && npm run build:ssr:cabloyBasicAdmin
cd zova && npm run build:ssr:cabloyBasicWeb
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

This level is useful when you need to separate:

- admin vs web
- SSR output vs REST/type output
- root-wrapper behavior vs lower-level flavor behavior

## Development workflow

A normal SSR development workflow in Cabloy Basic is:

```bash
npm run dev:zova:admin
```

or:

```bash
npm run dev:zova:web
```

Use this when the task is:

- page development
- route debugging
- SSR UI iteration
- hydration behavior review

If you need deeper script control or need to verify the exact Zova flavor path, inspect the flavor-specific scripts described in [Frontend Scripts](/frontend/scripts).

## Build workflow

### Build frontend SSR output only

Use this when you need the frontend SSR artifacts refreshed but do not yet need the full backend build flow.

Representative current Basic command:

```bash
npm run build:zova
```

This is the first useful step when:

- frontend SSR code changed
- static assets or SSR bundle output need regeneration
- you want to distinguish frontend build problems from backend runtime problems

### Build the fullstack output together

Use this when frontend SSR output and backend runtime should be aligned in one workflow.

Representative current root command:

```bash
npm run build
```

In the current repo, this means:

- build Zova SSR output first
- then build Vona

This is the safer default when a change crosses the frontend/backend SSR boundary.

## Where REST/type generation fits

Some workflows need more than SSR HTML output alone.

In current Basic examples, there are separate REST/type generation commands such as:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

Treat these deliberately.

Use them when the workflow depends on generated contract-aligned frontend surfaces in addition to SSR bundle output.

Do **not** assume every SSR-only change needs manual extra regeneration, but do verify whether your target workflow depends on these generated artifacts.

## Dev vs prod mindset

A frequent SSR mistake is assuming that “works in dev” means “ready for deploy.”

Dev and prod can differ in important ways:

- dev may proxy through a frontend dev server
- prod depends on built SSR output and built client assets
- asset path assumptions can differ after build
- runtime env/config choices can differ between dev and prod

That is why SSR deployment work should always include both:

1. the build step
2. a targeted verification pass against built behavior

Read together with:

- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)
- [Environment and Config Guide](/frontend/environment-config-guide)

## Practical deployment checklist

Use this checklist before treating an SSR build as deploy-ready.

### 1. confirm the target edition and flavor

Ask:

- am I in Cabloy Basic or Cabloy Start?
- is this admin or web?
- am I using the correct SSR flavor for that target?

### 2. confirm the intended workflow level

Ask:

- is the root wrapper enough?
- do I need the lower-level Zova flavor script for this task?
- does the workflow also depend on REST/type generation?

### 3. rebuild the relevant frontend SSR output

Use the narrowest meaningful build first.

Typical options:

- `npm run build:zova`
- targeted `build:ssr:*` commands inside `zova`

### 4. align backend and frontend when the change crosses the boundary

If the change affects the integrated SSR runtime path, prefer:

```bash
npm run build
```

That reduces the chance of testing stale frontend output against newer backend code or the reverse.

### 5. verify built behavior, not only dev behavior

At minimum, re-check:

- the expected page loads through SSR
- client assets load correctly
- hydration behaves as expected
- no edition-specific UI/theme assumption breaks the real target flavor

## Common deployment mistakes

### Mistake 1: only testing dev mode

Dev success does not prove that the built SSR bundle and built client assets are correct.

### Mistake 2: building the wrong flavor

A command can succeed while still producing output for the wrong target.

Always confirm whether the target is:

- Basic vs Start
- admin vs web
- root-wrapper path vs direct flavor script

### Mistake 3: forgetting the fullstack boundary

If the issue appears only after frontend/backend integration, a frontend-only build check may be insufficient.

Use the fullstack build path when the change crosses the SSR boundary.

### Mistake 4: assuming deploy problems are page-logic problems

Some SSR deploy failures come from stale output, missing assets, wrong flavor selection, or env/config mismatch before they come from page logic itself.

## How this guide relates to other SSR docs

Use these pages together:

- [SSR Overview](/frontend/ssr-overview) for the baseline SSR feature model
- [SSR Architecture Overview](/frontend/ssr-architecture-overview) for the fullstack mental model
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide) for symptom-based diagnosis
- [Frontend Scripts](/frontend/scripts) for script lookup
- [Environment and Config Guide](/frontend/environment-config-guide) for runtime/config selection
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration) for the monorepo integration model

## Recommended reading order

If you are deploying or packaging SSR behavior, use this path:

1. this page for build/deploy workflow
2. [Frontend Scripts](/frontend/scripts)
3. [Environment and Config Guide](/frontend/environment-config-guide)
4. [SSR Architecture Overview](/frontend/ssr-architecture-overview)
5. [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)
6. [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

## Implementation checks for SSR build/deploy changes

Before finalizing an SSR build/deploy change, ask:

1. did I detect the correct edition and target flavor first?
2. did I choose the right workflow level: root wrapper or lower-level flavor script?
3. did I rebuild the relevant frontend SSR output?
4. if the change crosses the frontend/backend SSR boundary, did I verify the aligned fullstack build path?
5. did I verify built behavior rather than relying only on dev behavior?

That keeps SSR deployment guidance aligned with the real Cabloy monorepo workflow rather than with generic frontend-only assumptions.