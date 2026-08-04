---
name: cabloy-worktree-environment
description: This skill must be used only when the user explicitly invokes /cabloy-worktree-environment or explicitly asks to perform the named Cabloy worktree-environment setup. It prepares a confirmation-gated, worktree-local Vona and Zova runtime environment for a linked Cabloy Basic or Cabloy Start Git worktree using Git metadata and fixed port baselines only. Do not use it merely because a request mentions worktrees, parallel work, ports, development, tests, or E2E; route those requests to cabloy-workflow for read-only guidance instead.
---

# Cabloy Worktree Environment

Use this skill only for explicit, user-controlled setup of the standard local runtime environment in an already-created linked Git worktree.

## Goals

1. validate that the current checkout is a linked Cabloy Basic or Cabloy Start worktree before any write
2. generate a deterministic, secret-safe core environment tuple from Git worktree metadata and fixed port baselines
3. never read, parse, source, expand, display, log, or send `.env*` file contents to the model
4. write only a new or empty `vona/env/.env.local` and `zova/env/.env.local` in the current worktree after explicit confirmation
5. keep Admin and Web as alternative runtime commands that share one generated Zova configuration
6. keep `npm run init` a separate, opt-in decision

## Step 1: Validate the current checkout and edition

Before proposing configuration values or writing files:

1. resolve the current absolute Git top-level directory
2. run `git worktree list --porcelain -z` and parse its NUL-delimited records without shell word splitting
3. verify that the current root is registered
4. compare absolute `git-dir` and `git-common-dir`; equal paths identify the primary checkout, which this skill must reject
5. detect exactly one edition marker at the resolved root
6. verify that `vona/env/`, `zova/env/`, and the required root scripts exist

Interpretation:

| Marker | Edition | Managed clean E2E command |
| --- | --- | --- |
| `__CABLOY_BASIC__` only | Cabloy Basic | `npm run test:e2e:basic:clean` |
| `__CABLOY_START__` only | Cabloy Start | `npm run test:e2e:start:clean` |

Stop without edits when both markers are present, neither marker is present, the checkout is primary/unregistered, required environment directories are missing, or the selected edition's required scripts are unavailable.

Read [Parallel Worktree Environment](../../../cabloy-docs/fullstack/parallel-worktree-environment.md) as the canonical shared recipe. Edition detection chooses command names and labels; it does not change the two-file environment model. Never change committed defaults, including `vona/env/.env` and `zova/env/.env`.

## Step 2: Generate the standard environment recommendation

After validation, immediately generate the standard core tuple. Do not ask which processes the user intends to run and do not ask them to select Admin or Web.

For user-facing summaries, write exactly:

> 环境隔离信息：Vona 开发 + Zova 开发

Admin and Web use this same Zova environment. The user may later run either frontend command, but must not run both concurrently in one worktree. Use another linked worktree for concurrent development of the other flavor. Do not create a flavor-specific local override.

### Secret-safe input boundary

Recommendation generation uses Git worktree metadata and the fixed constants below only. It must not inspect any `.env`, `.env.local`, `.env.*.local`, sibling worktree configuration, process environment, listener table, `lsof` output, process command line, or external service. Do not use `Read`, `cat`, `grep`, `source`, `dotenv`, `printenv`, `env`, or diagnostics that expose env-file content for this workflow.

This means the proposal is deterministic convenience, not a live port reservation. If an application later reports a port collision, the user may say **“再换一批”** before setup or create another linked worktree; the actual application bind remains authoritative.

### Deterministic proposal

Treat the primary checkout as ordinal `0`. From the validated `git worktree list --porcelain -z` order, assign each linked worktree the next ordinal: the first linked worktree is `1`, the second is `2`, and so on. Let `batch` be `0` for the first proposal, and increase it only when the user says **“再换一批”**.

Use one shared offset for every generated listener:

```text
offset = linkedWorktreeOrdinal + batch
```

Use these fixed baseline ports, which match the committed Cabloy defaults:

| Setting | Baseline | Recommended value |
| --- | ---: | --- |
| `SERVER_LISTEN_PORT` | `7102` | `7102 + offset` |
| `DEV_SERVER_PORT` | `9000` | `9000 + offset` |
| `DEV_SERVER_HMR_PORT` | `24679` | `24679 + offset` |

Set `APP_NAME` to the basename of the validated current worktree root. Do not inspect other worktrees’ configurations or append an env-derived suffix. Stop if that basename is empty or cannot be used as an application name without altering it; ask the user to rename/recreate the linked worktree instead.

Always recommend both local files:

```dotenv
# vona/env/.env.local
APP_NAME = <worktree-basename>
SERVER_LISTEN_PORT = <7102 + offset>
```

```dotenv
# zova/env/.env.local
APP_NAME = <worktree-basename>
API_BASE_URL = http://localhost:<recommended SERVER_LISTEN_PORT>
DEV_SERVER_PORT = <9000 + offset>
DEV_SERVER_HMR_PORT = <24679 + offset>
```

