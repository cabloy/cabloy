---
name: cabloy-suite-pack
description: Use this skill when a user explicitly wants to package one Cabloy Basic or Cabloy Start business suite's authored source, specification records, or selected E2E validation into a deterministic source ZIP for another compatible project. Trigger for suite-source export, suite bundle creation, or reducing a large business ZIP to a source transfer. Prefer it when the task is a bounded same-edition suite transfer, not a framework upgrade, contract regeneration, product ZIP delivery, or whole-repository snapshot. Do not use it to package secrets, runtime data, generated artifacts, lockfiles, or uploaded business payloads.
---

# Cabloy Suite Pack

Create a source bundle only after the user identifies the suite and explicitly requests the pack operation.

## Safety boundary

1. Detect the repository marker before making edition-sensitive assumptions. Support exactly one unambiguous Cabloy Basic or Cabloy Start project, and record the edition in the bundle. A bundle may only be imported into the same edition.
2. Require one suite identifier and an explicit local output path. Do not infer "all suites".
3. Preview the selected backend/frontend suite roots and any explicitly declared `repo-specs` or `repo-e2e` paths.
4. Exclude environment files, credentials, tokens, cookies, local state, databases, runtime archives, generated outputs, lockfiles, and dependency installations.
5. Do not upload the resulting ZIP. Report its local repository-relative path and checksum.

## Command

```bash
npm run cabloy-suite-pack -- \
  --suite <suite-id> \
  --out <local-output.zip> \
  [--include-spec repo-specs/<suite-id>/...] \
  [--include-e2e repo-e2e/specs/<file>]
```

Use `--dry-run` to inspect the selected resources without writing the archive. The tool writes a version 3 `.cabloy-suite/` bundle containing the current `payload/`, manifest, checksums, dependencies, ownership metadata, and a typed post-import task handoff. Do not select a base commit or previous release: the destination uses its own last successful import as the merge ancestor. The same ZIP can be used by destinations upgrading from different releases.

The handoff is derived from the active Basic or Start manifests and SSR declarations; it is not an authority to execute arbitrary commands. It records the ordered typed work: SSR registration when applicable, Vona/Zova metadata, `deps:zova`, affected OpenAPI SDKs, paired SSR/REST builds, `deps:vona`, and `spec:charts` only when the canonical inputs are present.

## Boundaries and handoff

- Suite and module `package.json` files remain the dependency authority; workspace manifests and lockfiles are not bundle authority.
- Generated REST/SSR/build output is reported as a regeneration requirement rather than copied.
- Route backend/frontend contract drift to `cabloy-contract-loop`.
- Route framework baseline changes to `scripts/upgrade.ts`.
- Route paid/private product ZIP delivery to the commerce workflow.
- A successful pack proves only archive creation, not implementation, acceptance, or E2E validation.

## Response pattern

Report the edition and suite, selected resources, excluded/generated resources, archive path, checksum/size, and the ordered typed post-import task plan. The plan covers metadata, dependency synchronization, OpenAPI SDK generation, paired SSR/REST builds, and spec charts when applicable. If edition detection, path validation, or scope is ambiguous, stop without creating an archive.
