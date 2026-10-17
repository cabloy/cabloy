# WBS-MCP-20-01 application integration and type verification

## Later configuration correction (2026-10-17)

The [user-directed default-enabled correction](./default-enabled-config.md) changes module config, application config and the configuration test. This record's 11-test result and source hashes describe the earlier default-off behavior, not the current activation contract. Its registration and dependency synchronization observations remain historical evidence; fresh source checks and type/test reruns are recorded separately. The historical registration harness asserts unchanged original hashes and is intentionally not reused unchanged against the corrected source.

## Approved scope and attribution

On 2026-10-16, the user agreed to execute the recommended next step: normal application integration and the typecheck gate following the [configuration foundation](./config-foundation.md). This bounded follow-up includes canonical dependency synchronization and its incremental installation, generated registration, no-emit verification, and evidence/progress/chart updates. It does not authorize SDK/transport/AS, endpoints, schema, environment, main, commit or push operations.

Cabloy Basic; branch `worktree-spec-basic-cabloy-mcp`, base `0cdd3ae480e59ea4505b43b9de92ffdaa7240f34`. The starting dirty tree contained only the preceding attributable configuration source and evidence/progress changes. Authority remains [ADR 0001](../../decisions/0001-mcp-suite-boundaries.md), [WBS-MCP-20-01](../../pdp-wbs.md) and partial structural/configuration inputs to [ATP-MCP-OPS-02](../../test-plan.md#atp-mcp-ops-02-disablement-and-configuration-fail-closed-behavior). The predecessor documentary closures remain in [Phase 10](../phase-10/index.md). No requirement, design, WBS completion criterion or ATP procedure was changed.

[Registration output](./artifacts/integration-registration.json) retains source and generated-file SHA-256 hashes. Every authored configuration source hash matches the previous increment. HEAD alone does not reproduce this dirty source or installed state.

## Actual changes

Ran the observed root command:

```bash
npm run deps:vona
```

The existing CLI generated:

- `vona/package.json`: `vona-module-cabloy-mcp: workspace:^` application dependency;
- `vona/node_modules/vona-module-cabloy-mcp`: local workspace link to the new module;
- `vona/src/backend/typing/modules.d.ts`: module import;
- module `src/.metadata/modules.d.ts`: standard symlink to the application typing file.

These outputs were generated, not hand-edited. `vona/package.original.json` is unchanged and does not acquire a handwritten module registration. Workspace globs are unchanged. [Registration harness](./artifacts/integration-check.mjs) asserts generated dependency, actual link, application import, type symlink, actual module discovery and preservation of prior source hashes.

The root wrapper's pnpm invocation first reconciled the existing workspace; the CLI then invoked another incremental install after generating the application dependency. Both succeeded; [full synchronization log](./artifacts/integration-deps.txt) reports zero downloads, first pass `+11 -1`, then already up to date. Existing deprecated-subdependency and peer warnings remain visible. No `node_modules` deletion, dependency override, manual dependency link or SDK addition occurred.

### Lockfile attribution

`vona/pnpm-lock.yaml` changed through the canonical synchronization. [Path-redacted historical patch](./artifacts/integration-lockfile.patch) retains the entire delta except local-path substitutions described in [evidence handling](../README.md), which is **not MCP-only**:

- MCP application dependency plus suite/module workspace importers;
- existing Babel/ioredis `supports-color` peer snapshot reconciliation;
- existing generated Basic Admin/Web REST package specifiers reconciled with the installed workspace manifests, including replacement of a temporary local `zova-module-a-openapi` tarball reference with existing registry `5.1.57` resolution and related peer snapshots.

No lockfile edits were made by hand. The additional reconciliation is reported, not attributed to MCP feature implementation or silently reverted. Root lockfile and authored package original are unchanged. No frontend source, REST generation or SSR build was performed, so this is not reverse-chain SSR/REST qualification.

## Verification actually executed

Environment: Node `v24.8.0`, pnpm `11.5.2`, TypeScript `5.9.3`, existing workspace and generated REST artifacts; no database, Redis, runtime listener, SSR site, provider or credentials involved.

| Check                                                                               | Result                                                  | Artifact                                                                                                 |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Canonical dependency synchronization                                                | Exit 0                                                  | [Synchronization log](./artifacts/integration-deps.txt)                                                  |
| Installed/generated module registration                                             | Passed; actual discovery includes MCP among 111 modules | [Harness](./artifacts/integration-check.mjs), [hashes/output](./artifacts/integration-registration.json) |
| MCP source/test no-emit semantic check using its own tsconfig and generated imports | **Exit 0, no diagnostics**                              | [Module type log](./artifacts/integration-module-types.txt), final invocation below                      |
| Application source no-emit semantic check using its own tsconfig                    | **Exit 0, no diagnostics**                              | [Application type log](./artifacts/integration-application-types.txt)                                    |
| Actual configuration regressions after synchronization                              | **11 passed, 0 failed**                                 | [Test log](./artifacts/integration-config-tests.txt)                                                     |
| Narrow lint/format, authority audit and chart freshness                             | Passed                                                  | [Final static checks](./artifacts/integration-final-checks.txt); charts remain English, 0/12 verified    |

Successful type commands, from the repository root:

```bash
vona/node_modules/.bin/tsc --noEmit --composite false --incremental false -p vona/src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
vona/node_modules/.bin/tsc --noEmit --composite false --incremental false -p vona/tsconfig.json
```

These checks retain the normal project root selection and generated module imports. Flags disable inherited composite/incremental enforcement for source-only non-emitting semantics; no tsconfig was changed, files excluded, error suppressed or cast added. They are **not successful composite/declaration builds** or a full root `npm run tsc` pass.

### Failed attempts and historical evidence

The retained module type log includes the earlier failed attempts: disabling incremental alone produced TS6379 because composite remained enabled; preserving composite with temporary build info produced TS6307 for source-exporting workspace dependencies outside the module file list. The final no-emit semantic invocation above passed. These configuration/build-mode failures are not erased or relabeled as clean composite compilation.

The previous temporary all-module context's 16 baseline-identical diagnostics remain historical proof only. Its config was outside the project, with package path overrides and different automatic type-root selection. Read-only diagnosis found mixed Node declaration families consistent with the ten Node/HTTP diagnostics; this is a context explanation, not proof of one sole cause. Current installed frontend permission declarations support `mode`, unlike the six historical permission diagnostics. No unrelated source fix was made. The observed project-local checks above supersede the earlier open **normal application/source semantic check** gate, not the old artifact or every build/runtime gate.

## Result and next action

Normal generated application registration, installed local module resolution, application/MCP source semantic checks and the configuration regression gate are now complete for this finite increment. No runtime MCP capability is claimed. Full **WBS-MCP-20-01 remains `blocked`**, ATP-MCP-TRANSPORT-01 and ATP-MCP-OPS-02 remain open, and verified count remains **0/12**. Composite/declaration build, real HTTP transport, OAuth/host authority and later release evidence remain separate gates.

Next single action: scope the transport-adapter implementation candidate under accepted ADR 0002, preserving endpoint exposure and independent OAuth/host authority gates, and obtain its bounded execution approval. Do not repeat configuration/typecheck planning or return to unrelated AS refinement by default. No SDK or transport implementation is authorized by this integration result.
