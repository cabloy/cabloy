---
name: cabloy-worktree-environment
description: This skill must be used only when the user explicitly invokes /cabloy-worktree-environment or explicitly asks to perform the named Cabloy worktree-environment setup. It configures a confirmation-gated, worktree-local isolated runtime environment for a linked Cabloy Basic Git worktree. Do not use it merely because a request mentions worktrees, parallel work, ports, development, tests, or E2E; route those requests to cabloy-workflow for read-only guidance instead.
---

# Cabloy Worktree Environment

Use this skill only for the explicit, user-controlled setup of local runtime isolation in an already-created linked Git worktree.

## Goals

1. validate that the current checkout is a linked Cabloy Basic worktree before any write
2. preserve the canonical public environment recipe and the current worktree's effective env precedence
3. require user-chosen runtime identity and ports rather than allocating values automatically
4. edit only ignored `.env.local` files in the current worktree after explicit confirmation
5. keep `npm run init` a separate, opt-in decision

## Step 1: Validate the current checkout

Before asking for configuration values or proposing a write:

1. resolve the current Git top-level directory
2. verify that it is registered by `git worktree list --porcelain`
3. verify that it is a linked worktree rather than the primary checkout; do not treat worktree-list membership alone as sufficient
4. detect the edition marker at that resolved root
5. verify that `vona/env/` and `zova/env/` exist

Interpretation:

- `__CABLOY_BASIC__` present -> continue with the Cabloy Basic workflow
- `__CABLOY_START__` present -> stop without edits; inspect the active Start repository's current scripts, flavors, and environment files before designing a Start-specific workflow
- neither marker present -> stop without edits and ask the user before making edition-specific assumptions
- primary checkout, unregistered root, or missing environment directories -> stop without edits and explain that this skill only configures an already-created linked worktree

Read [Parallel Worktree Environment](../../../cabloy-docs/fullstack/parallel-worktree-environment.md) as the canonical Cabloy Basic recipe. Do not change committed base defaults, including `vona/env/.env` and `zova/env/.env`.

## Step 2: Inspect effective local override paths

Inspect only files inside the validated current worktree:

- `vona/env/.env.local`
- applicable `vona/env/.env*.local` files
- `zova/env/.env.local`
- applicable `zova/env/.env*.local` files

Determine the applicable Vona/Zova flavor and mode before deciding whether a file is more specific. The dotenv loader permits applicable, more-specific `.env.*.local` files to override broad `.env.local` values.

For the keys this skill manages, report the effective precedence chain and only the relevant values:

- `APP_NAME`
- `SERVER_LISTEN_PORT`
- `API_BASE_URL`
- `SSR_API_BASE_URL`
- `DEV_SERVER_PORT`
- `MOCK_BUILD_PORT`

`DEV_SERVER_HMR_PORT` and `SSR_PROD_PORT` appear in the base environment, but this workflow must verify a current runtime consumer before treating either as an isolating listener setting. Do not write or validate either variable merely because it is declared in an env file.

Do not display unrelated local configuration or secrets. If a more-specific local file would override a key that the proposed broad `.env.local` write cannot affect, stop and ask the user whether they want to reconcile that specific override. Do not silently write an ineffective broad override. If a target `.env.local` has duplicate definitions for a managed key, stop and ask the user to resolve the ambiguity.

## Step 3: Collect an explicit configuration choice

Ask which processes the user intends to isolate. Do not choose an `APP_NAME` or ports automatically, including by selecting the next apparently free port.

Required settings by selected process:

| Selected process | Required settings |
| --- | --- |
| Vona development, ordinary tests, or managed clean E2E | Shared `APP_NAME` and Vona `SERVER_LISTEN_PORT` |
| One Zova Admin or Web development process | The same `APP_NAME`, `API_BASE_URL`, and `DEV_SERVER_PORT` |
| Concurrent Zova Admin and Web development processes | The same `APP_NAME` and `API_BASE_URL`, plus separate flavor-specific local overrides with distinct `DEV_SERVER_PORT` values |
| Standalone mock-build | `MOCK_BUILD_PORT`, only when selected |
| SSR preview | Inspect the selected preview entrypoint and isolate every listener it starts; current preview scripts also start `dist-mock`, so require `MOCK_BUILD_PORT` when it is consumed |

Require the user to provide and explicitly confirm:

1. one non-empty, unique `APP_NAME`
2. integer TCP ports from 1 through 65535 for all selected processes
3. no duplicate selected ports
4. when Zova is selected, an `API_BASE_URL` that targets the selected local Vona port

