# WBS-MCP-20-01 configuration foundation execution record

## Activation contract supersession (2026-10-17)

The user subsequently directed module-owned `enabled: env.CABLOY_MCP_ENABLED !== 'false'`, default enabled, and removal of the standard application mapping. The [default-enabled correction](./default-enabled-config.md) supersedes this record's activation behavior and source/test applicability. The original logs, hashes and harness remain historical; they are not current default-on proof and must not be silently overwritten. Other structural and security boundaries remain unchanged.

## Scope, approval and attribution

- Reviewed: 2026-10-16; Cabloy Basic (`__CABLOY_BASIC__` only).
- Base revision: `0cdd3ae480e59ea4505b43b9de92ffdaa7240f34`, branch `worktree-spec-basic-cabloy-mcp`. The checkout was clean before this increment. Evidence applies to the dirty source identified by the SHA-256 manifest in [context-check output](./artifacts/config-context-check.json), not to HEAD alone.
- The user explicitly selected **批准实现并验证** for the presented WBS-MCP-20-01 configuration-only subincrement in the current MCP worktree. This record retains that already-approved execution and its observations; it is not a new design or approval request.
- Authority: [ADR 0001](../../decisions/0001-mcp-suite-boundaries.md), [SRS configuration contracts](../../srs.md), [WBS-MCP-20-01](../../pdp-wbs.md), and partial structural/configuration inputs to [ATP-MCP-OPS-02](../../test-plan.md#atp-mcp-ops-02-disablement-and-configuration-fail-closed-behavior). WBS-MCP-10-01/02 have their own named-reviewer documentary planning closures in the [Phase 10 index](../phase-10/index.md).
- Authorized implementation: normal suite/module creation, typed default-off configuration, literal-string application mapping, synthetic configuration tests, scoped metadata, narrow checks and this evidence/progress/chart update.
- Excluded: dependency/SDK installation, application dependency synchronization, endpoints/discovery/transport, OAuth/AS, tenant or host authority, tools/dispatch, schema/fileVersion/meta.version, environment/database operations, main edits, commit and push.

## Implemented source

- `vona/src/suite/cabloy-mcp/`: CLI-generated normal suite and module, version `5.0.0`; suite composition uses `workspace:^`, module lifecycle dependency is `a-vona: 5.0.0`, ordinary module dependencies are empty and no `fileVersion` is present.
- `modules/cabloy-mcp/src/config/config.ts`: fresh typed configuration object with `enabled: false`.
- `modules/cabloy-mcp/src/types/index.ts`: `IMcpConfig` and Vona environment augmentation for `CABLOY_MCP_ENABLED`.
- `vona/src/backend/config/config/config.ts`: application override sets `enabled` only when `env.CABLOY_MCP_ENABLED === 'true'`.
- Module `src/index.ts` exports generated metadata and public types. CLI-generated `src/.metadata/index.ts` and `this.ts` expose the standard scope/config types; no handwritten application registration was introduced.
- `modules/cabloy-mcp/test/config.test.ts`: actual application configuration function and actual framework module loader, with synthetic application objects. There is no app startup, listener, persisted resource, process environment mutation or scoped runtime context. Synthetic path strings and `:memory:` are config inputs only, not opened resources.

`enabled: true` represents configuration intent only. There is no endpoint or business dispatch in this increment; this does not prove fail-closed runtime admission for a future transport.

## Commands executed

From the active worktree root, creation used existing CLI families:

```bash
npm run vona :create:suite cabloy-mcp -- --ci
npm run vona :create:module cabloy-mcp -- --suite=cabloy-mcp --vscode --nometadata --ci
npm run vona :init:config cabloy-mcp -- --nometadata --ci
npm run vona :init:types cabloy-mcp -- --nometadata --ci
npm run vona :tools:metadata cabloy-mcp -- --ci
npm run vona :create:test config -- --module=cabloy-mcp --ci
```

`--vscode --nometadata` deliberately avoided the module creation command's dependency/install/automatic-metadata branches. Scoped metadata was then generated explicitly. The suite dependency was normalized to the accepted `workspace:^` value. No `:tools:deps`, install or package-manager synchronization ran.

Retained final checks, runnable from the root:

```bash
node --experimental-transform-types --test vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/config.test.ts
node repo-specs/cabloy-mcp/evidence/phase-20/artifacts/config-foundation-check.mjs
```

Narrow lint used `node_modules/.bin/oxlint --disable-nested-config` on module config, types, test and application config. Formatting used the existing `oxfmt` on the suite, application config and evidence harness. Metadata was regenerated again with the scoped command and formatted; both generated metadata file hashes were identical before and after that rerun.

## Observed results and limitations

| Check                                           | Observed result                     | Evidence / limitation                                                                                                                                                                              |
| ----------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Synthetic configuration regressions             | **11 passed, 0 failed**             | [Test log](./artifacts/config-tests.txt). Default-off, independent defaults, eight absent/nonliteral inputs, literal `true`, real merge precedence and explicit application disablement.           |
| Narrow source lint                              | Passed, exit 0                      | [Lint log](./artifacts/config-lint.txt).                                                                                                                                                           |
| Manifests, TS reference and source inventory    | Passed                              | [Harness](./artifacts/config-foundation-check.mjs) and [output](./artifacts/config-context-check.json). Exact source inventory excludes route/controller/schema files.                             |
| Actual module discovery                         | Passed: MCP found among 111 modules | Actual `@cabloy/module-glob` discovery, no manually invented registry. This is not installed application registration/startup proof.                                                               |
| Full-discovery ambient TypeScript check         | **Not clean: 16 diagnostics**       | Current and same-context HEAD baseline contain exactly the same 16 diagnostics; `identical: true`, `clean: false` in retained output. No new diagnostics in the changed source under this context. |
| Installed application / runtime / real HTTP ATP | Not run                             | Outside this approved configuration-only increment. No claim of transport, admission, dispatch, OAuth or ordinary-HTTP equivalence proof.                                                          |

Environment: Node `v24.8.0`, TypeScript `5.9.3`, existing installed dependencies. No SSR flavor/site, database, Redis namespace, credentials or live provider was involved.

### Typecheck method and failed attempts

The first direct module-only `tsc --noEmit -p .../tsconfig.json` failed: it lacked application-wide module augmentations and also exposed initially incorrect test import paths. The test paths were corrected. A full-discovery verification context then exposed two genuine test assignments from deeply partial application configuration into a fully typed module map; these were corrected to assign the MCP field only. Final tests and lint above passed after those corrections. Earlier failed attempts are not represented as successful checks.

The retained harness constructs a temporary no-emit/nonincremental TypeScript context outside the repo using actual discovered module source indexes and package-name path mappings. It includes the new test. For the comparison only, it removes the new suite's roots/path mapping and reads the HEAD application config through a compiler-host override. It neither reverts source nor changes dependency links. Both runs use the same installed dependencies and remaining source. It removes only its own temporary directory afterward.

The remaining 16 identical diagnostics concern existing Cluster event typing (2), HTTP/SSR/socket type incompatibilities (8), and training permission-hint `mode` fields (6). Full details are retained in the JSON artifact. Equality is a scoped diagnostic-delta check, **not a clean typecheck, full application build or release waiver**. Initial discovery-import invocation errors were corrected by using the installed module-glob package's source ESM entry; no install was used to repair them.

## Later evidence reconciliation

The separately approved [application integration follow-up](./application-integration.md) generated normal registration and installed workspace resolution, then passed both project-local source-only semantic checks with no diagnostics and reran all 11 tests successfully. It supersedes this record's open normal-application/source-semantic gate below, not the historical 16-diagnostic artifact or composite/build/runtime gates. The no-install statements above describe this earlier configuration-only execution; the follow-up records its actual incremental installs and full lockfile reconciliation separately.

## Status and next proof (historical at configuration-only handoff)

This finite configuration source increment is implemented and its configuration regressions pass. **WBS-MCP-20-01 remains `blocked` and unverified.** Full target compilation, installed application dependency/registration integration and real-HTTP transport proof remain outstanding; OAuth and host/instance authority gates retain their independent scope. No ATP is closed: ATP-MCP-TRANSPORT-01 and ATP-MCP-OPS-02 remain open, and suite verified count stays **0/12**. No AS planning or delivery status changes.

Next single action: address the normal application integration/typecheck gate in a separately scoped implementation/verification step, including dependency synchronization only if explicitly authorized. Do not start transport, install the SDK or reopen AS planning automatically.

Final authority-audit, chart freshness, formatting and preservation checks are retained in [final checks](./artifacts/config-final-checks.txt). These are separate static gates, not ATP proof or further execution approval.
