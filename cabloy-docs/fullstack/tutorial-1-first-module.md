# Tutorial 1: Create Your First Module

<Badge type="info" text="Basic" />

This tutorial starts the **Student Training Center** story by creating the first backend and frontend module skeleton.

## Goal

By the end of this tutorial, you will understand:

- when to use Vona and when to use Zova
- how to discover the right CLI family before creating files
- how a Cabloy business capability starts as a module on both sides of the stack

## Why start with a module

In Cabloy, a module is the natural unit for evolving business code, metadata, generated assets, and docs.

Before you create CRUD, API contracts, field rendering, or schema-driven UI, first create the module boundary that will own that work.

## Copy-first command block

If you want the shortest possible start, copy and run these commands from the repo root:

```bash
npm run vona :create:module demo-student
npm run zova :create:module demo-student
```

Then inspect these files first:

- `vona/src/module/demo-student/src/index.ts`
- `vona/src/module/demo-student/src/.metadata/index.ts`
- `zova/src/module/demo-student/src/index.ts`
- `zova/src/module/demo-student/src/.metadata/index.ts`

## Before you run commands

Work from the repo root, not from `vona/` or `zova/` directly.

If you want the shortest discovery pass first, run:

```bash
npm run vona :
npm run zova :
```

Then narrow into the `create` family.

## Step 1: Inspect the CLI surface first

Run these commands from the repo root:

```bash
npm run vona :create
npm run zova :create
```

This confirms that Cabloy already has generator families for both sides of the stack.

If you want the exact command shape before running it, inspect help or the command registry.

Authoritative command shapes in this repo:

```bash
npm run vona :create:module moduleName -- [--suite=] [--force]
npm run zova :create:module moduleName -- [--suite=] [--force]
```

## Step 2: Create the backend module with Vona

Example:

```bash
npm run vona :create:module demo-student
```

If your workflow needs a specific suite, pass `--suite=...`.
If you are not sure which suite to use yet, start with the simplest command and let the CLI prompt or command help guide you.

## Step 3: Create the frontend module with Zova

Example:

```bash
npm run zova :create:module demo-student
```

On the frontend side, projects often care more explicitly about suite placement, so your repo may ask for or prefer a `suite` value.

## Step 4: Inspect the generated structure before editing

After both generators run, inspect the generated structure before making heavy changes.

In this repo, the matching example module roots can take one of two common shapes:

- backend: `vona/src/module/<module>/`
- frontend without suite placement: `zova/src/module/<module>/`
- frontend with suite placement: `zova/src/suite/<suite>/modules/<module>/`

The current public Student example uses:

- `vona/src/module/demo-student/`
- `zova/src/module/demo-student/`

A newly created backend module will later grow into the business thread used in the next tutorials.
A newly created frontend module may start much smaller, which is normal.

Typical backend concerns include:

- module entry surface
- metadata and locale assets
- package and index surfaces

Typical frontend concerns include:

- module entry surface
- generated metadata and exports
- module ownership and package surface

A good beginner rule is: do not rush into editing business logic until you can explain which files were created and why.

## Expected result after this tutorial

At the end of this tutorial, you should at least be able to point to two module roots:

- backend module root, usually `vona/src/module/<module>/`
- frontend module root, either `zova/src/module/<module>/` or `zova/src/suite/<suite>/modules/<module>/`

In the current public repo, the frontend Student example uses this minimal starter shape:

- `zova/src/module/demo-student/package.json`
- `zova/src/module/demo-student/src/index.ts`
- `zova/src/module/demo-student/src/.metadata/index.ts`

That minimal shape is enough for Tutorial 2, where the backend CRUD thread becomes the first rich business surface.

## Step 5: Compare the result with the existing Student example

If you want a concrete reference after generation, compare your result with the existing Student example in this repo.

Representative source anchors:

- `vona/src/module/demo-student/`
- `zova/src/module/demo-student/`
- `zova/src/suite/a-home/modules/home-api/`

Do not copy those folders blindly. Use them to understand the expected module shape, suite placement, and naming style.

## Checkpoint

Before moving to the next tutorial, make sure you can answer these questions:

1. which side of the stack owns backend module generation?
2. which side owns frontend module generation?
3. what module name are you using for the Student Training Center example?
4. which generated module roots will later hold CRUD, render resources, and SDK-related work?

## Why this matters for the next tutorials

These module skeletons give you the ownership boundary for everything else in the series:

- the `student` CRUD thread
- the `level` field render resource
- the `mobile` field contract story
- the generated frontend SDK slice for student-facing APIs

Without the module boundary, the rest of the tutorial series becomes less realistic.

## Read together with

- [Fullstack CLI](/fullstack/cli)
- [CLI Reference](/reference/cli-reference)
- [Backend Quickstart](/backend/quickstart)
- [Frontend Quickstart](/frontend/quickstart)

## Next step

Continue to [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud).