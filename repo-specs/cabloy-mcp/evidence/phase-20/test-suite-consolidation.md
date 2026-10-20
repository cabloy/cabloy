# MCP test-suite consolidation

Test-only maintenance on 2026-10-20, based on `9fe5cb8f2c` plus the carried SQL-literal formatting changes. Production source, native fixture ownership/watchdog, runner, dependencies, environment configuration and historical evidence are unchanged. This record does not close an ATP, WBS, production or release gate.

## Coverage ownership

Paths below are relative to the repository root.

| Change                                                                                                                                  | Retained coverage owner                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Move all six pure ingress, body and response-gate groups out of native qualification; preserve their assertions and limits.             | [transportGuards.test.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts), with no Vona application bootstrap or listener.                                                                                                                                                                                                                                                                                 |
| Keep actual HTTP, raw router/executor, disconnect, deadline, SSE and cleanup/capacity qualification separate.                           | [transport.test.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transport.test.ts) and the unchanged [native fixture](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/nativeTransportFixture.ts).                                                                                                                                                                                                         |
| Remove direct forged/copied/foreign capability checks and nested-commit/callback/commit failure matrices from the composition suite.    | The existing [executor component suite](../../../../vona/src/suite-vendor/a-vona/modules/a-executor/test/readyExisting.test.ts) retains those matrices. The [composition suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/existingReadyBoundaryIntegration.test.ts) retains invalidation during a real read, closed authority refusal, and one asynchronous commit with pinned ALS through actual disposal and owner release. |
| Simplify the controlled transaction collaborator and remove cached reimports/metadata rereads that did not prove cold-import inertness. | The [foundation suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/requestBoundaryFoundation.test.ts) retains initializer-before-setup, actual ALS/disposal outcomes, ordinary diagnostic positive controls and no-listener/no-boundary assertions. The executor component suite owns transaction details.                                                                                                                      |
| Share event-count and UTF-8 byte-budget bookkeeping.                                                                                    | [boundedProof.ts](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/boundedProof.ts) serves the existing three schema-specific wrappers. Each keeps its existing budget domain, output shape, validation and sink; registry/composition continue sharing their existing writer.                                                                                                                                               |

The [production-boundary suite](../../../../vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/productionBoundary.test.ts) is unchanged, including normal-cleanup versus drain-triggered overrun checks and its static no-registration gate. Native SQLite behavior, diagnostic suppression, cancellation-not-settlement and precise owned-resource cleanup are retained. The native harness and its expected-failure watchdog probe are not redesigned or requalified by this maintenance.

## Running the layers

Run the pure guard suite without managed databases, Redis namespaces or a Vona application:

```bash
node --experimental-transform-types --test vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/transportGuards.test.ts
```

Node v24.8.0 requires the transform flag for parameter properties in the existing transport implementation; strip-only `node --test` is insufficient.

Run native qualification alone; its dedicated-child protection intentionally requires this exact single-file selection:

```bash
SERVER_LISTEN_DISABLE=true node scripts/runIsolatedTest.ts unit src/suite/cabloy-mcp/modules/cabloy-mcp/test/transport.test.ts
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

The extra forwarded `--` crosses the root script's nested npm invocation. Keep explicit stateful-suite concurrency declarations; do not set `TEST_CONCURRENCY=false` or use a broad selector that includes support files and the dedicated native suite.

## Verification

- Pure guards: **6 passed**, no failures, about 1.2 seconds including process startup. The initial strip-only attempt failed before suite execution with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`; the transform-enabled command above passed.
- Managed native qualification: **11 passed**, no failures/cancellations, producer exit 0. The six extracted tests account for the reduction from the historical 17-test native command; the native cases remain unchanged. Its 324 fixed events end in `CLOSED`, active 0.
- Combined managed boundary, foundation, registry, composition and executor regressions: **76 passed**, no failures/cancellations/skips, exit 0 (about 9.7 seconds). These include the unchanged executor component matrices that own the removed composition duplication.
- Module semantic TypeScript check (`tsc --noEmit --composite false --incremental false`): passed. Targeted lint on all eight changed/new TypeScript files and `git diff --check`: passed.
- Targeted formatting: eight paths passed (seven TypeScript files and this record). The composition file remains a formatting exception: the formatter proposes only rewriting the two carried SQL literals. Their existing spelling is intentionally preserved; lint and regressions pass for that file.
- `npm run spec:check -- cabloy-mcp`: passed (68 definitions). `npm run docs:build`: passed, with the existing chunk-size warning. Repository-relative links in this record were also checked directly.
- Across the affected test/support files, TypeScript decreased from **6,736 to 6,677 lines** (net **59 fewer**, including both new files). The native transport file decreased from 920 to 490 lines; its six pure groups now live in the independently runnable 434-line guard suite. The primary benefit is separation of responsibilities, not a large reduction in total code.
