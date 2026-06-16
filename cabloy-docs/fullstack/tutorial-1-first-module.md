# Tutorial 1: Create Your First Module

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets AI create the first backend and frontend module skeleton for the **Student Training Center** story through a CLI-first workflow.

## Goal

By the end of this tutorial, you will understand:

- when to use Vona and when to use Zova
- how to inspect the CLI before creating files
- how a Cabloy business capability starts as a module on both sides of the stack

## AI Prompt

Give AI a prompt like this:

```text
Act as my Cabloy Basic pair programmer.

Task:
Create the first module for a Student Training Center example named demo-student in this monorepo.

Working rules:
1. Work from the repo root.
2. Confirm that this is Cabloy Basic before making frontend assumptions.
3. Inspect the existing Cabloy CLI first instead of inventing file placement manually.
4. Use the proper Vona command to create the backend module.
5. Use the proper Zova command to create the frontend module.
6. Prefer generated output over manual scaffolding.
7. Keep the result aligned with Cabloy Basic conventions so later tutorials can continue on top of it.

When you finish, return your answer in this format:
- Commands used
- Backend module root created
- Frontend module root created
- Key generated files
- Why each key file matters
- What I should verify next
```
Optional follow-up prompt if you need to correct the result:

```text
Do not scaffold the module manually. Inspect npm run vona :create and npm run zova :create first, then use the matching module generator commands.
```

## Why this step matters

This is the right first step because Cabloy treats the module as the unit that owns business code, metadata, generated assets, and docs.

If AI jumps directly into CRUD, contracts, or rendering before the module boundary exists, the work loses its natural owner. This step keeps the rest of the Student Training Center story aligned from the start.

## CLI commands to inspect/use

Work from the repo root, not from `vona/` or `zova/` directly.

Inspect the CLI surface first:

```bash
npm run vona :
npm run zova :

npm run vona :create
npm run zova :create
```

Representative module-generation commands:

```bash
npm run vona :create:module demo-student -- --suite=
npm run zova :create:module demo-student -- --suite=
```

Usage notes:

- use `npm run vona :create:module` for the backend module boundary
- use `npm run zova :create:module` for the frontend module boundary
- use an empty `--suite=` when you want an independent module rather than a suite-owned module
- rerun `npm run dev` after module creation so the local workflow picks up the new modules cleanly

## Generated or affected files

After both generators run, inspect the generated module roots before editing anything else.

Typical paths in this repo are:

- backend module root: `vona/src/module/<module>/`
- frontend module root without suite placement: `zova/src/module/<module>/`
- frontend module root with suite placement: `zova/src/suite/<suite>/modules/<module>/`

In this series, the target module roots are:

- `vona/src/module/demo-student/`
- `zova/src/module/demo-student/`

A minimal frontend module usually starts with files like:

- `zova/src/module/demo-student/package.json`
- `zova/src/module/demo-student/src/index.ts`
- `zova/src/module/demo-student/src/.metadata/index.ts`

## What those files mean in the business thread

At this stage, the key idea is ownership, not business logic yet.

- the backend module root is where the Student resource, entity, DTOs, controller, tests, and backend metadata will live later
- the frontend module root is where generated OpenAPI output, model helpers, render resources, and frontend metadata will live later
- the frontend `.metadata` entrypoint is part of how the module exposes its local registration surface

A good beginner rule is: do not rush into editing business logic until you can explain which module roots were created and why they will own the next tutorials.

## Verification

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. confirm that both module roots now exist
3. inspect the generated files before editing them
4. confirm that the generated module roots match the target paths for this series:
   - `vona/src/module/demo-student/`
   - `zova/src/module/demo-student/`

## Read more

- [Fullstack CLI](/fullstack/cli)
- [CLI Reference](/reference/cli-reference)
- [Backend Quickstart](/backend/quickstart)
- [Frontend Quickstart](/frontend/quickstart)

## Next step

Continue to [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud).
