# MCP test-suite consolidation

Test-only maintenance on 2026-10-20, based on `9fe5cb8f2c` plus the carried SQL-literal formatting changes. Production source, native fixture ownership/watchdog, runner, dependencies, environment configuration and historical evidence are unchanged. This record does not close an ATP, WBS, production or release gate.

## Coverage ownership

Paths below are relative to the repository root.

| Change                                                                                                                                  | Retained coverage owner                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Move all six pure ingress, body and response-gate groups out of native qualification; preserve their assertions and limits.             | [transportGuards.test.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts), with no Vona application bootstrap or listener.                                                                                                                                                                                                                                                                                 |
| Keep actual HTTP, raw router/executor, disconnect, deadline, SSE and cleanup/capacity qualification separate.                           | [qualification/transport.test.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/qualification/transport.test.ts) and the [native fixture](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/nativeTransportFixture.ts).                                                                                                                                                                                            |
| Remove direct forged/copied/foreign capability checks and nested-commit/callback/commit failure matrices from the composition suite.    | The existing [executor component suite](../../../../vona/src/suite-vendor/a-vona/modules/a-executor/test/readyExisting.test.ts) retains those matrices. The [composition suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/existingReadyBoundaryIntegration.test.ts) retains invalidation during a real read, closed authority refusal, and one asynchronous commit with pinned ALS through actual disposal and owner release. |
| Simplify the controlled transaction collaborator and remove cached reimports/metadata rereads that did not prove cold-import inertness. | The [foundation suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/requestBoundaryFoundation.test.ts) retains initializer-before-setup, actual ALS/disposal outcomes, ordinary diagnostic positive controls and no-listener/no-boundary assertions. The executor component suite owns transaction details.                                                                                                                      |
| Share event-count and UTF-8 byte-budget bookkeeping.                                                                                    | [boundedProof.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/boundedProof.ts) serves the existing three schema-specific wrappers. Each keeps its existing budget domain, output shape, validation and sink; registry/composition continue sharing their existing writer.                                                                                                                                               |

The [production-boundary suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/productionBoundary.test.ts) is unchanged, including normal-cleanup versus drain-triggered overrun checks and its static no-registration gate. Native SQLite behavior, diagnostic suppression, cancellation-not-settlement and precise owned-resource cleanup are retained. The initial consolidation did not change the native harness. The follow-up below updates only its exact entry-path references; it does not redesign ownership or requalify the expected-failure watchdog probe.

## Running the layers

Run the pure guard suite **directly** without managed databases, Redis namespaces or a Vona application. This is an optional standalone command, not a separate default test tier:

```bash
node --experimental-transform-types --test vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
```

Node v24.8.0 requires the transform flag for parameter properties in the existing transport implementation; strip-only `node --test` is insufficient.

Run native qualification alone; its dedicated-child protection intentionally requires this exact single-file selection:

```bash
SERVER_LISTEN_DISABLE=true node scripts/runIsolatedTest.ts unit src/suite/cabloy-mcp/modules/cabloy-mcp/qualification/transport.test.ts
```

Run the affected stateful regressions and their retained executor component coverage together through the root managed runner:

```bash
SERVER_LISTEN_DISABLE=true npm run test -- -- \
  vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/productionBoundary.test.ts \
  vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/requestBoundaryFoundation.test.ts \
  vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/protectedSqliteRegistry.test.ts \
  vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/existingReadyBoundaryIntegration.test.ts \
  vona/src/suite-vendor/a-vona/modules/a-executor/test/readyExisting.test.ts \
  --ci
```

The extra forwarded `--` crosses the root script's nested npm invocation. Keep explicit stateful-suite concurrency declarations; do not set `TEST_CONCURRENCY=false` or combine native qualification with other selections. The default discovery does include support files; the follow-up below verifies that broader ordinary selection.

## Initial consolidation verification (2026-10-20)

