# MCP Evidence Handling

## Fixture module relocation (2026-11-11)

Current ownership is `a-test/test-mcp` at `vona/src/suite-vendor/a-test/modules/test-mcp`. The backend `cabloy-mcp` suite contains only `cabloy-mcp` and `mcp-auth`; fixture-to-runtime reuse remains one-way.

| Historical identity/location | Present-day identity/location |
| --- | --- |
| `mcp-test` / `vona-module-mcp-test` | `test-mcp` / `vona-module-test-mcp` |
| `vona/src/suite/cabloy-mcp/modules/mcp-test/` or `vona/src/suite-vendor/cabloy-mcp/modules/mcp-test/` | `vona/src/suite-vendor/a-test/modules/test-mcp/` |
| Fixture `test/businessTools.test.ts`, `test/catalog.test.ts`, `test/permission.test.ts` | Same relative test filenames under the new module |
| Earlier standalone `test/localHttp.test.ts`, later `qualification/localHttp.test.ts` | `vona/src/suite-vendor/a-test/modules/test-mcp/qualification/localHttp.test.ts` |
| `PROJECT_DISABLED_MODULES=mcp-test` in an old invocation | Use `PROJECT_DISABLED_MODULES=test-mcp` for a new invocation |
| Module-derived default `mcp-test_*` tool names | Module-derived default `test-mcp_*` tool names |

This is a navigation/current-execution mapping, not a claim that every historical entrypoint still exists. Earlier `devHttp.test.ts` shared-owner proof predates the separate normal-owner migration; current authenticated HTTP tests belong to `vona/src/suite-vendor/a-test/modules/test-mcp/test/cabloy-mcp/businessHttp.test.ts`. The standalone qualification requires the managed no-listener startup described in the [current guide](../../../repo-docs/mcp/mcp-guide.md#automated-verification).

Historical logs, executed commands/results, ADR decisions, progress entries and source-hash snapshots are intentionally unchanged, including paths naming `mcp-test`. Hashes continue to identify the original source bytes. Explicit `mcp_test_action_*` tool names, `x-mcp-test-owner`, `commerce_*` tools and unrelated protocol strings are not module-derived names and remain compatible. Launcher commands `mcp:test:local` and `mcp:commerce:local` are unchanged. This mapping is neither a rerun nor new evidence of the relocated module; no previous proof or WBS/ATP status is promoted.

## Ordinary test consolidation (2026-11-11)

The eight ordinary runtime/auth test files now belong to `a-test/test-mcp`. Use this mapping for navigation and new invocations; retained executed commands, results and source hashes still describe their original revisions.

| Historical location | Present-day location |
| --- | --- |
| `vona/src/suite-vendor/cabloy-mcp/modules/cabloy-mcp/test/{businessHttp,config,transportGuards}.test.ts` | `vona/src/suite-vendor/a-test/modules/test-mcp/test/cabloy-mcp/` with the same filenames |
| `vona/src/suite-vendor/cabloy-mcp/modules/mcp-auth/test/{authorization,authorizationGrant,customScope,passport,registration}.test.ts` | `vona/src/suite-vendor/a-test/modules/test-mcp/test/mcp-auth/` with the same filenames |

The three existing fixture tests remain at `test-mcp/test/`. Production-module qualification tests and the six runtime `test/support/` files used by qualification remain in place. Recursive automatic discovery follows the new test owner; explicit file selectors remain usable when `PROJECT_DISABLED_MODULES=test-mcp` intentionally excludes fixture runtime resources. This consolidation changes test location, not production runtime ownership or historical WBS/ATP acceptance status.

## Path redaction (2026-10-17)

At the user's request, retained Phase 10 and Phase 20 evidence has been sanitized to remove local machine and checkout locations:

- Paths inside an observed repository checkout are relative to that checkout's root, not to the evidence file. `.` denotes that root; recorded worktree names distinguish historical checkouts where needed.
- `<MAIN_CHECKOUT>` denotes the separately inspected main checkout without exposing its physical location.
- `<TEMP_DIR>` denotes an external temporary directory. Temporary directory identifiers and external directory traversal are omitted; relevant artifact basenames remain.

These are presentation-only substitutions. Recorded revisions, source-file SHA-256 values, compiler diagnostic codes, command flags, exit codes, failed attempts and successful results are preserved. Source hashes identify the original source bytes, not the sanitized log bytes. Redaction is not a rerun or new acceptance evidence and does not change WBS/ATP status.

The retained lockfile patch is a **path-redacted historical diff**, not a byte-for-byte original patch or an apply-ready recovery artifact. Temporary tarball paths are replaced consistently; package versions, integrity values and the rest of the delta remain intact. The actual lockfile is not modified by this redaction. Placeholder-bearing command excerpts describe historical execution and must not be copied as literal runnable commands.

For future retained evidence, normalize repository paths and redact external machine paths before writing or sharing command output, including compiler stderr and exception stacks. Runtime path resolution may still require absolute paths internally; do not persist those host-specific values. Prefer the phase summary and targeted excerpts over loading entire historical logs.

- [Dev shared-listener MCP qualification](./dev-shared-listener.md) — original same-listener journey, instance resolution, local ingress/drain and standalone proof; [later authority correction](./dev-shared-listener.md#shared-ingress-authority-correction-2026-10-23) supersedes middleware-mode/shared-locality rules with module-only dev/test inclusion and nonlocal Host/Origin acceptance, final 4/4 shared plus 15/15 standalone/guard tests, retained failure and current hashes. No remote-machine/ordinary-dev/new-real-client or production acceptance; parents blocked/0-of-12.
- [Phase 10 evidence](./phase-10/index.md)
- [Phase 20 evidence](./phase-20/index.md)
- [Single product-search business slice](./business-products-search.md) — partial catalog/dispatch proof, not production or full ATP closure.
- [Product search → detail business slice](./business-product-detail.md) — scoped verification history and context limits; no production or full ATP closure.
- [Usable local commerce MCP entry](./commerce-local-entry.md) — historical two-tool command/client flow, 11 passing business/HTTP regressions and retained failures; local verification only, no production or full ATP closure.
- [Categories → products → detail](./business-categories.md) — historical Commerce-backed delivery and synchronization; [independent mcp-test migration](./business-categories.md#independent-mcp-test-migration-2026-10-23) retains 41/41 Commerce-excluded managed tests, separate core qualification 1/1, native SDK returned-ID chain, normal TTL/root exit 0, source hashes and failures. No Commerce source delta; subsequent [independent real-client proof](./business-ai-client.md#independent-mcp-test-real-client-proof-2026-10-23) separately closes the migrated business-journey gap. Parents blocked/0-of-12.
- [Local compatibility and AI-client boundary](./business-ai-client.md) — retained Claude failures, historical 14-test compatibility, parsing-isolation 3/3 and 18/18, native SDK journey/TTL; later user-supplied Claude Code 2.1.236 three-tool business journey and faithful answer passed, client exit 0 and server graceful shutdown observed. That historical run's server root exit remains unknown. The later [independent mcp-test client run](./business-ai-client.md#independent-mcp-test-real-client-proof-2026-10-23) separately passed returned-ID traversal and faithful two-SKU output, client exit 0, reported US$0.02581, same-run server graceful shutdown and root exit 0. Exact invocation/authentication/isolation enforcement and complete cleanup are not independently attested. Parents blocked/0-of-12.
