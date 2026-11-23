---
name: cabloy-suite-import
description: Use this skill when a user wants to bring a Cabloy Basic or Cabloy Start suite source bundle into the current same-edition project, place source/spec/E2E resources in their conventional locations, or merge an existing suite resource with incoming work. Trigger for importing a .cabloy-suite ZIP, reviewing an import plan, or resolving source-bundle conflicts. Prefer it when the task is a bounded same-edition suite import, not a framework upgrade, generated contract synchronization, product ZIP extraction, database migration, or arbitrary repository overwrite. Never use it to bypass conflicts or import secrets, runtime state, generated artifacts, or lockfiles.
---

# Cabloy Suite Import

Treat a suite ZIP as untrusted source input. Validate and preview it before any destination write.

## Required flow

1. Detect the current edition and stop unless exactly Cabloy Basic or exactly Cabloy Start is present. Require the bundle edition to match the destination edition; cross-edition conversion is not supported.
2. Inspect the archive, manifest, ownership declarations, checksums, limits, and suite identity.
3. Run a dry-run merge plan from a Git project root. The default command never writes.
4. Present the baseline source and digest, incoming digest, and `ADD`, `UNCHANGED`, `UPDATE`, `LOCAL-ONLY`, `MERGED`, `CONFLICT`, and `BINARY-CONFLICT` results.
5. Obtain explicit approval before rerunning with `--apply`.
6. Validate the destination's authoritative root and `zova/package.original.json` script surfaces before any write. Stop without partial writes on any security, ownership, edition, task-precondition, or unresolved conflict error.
7. Show the typed post-import task plan and require a separate explicit approval before execution. `--apply` changes source only; `--run-post-import` is required to run the allowlisted plan and is rejected without `--apply`.
8. After execution, report completed/current/pending tasks and failures. Do not claim acceptance from import or generated output alone.

## Command

```bash
npm run cabloy-suite-import -- ./artifacts/<suite>.zip --dry-run
npm run cabloy-suite-import -- ./artifacts/<suite>.zip --apply
npm run cabloy-suite-import -- ./artifacts/<suite>.zip --apply --run-post-import
```

The importer stages and validates archive contents, rejects traversal/absolute/backslash paths, duplicate entries, symlinks/special entries, nested archives, oversized or suspicious ZIPs, checksum mismatches, generated/project-owned/shared resources, and edition or suite mismatches. It never edits workspace manifests, lockfiles, `.zova-rest`, copied build artifacts, environment files, or databases.

## Merge policy

A successful source apply stores the original incoming ZIP and its SHA-256 in the destination Git worktree's private metadata, keyed by edition and suite. Use the stored ZIP's original `payload/` as the next `base`, not the merged worktree. Never substitute a Git revision, the publisher's latest previous release, or a version 2 ZIP's embedded `base/`. Dry runs, unresolved conflicts, and failed source writes do not advance the baseline. Post-import task failures do not undo a successful source apply or its baseline.

Without a baseline for a path, add absent files and leave identical files unchanged. Different existing files conflict. Otherwise use a three-way comparison of the last imported payload, the destination file, and the new payload. Both sides changing a binary file conflicts. A local deletion is preserved if upstream did not change the file and conflicts if upstream changed it. Missing incoming paths do not delete or rename files.

For a project without saved state, `--baseline <previous.zip>` is only for the exact, trusted release known to have been imported. Confirm its provenance and compare the reported SHA-256 to the trusted release record when available. This flag is only an input to the merge; the new snapshot is recorded only after `--apply` succeeds. Do not use it to override saved state or resolve a conflict by treating the incoming release as the previous one. Do not mix unrelated products with the same edition and suite identifier; this local workflow does not bind a Store product identity.

Resolve conflicts with the user and rerun the dry run. Keep the worktree stable during apply; after an interrupted apply, inspect the source and any preserved staging backups before retrying.

## Handoff and exclusions

- Package dependency and lifecycle changes remain at the suite/module package boundary.
- Regenerate derived output through the active Basic or Start manifests and the contract-loop rules; do not import generated output. The typed post-import plan resolves commands from the destination and never executes archive-provided shell text.
- The execution order is SSR registration (when applicable), Vona metadata, Zova metadata, `deps:zova`, affected OpenAPI SDKs, paired SSR/REST builds, `deps:vona`, and specification charts last when all required inputs are present. The importer does not install dependencies, initialize/reset/seed databases, mutate environment files, restart services, or commit/push.
- A successful source import is not acceptance evidence. Run the affected focused tests and record their evidence separately.
- Route framework upgrade requests to `scripts/upgrade.ts`, backend/frontend contract drift to `cabloy-contract-loop`, and private product ZIP delivery to the commerce workflow.

## Response pattern

Report the validated edition and suite, sorted merge plan, typed task plan, blockers/conflicts, files changed (if `--apply` was approved), and post-import task results. If the ZIP is malformed, unsafe, cross-edition, ambiguous, or conflicts with local work, stop and leave the destination unchanged.
