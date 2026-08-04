---
name: cabloy-worktree-environment
description: This Cabloy Basic-hosted skill must be used only when the user explicitly invokes /cabloy-worktree-environment or explicitly asks to perform the named Cabloy worktree-environment setup. It defines a confirmation-gated, worktree-local isolated runtime environment for a linked Cabloy Basic worktree and for Cabloy Start after this skill is synchronized there. Do not use it merely because a request mentions worktrees, parallel work, ports, development, tests, or E2E; route those requests to cabloy-workflow for read-only guidance instead.
---

# Cabloy Worktree Environment

Use this skill only for the explicit, user-controlled setup of local runtime isolation in an already-created linked Git worktree.

## Goals

1. validate that the current checkout is a linked Cabloy Basic or Cabloy Start worktree before any write
2. preserve the shared canonical environment recipe and the current worktree's effective env precedence
3. require user-chosen runtime identity and ports rather than allocating values automatically
4. write only `vona/env/.env.local` and `zova/env/.env.local` in the current worktree after explicit confirmation
5. allow one Zova development flavor, Admin or Web, per worktree
6. keep `npm run init` a separate, opt-in decision

## Step 1: Validate the current checkout and edition

Before asking for configuration values or proposing a write:

1. resolve the current Git top-level directory
2. verify that it is registered by `git worktree list --porcelain`
3. verify that it is a linked worktree rather than the primary checkout; do not treat worktree-list membership alone as sufficient
4. detect the edition marker at that resolved root
5. verify that `vona/env/`, `zova/env/`, and the required root scripts exist

Interpretation:

| Marker | Edition | Managed clean E2E command |
| --- | --- | --- |
| `__CABLOY_BASIC__` only | Cabloy Basic | `npm run test:e2e:basic:clean` |
| `__CABLOY_START__` only | Cabloy Start | `npm run test:e2e:start:clean` |

Stop without edits when both markers are present, neither marker is present, the checkout is primary/unregistered, required environment directories are missing, or the selected edition's required scripts are unavailable.

Read [Parallel Worktree Environment](../../../cabloy-docs/fullstack/parallel-worktree-environment.md) as the canonical shared recipe. Edition detection chooses the active command names and labels; it does not change the two-file isolation model. Do not change committed base defaults, including `vona/env/.env` and `zova/env/.env`.

## Step 2: Inspect local override precedence

The only files this skill may create or change are:

- `vona/env/.env.local`
- `zova/env/.env.local`

Inspect applicable `.env.*.local` files inside the validated current worktree only to determine whether they mask a managed broad setting. Do not create, modify, remove, or suggest reconciling those specific local files through this skill.

For managed keys, report only the effective precedence and relevant values:

- `APP_NAME`
- `SERVER_LISTEN_PORT`
- `API_BASE_URL`
- `SSR_API_BASE_URL`
- `DEV_SERVER_PORT`
- `MOCK_BUILD_PORT`
- `SSR_PROD_PORT`, only after verifying that the selected preview entrypoint consumes it

Do not display unrelated local configuration or secrets. If an applicable specific local file masks a managed value in broad `.env.local`, stop without proposing a write. Explain that the broad two-file workflow cannot be effective until that conflict is resolved outside this skill or a clean linked worktree is used.

If either permitted broad target contains duplicate definitions for a managed key, stop and ask the user to resolve the ambiguity.

`DEV_SERVER_HMR_PORT` is not a managed setting. Do not request, write, or validate it unless a future source inspection confirms an active runtime listener consumer.

## Step 3: Collect an explicit configuration choice

Ask which processes the user intends to isolate. Do not choose an `APP_NAME` or ports automatically, including by selecting the next apparently free port.

A worktree may select one Zova development process: Admin **or** Web. If the user requests both, stop before collecting values or proposing files. Explain that the second frontend flavor needs a separately configured linked worktree; do not offer a flavor-specific local override as a workaround.

Required settings by selected process:

