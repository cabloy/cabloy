# WBS-MCP-20-01 default-enabled configuration correction

## Authority and scope

On 2026-10-17, the user explicitly directed removal of the MCP enabled mapping from `vona/src/backend/config/config/config.ts` and module-owned `enabled: env.CABLOY_MCP_ENABLED !== 'false'`, default enabled. This is a bounded correction to the existing configuration increment, not transport/AS execution approval. [ADR 0001](../../decisions/0001-mcp-suite-boundaries.md), [SRS](../../srs.md#srs-mcp-ops-04-configuration-and-migration-boundary), and [ATP-MCP-OPS-02](../../test-plan.md#atp-mcp-ops-02-disablement-and-configuration-fail-closed-behavior) retain independent security-readiness and runtime-proof requirements.

Cabloy Basic; branch `worktree-spec-basic-cabloy-mcp`, base `0cdd3ae480e59ea4505b43b9de92ffdaa7240f34`, with attributable configuration/integration source and evidence already dirty. [Fresh source manifest](./artifacts/default-enabled-source-check.json) identifies the corrected source; HEAD alone does not reproduce the increment.

## Changes

- Module `src/config/config.ts` reads `app.meta.env` and returns a fresh typed object with `enabled: env.CABLOY_MCP_ENABLED !== 'false'`.
- Application config no longer contains an MCP mapping and matches its HEAD content. Existing application configuration, including mail, remains intact.
- Tests cover default-on independent objects; undefined, empty, true, numeric-looking, uppercase/mixed-case and whitespace variants; literal false disablement; absence of application mapping; and real module-loader application-override precedence in both directions.
- General framework override precedence is unchanged. The literal-false rule describes the module-derived value, not a prohibition on deliberate application overrides.
- Current activation references are reconciled in the existing authority set. No stable IDs, WBS statuses, OAuth/host/registry/policy safety requirements or release gates are removed.

There is no endpoint or business dispatch in this source increment. Default enabled is configuration intent, not proof of runtime security readiness.

## Verification

Commands executed from the active repository root:

```bash
node --experimental-transform-types --test vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/config.test.ts
vona/node_modules/.bin/tsc --noEmit --composite false --incremental false -p vona/src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
vona/node_modules/.bin/tsc --noEmit --composite false --incremental false -p vona/tsconfig.json
```

- [Configuration regressions](./artifacts/default-enabled-tests.txt): **17 passed, 0 failed**.
- [Module semantics](./artifacts/default-enabled-module-types.txt) and [application semantics](./artifacts/default-enabled-application-types.txt): **exit 0, no diagnostics**. These are source-only semantic checks, not composite/declaration builds or full root `npm run tsc`.
- [Source/registration preservation](./artifacts/default-enabled-source-check.json): exactly the application config, module config and configuration test differ from the historical authored-source hashes. Other integration-manifest hashes, including the existing Vona lock delta, generated application package/type import, module manifests and types, are unchanged. Generated dependency, installed workspace link and type symlink remain valid. Root lockfile is unchanged.
- Narrow source lint, changed-Markdown/source formatting, full spec authority audit, chart generation/freshness and whitespace checks are retained in [final static checks](./artifacts/default-enabled-final-checks.txt). Static checks are not ATP evidence.

No dependency installation/synchronization, generator, SDK, environment read/change, database, Redis, listener, live provider, schema, main edit, commit or push occurred in this correction.

## Evidence applicability and status

The [configuration foundation](./config-foundation.md) and [integration follow-up](./application-integration.md) retain the original default-off source hashes, 11-test logs and failed compiler attempts. Those activation/test/hash observations are historical and superseded for the corrected source, not erased. Their old preservation harness intentionally asserts the old hashes and was not rerun unchanged or silently modified.

The finite configuration correction is implemented and its regressions/source semantic checks pass. Full WBS-MCP-20-01 remains **blocked**, all ATPs remain open and verified count stays **0/12**. Composite/declaration builds, real HTTP transport and independent OAuth/host/policy runtime proof remain outstanding. No AS scope/status changes.