All generated listener ports must be integers from `1` through `65535` and distinct within the tuple. If a batch would exceed that range, stop and require a different linked-worktree arrangement.

When the user says **“再换一批”**, set `batch = batch + 1`, recompute the entire tuple, and show it again. Every recommended listener advances by exactly `+1`, and `API_BASE_URL` is regenerated from the new Vona port. Do not write during a batch change. This deterministic setup does not accept user-substituted values.

A unique `APP_NAME` separates ordinary framework-managed test database names and framework Redis prefixes. It does not isolate explicitly named databases, unprefixed custom Redis keys, mail, payment, webhooks, object storage, or other external services. Require a separate explicit design before claiming that any of those resources are isolated.

## Step 3: Preview and confirm the write

Before making any edit:

1. show `环境隔离信息：Vona 开发 + Zova 开发`, the worktree ordinal, batch, and exact non-secret identity/port tuple
2. show a file-by-file preview containing only the managed assignments that will be written to both broad local files
3. run one independent `git check-ignore -v -- "$target"` command for each target and require each command to succeed with a matching ignore rule
4. recheck current root, linked-worktree identity, edition, ordinal, generated port range, tuple uniqueness, and both target states
5. ask for a final affirmative confirmation that includes the proposed identity and port tuple

Do not treat silence as confirmation.

## Step 4: Apply only safe broad local overrides

The only files this skill may create or change are:

- `vona/env/.env.local`
- `zova/env/.env.local`

To preserve the no-env-content-disclosure boundary, inspect only each target's existence and whether it is empty; do not read its contents. If either target already exists and is non-empty, stop without reading or modifying either file. Explain that this skill deliberately will not access a pre-existing local environment file because it may contain secrets; the user must manage it outside this workflow or use a fresh linked worktree.

Only after final confirmation:

1. immediately re-run one independent `git check-ignore -v -- "$target"` command for each target and abort unless each succeeds with a matching ignore rule
2. confirm both targets are absent or empty without reading their content
3. snapshot only each target's existence and empty-file state
4. write the exact previewed Vona assignments to `vona/env/.env.local`
5. write the exact previewed Zova assignments to `zova/env/.env.local`
6. do not create, modify, remove, inspect, or recommend flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` files

Never:

- edit another worktree
- read, parse, source, expand, display, or log existing environment-file content
- edit committed `.env` defaults
- add mock, preview, or other runtime-specific listener settings through this workflow
- claim that a deterministic recommendation has allocated or reserved a port
- generate values or write configuration merely to bypass a busy shared resource

If a write cannot complete, restore each already changed target to its exact prior state: remove a newly created target or restore an originally empty target to an empty file. Report only the path and operation stage; never include environment-file content in the failure output.

## Step 5: Revalidate and offer initialization separately

After writing, verify only the known assignments that this skill generated and wrote, without re-reading any pre-existing local content. Confirm:

- the generated Vona and Zova `APP_NAME` values match
- `API_BASE_URL` targets the generated Vona port
- `SERVER_LISTEN_PORT`, `DEV_SERVER_PORT`, and `DEV_SERVER_HMR_PORT` are distinct
- both target paths and edition commands remain valid

Report only the files changed, the generated non-secret tuple, and external resources that remain shared.

Then ask exactly:

> The local environment overrides are configured. Do you want to run `npm run init` now?

Do not run it without an affirmative answer. Explain that `npm run init` is not an environment allocator: it installs dependencies, runs generation/build-related work, and rewrites the base `APP_NAME` in `vona/env/.env` and `zova/env/.env`.

## Verification

Use focused checks appropriate to the detected edition:

```bash
git worktree list --porcelain -z
git rev-parse --path-format=absolute --show-toplevel
git rev-parse --path-format=absolute --git-dir
git rev-parse --path-format=absolute --git-common-dir
for target in vona/env/.env.local zova/env/.env.local; do
  git check-ignore -v -- "$target" || exit 1
done
```

Run one frontend command, not both:

```bash
npm run dev
npm run dev:zova:admin
# or
npm run dev:zova:web
npm run test
```

Run the edition-appropriate managed clean E2E command:

```bash
# Cabloy Basic
npm run test:e2e:basic:clean

# Cabloy Start
npm run test:e2e:start:clean
```

Finish with a metadata-only status check. Do not use `git diff`, because it can print environment-file content:

```bash
git status --short
```

## Response pattern

When this skill completes a stage, report:

1. validated worktree root and detected edition
2. `环境隔离信息：Vona 开发 + Zova 开发`
3. worktree ordinal, batch, and generated non-secret identity/ports
4. both exact broad local files proposed or changed
5. the privacy boundary and external resources that still require separate isolation
6. the separate `npm run init` question only after successful local setup