| Selected process | Required settings |
| --- | --- |
| Vona development, ordinary tests, or managed clean E2E | Shared `APP_NAME` and Vona `SERVER_LISTEN_PORT` |
| One Zova Admin or Web development process | The same `APP_NAME`, `API_BASE_URL`, and `DEV_SERVER_PORT` |
| Standalone mock-build | `MOCK_BUILD_PORT`, only when selected |
| SSR preview | Inspect the selected preview entrypoint and require every verified listener it starts; current preview scripts also start `dist-mock`, so require `MOCK_BUILD_PORT` when it is consumed |

Require the user to provide and explicitly confirm:

1. one non-empty, unique `APP_NAME`
2. integer TCP ports from 1 through 65535 for all selected listeners
3. no duplicate selected listener ports
4. when Zova is selected, an `API_BASE_URL` that targets the selected local Vona port

You may inspect listening ports and existing sibling-worktree broad overrides as a collision snapshot, but state clearly that this does not reserve a port and never replace the user's choice. Keep `SSR_API_BASE_URL` inherited from `API_BASE_URL` in the normal baseline. Add a local `SSR_API_BASE_URL` only after verifying the selected runtime requires an explicit value and no applicable specific local file masks it.

A unique `APP_NAME` isolates ordinary framework-managed test database names and framework Redis prefixes. It does not isolate explicitly named databases, unprefixed custom Redis keys, mail, payment, webhook, object-storage, or other external services. Ask for an explicit isolation design before claiming that any of those resources are isolated.

## Step 4: Preview and confirm the write

Before making any edit:

1. show a redacted, file-by-file preview of the exact managed assignments to add or update
2. state the selected processes and the exact `APP_NAME`/port tuple
3. run one independent `git check-ignore -v -- "$target"` command for every proposed permitted target and require each command to succeed with a matching ignore rule
4. recheck current root, linked-worktree identity, edition, precedence, duplicate keys, selected port validity, and listener snapshots
5. ask for a final affirmative confirmation that includes the selected identity and port tuple

Do not treat silence as confirmation.

## Step 5: Apply only broad local overrides

Only after the final confirmation:

1. immediately re-run one independent `git check-ignore -v -- "$target"` command for every proposed target and abort unless each command succeeds with a matching ignore rule
2. snapshot the exact pre-write content and existence state of every target before writing any file
3. update `vona/env/.env.local` when Vona is selected
4. update `zova/env/.env.local` when a selected Zova, mock-build, or preview process requires its settings
5. preserve unrelated comments, settings, and credentials in each file
6. update only targeted assignments; do not replace an entire env file

Never:

- edit another worktree
- create, modify, or remove a flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` file
- edit committed `.env` defaults
- add mock or preview listener settings unless the selected entrypoint consumes them
- generate values or write configuration merely to bypass a busy shared resource

If any write cannot complete, restore every target already changed to its exact pre-write content. Remove every target file that did not exist before the operation. Report the failure rather than leaving a partial configuration.

## Step 6: Revalidate and offer initialization separately

After writing, re-read the targeted local files and confirm:

- Vona and Zova use the same `APP_NAME` when Zova is selected
- `API_BASE_URL` targets the selected Vona port
- selected listener ports are distinct
- no applicable specific local file masks a required broad assignment
- mock and preview values exist only for selected runtime entrypoints
- the selected edition's development and managed clean-E2E commands still exist

Report the files changed and distinguish path-local generated/runtime/build/coverage isolation from external resources that remain shared.

Then ask exactly:

> The local environment overrides are configured. Do you want to run `npm run init` now?

Do not run it without an affirmative answer. Explain that `npm run init` is not an environment allocator: it installs dependencies, runs generation/build-related work, and rewrites the base `APP_NAME` in `vona/env/.env` and `zova/env/.env`.

## Verification

Use focused checks appropriate to the detected edition and selected processes:

```bash
git worktree list --porcelain
git rev-parse --show-toplevel
for target in vona/env/.env.local zova/env/.env.local; do
  git check-ignore -v -- "$target" || exit 1
done
```

Run one selected frontend command, not both:

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
4. exact broad local files proposed or changed
5. external resources that still require separate isolation
6. the separate `npm run init` question only after successful local setup