The broad `zova/env/.env.local` supports one active Zova flavor at a time. When the user needs Admin and Web development concurrently in the same worktree, inspect the exact active flavor metadata and use the applicable flavor-specific local override paths to give each process a distinct `DEV_SERVER_PORT`; do not put both ports in broad `.env.local` or claim that one port supports both processes.

You may inspect listening ports and existing sibling-worktree overrides as a collision snapshot, but state clearly that this does not reserve a port and never replace the user's choice. Keep `SSR_API_BASE_URL` inherited from `API_BASE_URL` in the normal baseline. Add a local `SSR_API_BASE_URL` only when an applicable more-specific override changes the inheritance and the user explicitly confirms the required value.

A unique `APP_NAME` isolates ordinary framework-managed test database names and framework Redis prefixes. It does not isolate explicitly named databases, unprefixed custom Redis keys, mail, payment, webhook, object-storage, or other external services. Ask for an explicit isolation design before claiming that any of those resources are isolated.

## Step 4: Preview and confirm the write

Before making any edit:

1. show a redacted, file-by-file preview of the exact managed assignments to add or update
2. state the selected processes and the exact `APP_NAME`/port tuple
3. run one independent `git check-ignore -v -- "$target"` command for every exact proposed target path, including flavor-specific local files, and require each command to succeed with a matching ignore rule; stop without writes if any target is tracked or not ignored
4. recheck current root, linked-worktree identity, edition, precedence, duplicate keys, selected port validity, and listener snapshots
5. ask for a final affirmative confirmation that includes the selected identity and port tuple

Do not treat silence as confirmation.

## Step 5: Apply only local worktree overrides

Only after the final confirmation:

1. immediately re-run one independent `git check-ignore -v -- "$target"` command for every exact target path and abort without writes unless each command succeeds with a matching ignore rule
2. snapshot the exact pre-write content and existence state of every target before writing any file
3. update `vona/env/.env.local` when Vona is selected
4. update `zova/env/.env.local` for a single selected Zova flavor or a selected standalone mock-build process
5. for concurrent Zova flavors, update only the applicable flavor-specific local override files identified in Step 3
6. preserve unrelated comments, settings, and credentials in each file
7. update only targeted assignments; do not replace an entire env file

Never:

- edit another worktree
- edit a more-specific override as an implicit side effect
- edit committed `.env` defaults
- add mock ports unless the user selected a process that consumes them
- claim that `DEV_SERVER_HMR_PORT` or `SSR_PROD_PORT` isolates a listener without verifying a current runtime consumer
- generate values or write configuration merely to bypass a busy shared resource

If any write cannot complete, restore every target already changed to its exact pre-write content. Remove every target file that did not exist before the operation. Report the failure rather than leaving a partial configuration.

## Step 6: Revalidate and offer initialization separately

After writing, re-read the targeted local files and confirm:

- Vona and Zova use the same `APP_NAME` when Zova is selected
- `API_BASE_URL` targets the selected Vona port
- selected ports are distinct
- no applicable more-specific local file masks a required assignment
- optional mock settings exist only for selected processes that consume them
- concurrent Zova flavors use distinct effective `DEV_SERVER_PORT` values from their applicable flavor-specific local overrides

Report the files changed and distinguish path-local generated/runtime/build/coverage isolation from any external resources that remain shared.

Then ask exactly:

> The local environment overrides are configured. Do you want to run `npm run init` now?

Do not run it without an affirmative answer. Explain that `npm run init` is not an environment allocator: it installs dependencies, runs generation/build-related work, and rewrites the base `APP_NAME` in `vona/env/.env` and `zova/env/.env`.

## Verification

Use focused checks appropriate to the selected workflows:

```bash
git worktree list --porcelain
git rev-parse --show-toplevel
for target in vona/env/.env.local zova/env/.env.local; do
  git check-ignore -v -- "$target" || exit 1
done
# Run the same one-target-at-a-time check for every proposed flavor-specific local target.
```

Check selected listener ports before startup, then use only the selected commands:

```bash
npm run dev
npm run dev:zova:admin
npm run dev:zova:web
npm run test
npm run test:e2e:basic:clean
```

Finish by checking that shared defaults remain untouched:

```bash
git diff -- vona/env/.env zova/env/.env
git status --short
```

## Response pattern

When this skill completes a stage, report:

1. validated worktree root and detected edition
2. selected processes and redacted effective identity/ports
3. applicable local-override precedence or conflicts
4. exact files proposed or changed
5. external resources that still require separate isolation
6. the separate `npm run init` question only after successful local setup