- Pure guards: **6 passed**, no failures, about 1.2 seconds including process startup. The initial strip-only attempt failed before suite execution with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`; the transform-enabled command above passed.
- Managed native qualification: **11 passed**, no failures/cancellations, producer exit 0. The six extracted tests account for the reduction from the historical 17-test native command; the native cases remain unchanged. Its 324 fixed events end in `CLOSED`, active 0.
- Combined managed boundary, foundation, registry, composition and executor regressions: **76 passed**, no failures/cancellations/skips, exit 0 (about 9.7 seconds). These include the unchanged executor component matrices that own the removed composition duplication.
- Module semantic TypeScript check (`tsc --noEmit --composite false --incremental false`): passed. Targeted lint on all eight changed/new TypeScript files and `git diff --check`: passed.
- Targeted formatting: eight paths passed (seven TypeScript files and this record). The composition file remains a formatting exception: the formatter proposes only rewriting the two carried SQL literals. Their existing spelling is intentionally preserved; lint and regressions pass for that file.
- `npm run spec:check -- cabloy-mcp`: passed (68 definitions). `npm run docs:build`: passed, with the existing chunk-size warning. Repository-relative links in this record were also checked directly.
- Across the affected test/support files, TypeScript decreased from **6,736 to 6,677 lines** (net **59 fewer**, including both new files). The native transport file decreased from 920 to 490 lines; its six pure groups now live in the independently runnable 434-line guard suite. The primary benefit is separation of responsibilities, not a large reduction in total code.

## Default-execution follow-up (2026-10-21)

Based on `85d31d611b`, this follow-up corrects discovery compatibility without changing the runner. The [CLI](../../../../vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.test.ts) defaults to each local module's `test/**/*.ts`, including support files. The [test child](../../../../vona/packages-cli/cli-set-api/toolsIsolate/test.ts) creates the Vona application before executing selected files with `isolation: 'none'`. Consequently, guards still run under shared application startup in `npm run test`; the direct command above does not create an independently dispatched default tier.

The original native entry was also selected by that default glob, but required an exact single-file child. This was a source-confirmed conflict, not an intentional skip. Moving it to `qualification/transport.test.ts` makes dedicated execution explicit using the existing selector support. Only its fixture import, the fixture's two exact path references, and the module TypeScript include change; cases, identity/argv checks, ownership and watchdog behavior are preserved. Native qualification is now outside the default suite and must be run separately with the command above. No replacement runner, ignore flag or automatic qualification dispatch is added.

### Direct versus managed guards

The managed comparison command was:

```bash
SERVER_LISTEN_DISABLE=true npm run test -- -- \
  vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts --ci
```

One sequential observation per mode on Node v24.8.0, measured with a monotonic clock around each complete command:

| Mode                | Passed | End-to-end wall time | Runner-reported duration | Guard suite duration |
| ------------------- | ------ | -------------------- | ------------------------ | -------------------- |
| Direct Node         | 6      | 1.287 s              | 1.233 s                  | 1.016 s              |
| Root managed runner | 6      | 18.881 s             | 1.086 s                  | 1.014 s              |

Both exited 0. The managed wall time includes preparation, application startup/shutdown and process orchestration; its runner duration is not the whole command. These are single observations, not a benchmark, isolated bootstrap measurement or claimed speedup. No permanent timing instrumentation is added.

### Discovery and compatibility verification

- The initial portable CLI selection regression passed its default-glob and captured-helper checks, but stopped before real process creation. It did not cover the shell forwarding failure. The same [test file](../../../../vona/packages-cli/cli-set-api/test/binTestPatterns.test.ts) is replaced by the real-child regression described below, rather than retaining another test layer.
- Actual MCP discovery has **13 entries**, includes guards, excludes native qualification, and resolves the explicit native selector to that file alone.
- The planned single-glob root invocation exited 0 but executed only `test/support/boundedProof.ts` (one empty-file entry), **not** the module suite. The existing [process helper](../../../../vona/packages-utils/process-helper/src/index.ts) joins child arguments into an unquoted shell command; on this Darwin run, `test/**/*.ts` expanded before the test child, which consumes only its first patterns argument. Root-level quoting does not survive that internal shell handoff. This was a separate existing CLI forwarding defect, not a successful broad regression. Repair was deferred at that stage; the bounded launcher fix below now resolves it without changing the generic process helper.
- The 13 default-discovery entries were then passed as separate explicit paths through `SERVER_LISTEN_DISABLE=true npm run test -- -- <all 13 paths> --ci`: **102 reported tests passed**, zero failures/cancellations/skips, exit 0, runner duration 10.965 s. All seven ordinary suites and all six support entries were observed. The count includes six file-level support passes and is not 102 distinct business scenarios. This verifies the module's ordinary discovered set, not the full repository default command.
- Relocated native qualification: **11 passed**, no failures/cancellations/skips, exit 0; 324 fixed events finish `CLOSED`, active 0. The supported exact command above was used.
- Module semantic TypeScript checking passed with the existing non-composite command. Scoped TypeScript lint, four-file source/config formatting, `spec:check` (68 definitions), docs build and record-link checks passed; the existing docs chunk-size warning remains.
- Test mode does not automatically disable the listener. Ingress proxy, production boundary, foundation, registry and existing-ready composition retain their intentional no-listener prerequisites. Use a command-local `SERVER_LISTEN_DISABLE=true` for their managed execution; do not change shared configuration or weaken those assertions.
- No full-repository `npm run test`, listener-enabled compatibility or expected-failure watchdog-probe requalification is claimed. This follow-up addresses the unconditional native selection conflict; the existing listener-mode contract remains a separate limitation.

## CLI argv forwarding fix (2026-10-21)

The CLI test command now uses a small same-file `runTestChild()` launcher: `spawn(process.execPath, args, { cwd, stdio: 'inherit' })`, without a shell. `_run()` retains its loader, runner-file selection, coverage flags and single comma-joined patterns argument. Startup errors and nonzero/signal completion reject; temporary interrupt/termination forwarding listeners are removed in `finally`. Generic process-helper behavior, test discovery and receiving-runner parsing are unchanged.

The existing regression file now launches a real temporary Node probe. It checks exact literal recursive/comma-joined glob arguments, empty arguments, spaces and shell metacharacters with matching fixture files present; it also checks exit 7, missing-cwd spawn failure and listener cleanup. It no longer mocks the process helper or repeats the directory-layout matrix. The probe is removed in `finally` and needs no Vona/DB/Redis bootstrap. Its path is appended to the existing [cross-platform infrastructure gate](../../../../.github/workflows/vona-test-sqlite3.yml), without a new job; only local macOS execution is claimed here.

### Verification

- With the old joined-shell launch behavior temporarily substituted, both real-child regressions failed (exit 1): shell parsing corrupted paths/arguments and exit-7 handling. Restoring argv-array spawn made both pass; together with the adjacent CLI dev-mode suite, **7 tests passed**, no failures/skips. This is a local regression-sensitivity check, not another production mode.
- The original single-glob command now passes through the complete managed CLI path:

  ```bash
  SERVER_LISTEN_DISABLE=true npm run test -- -- 'vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/**/*.ts' --ci
  ```

  **102 reported tests passed**, no failures/cancellations/skips, exit 0, runner duration 10.764 s. All seven ordinary suites and six support entries were observed; native qualification remained excluded. This replaces the earlier support-only observation for the corrected launcher, not the historical record.

- Exact native qualification with the command above: **11 passed**, no failures/cancellations/skips, exit 0, runner duration 9.197 s. Its 324 fixed events finish `CLOSED`, active 0. The expected-failure watchdog probe was not rerun.
- CLI `tsc --noEmit -p packages-cli/cli-set-api/tsconfig.json` exited 2 with five `TS6307` file-list errors in the cross-project test-claim/cleanup graph. The same semantic check with `--composite false --incremental false` passed. No tsconfig or dependency changes were made by this launcher fix; original composite-file-list success is not claimed.
- Targeted CLI source/test lint and source/test/workflow/record formatting passed, as did `git diff --check`, all 13 record-relative links, `npm run spec:check -- cabloy-mcp` (68 definitions) and `npm run docs:build`. The existing docs chunk-size warning remains. A scoped preservation check confirmed the earlier native relocation and fixture path-only changes are retained, with no machine-local paths in this record.
- These results cover the MCP ordinary selection and separate exact native selection on local macOS, not a full-repository default run, listener-enabled compatibility or completed Linux/Windows CI execution.
