# Ingress Proxy Qualification — Execution Record

## Scope and authority

- Date: 2026-10-18; edition: Cabloy Basic.
- Parent: WBS-MCP-20-01; related ATP-MCP-TRANSPORT-01 and ATP-MCP-OPS-02 remain open. This is partial execution evidence, not an ATP result or a new `EVD-*` declaration.
- Governing authority: [transport execution dossier section 12](../../wbs-mcp-20-01-execution-dossier.md#12-finite-f1f2-registration-and-proof-disposition-2026-10-18), including its separately recorded bounded-design acceptance and precise execution approval. Production DEC-MCP-04/07/08 remain Proposed as a whole.
- Revision: `e7e9a13e95cb6f059e913a4f0b43faee99a4de31`, initially with exactly two attributable planning documents (191 inserted lines). Approval added a chronological dossier record; implementation then created the two approved authored files and regenerated the one approved metadata file. Base HEAD alone does not reproduce this dirty state.
- Custodian/bounded reviewer: `zhennann`, as recorded in the approved package. Only the explicitly observed bounded construction/proxy results below are qualified; no human full-ATP acceptance is inferred from this record.

## Actual implementation and source attribution

At the initial generated-drift checkpoint, created but **not yet typechecked, formatted, linted or runtime-qualified** (subsequent observations follow chronologically below):

1. `vona/src/suite-vendor/a-test/modules/test-vona/src/bean/aop.mcpIngressProbe.ts` — test-mode AOP advice targeting the synchronous startup `_callback()` return seam; unarmed passthrough and explicit bounded wrap/transparent sessions.
2. `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts` — serial selected-test assertions for included and excluded owner graphs, using structural ports without importing the excluded owner.

Generated and retained unchanged after generation:

3. `vona/src/suite-vendor/a-test/modules/test-vona/src/.metadata/index.ts` — new advice export/declarations **plus unexpected movement of existing sections**.

[Original source-byte hashes and generation classification](./artifacts/ingress-proxy-source-hashes-1.md) and the [sanitized source display diff](./artifacts/ingress-proxy-diff-1.patch) identify this partial implementation. The display diff is presentation-only, not apply-ready. No source completion is claimed.

## Commands actually run

Both commands ran sequentially in the active worktree, with no nonempty inherited module/suite exclusion setting. Both producer streams were captured, decoded with fatal UTF-8 validation, terminal-normalized, and successfully path-sanitized in full before retention/display. Existing artifact filenames were checked absent; writes used exclusive creation. Sanitization completed successfully; the wrapper exited 0.

| Command                                  | Producer exit | Duration | Observer timeout | Local sanitized artifact                                        |
| ---------------------------------------- | ------------- | -------- | ---------------- | --------------------------------------------------------------- |
| `npm run deps:vona`                      | 0             | 4,421 ms | false            | [Dependency preparation](./artifacts/ingress-proxy-deps-1.log)  |
| `npm run vona :tools:metadata test-vona` | 0             | 1,410 ms | false            | [Metadata generation](./artifacts/ingress-proxy-metadata-1.log) |

The `.log` files are locally retained but ignored by the repository's log rule; they are not staged, committed or remotely durable. Source hashes/display artifacts and this record do not substitute for custody of those logs. Successful CLI exits establish command completion, not generated-delta acceptance or AOP behavior.

No managed test invocation ran. No run-specific database/Redis/runtime/public resources were allocated by this increment's test commands. No listener, production route, AS/RS, persisted fixture, dev reset, environment change, dependency version/lockfile change, process signal, app shutdown from a test, staging, commit or push was performed.

## Observed stop condition

The approved metadata delta permits **only the new advice's runtime export and associated generated declarations**, and explicitly requires stopping on unexpected generated drift. The command instead produced a tracked diff of **1,006 insertions and 993 deletions** by moving existing sections as well as adding the advice.

Read-only comparison found:

- Baseline metadata SHA-256: `1106fd00c6868c13daf37cfb98e7e8f56c08b73c6048780c7b9757ef77df794e`.
- Generated metadata SHA-256: `99d3e76a881d1490c241dd29192f4ed6c528d288eda4a1c001707b4cbcc7353d`.
- Section names and multiplicities are preserved. Comparing each named block in occurrence order, **only `aop` has changed content**; all other named block bodies and all between-block gaps are byte-identical. The hash artifact retains complete old/new block orders, including duplicate model blocks.
- The new AOP content includes the runtime export, `IAopRecord` entry and `AopMcpIngressProbe` scope/onion declarations. No other named section content changed.

These observations narrow the scope issue to **existing-block reordering**, but do not prove semantic equivalence or authorize it. Import/export evaluation order is not dismissed as harmless without qualification. No generator-root-cause or determinism claim is made.

Execution stopped before subsequent source checks or runtime. No manual metadata editing, forced sort, revert, generator/framework modification, dependency reinstall or assertion relaxation was used to conceal or work around the drift. The partial source and generated bytes remain available for inspection.

## Historical outstanding checks and resumption gate

The remaining seven approved commands were **not run**, rather than failed or passed:

- Both module-local no-emit semantic checks.
- Vona composite compilation.
- Two-file source formatting and lint checks.
- Fresh included-owner managed qualification.
- Fresh `PROJECT_DISABLED_MODULES=test-vona` owner-excluded managed qualification.

There are no runtime events, test counts, startup/cleanup observations or owner-exclusion results for this probe. Native-core and C3 evidence retain their historical scope and are not reused as ingress-proxy proof.

**One next action:** obtain an explicit bounded scope disposition from `zhennann` for the retained CLI-generated metadata reordering. The recommended minimal amendment would allow only the observed movement of byte-identical existing blocks in this single generated file, retain the new-advice-only content restriction, prohibit hand-edited metadata/generator changes, and reuse the existing approval for the remaining exact checks and two fresh managed runs. This recommendation is not accepted or executed here. A different content delta or affected file would still stop execution. If the amendment is not accepted, this candidate remains stopped; no automatic repair or discard is authorized.

WBS-MCP-20-01 and Phase 20 remain **blocked**, all full ATPs **open**, verified total **0/12**. The bounded design and unchanged portions of execution approval remain recorded; no repeated generic feasibility or C1/C2/C3/SDK approval is needed. [Documentary check log](./artifacts/ingress-proxy-stop-checks-1.log) and [preservation check](./artifacts/ingress-proxy-preservation-1.md) are recorded separately in the dossier and do not clear this gate. The initial stricter preservation comparator failed on Markdown-only separators; the corrected comparison passed, with the failure retained in that record.

## Later generated-order amendment and resumed failure (2026-10-18)

After the report offered only the limited metadata-order amendment and reuse of the remaining execution approval, the user replied “同意，请执行下一步”. The [subsequent dossier disposition](../../wbs-mcp-20-01-execution-dossier.md#bounded-generated-order-amendment-accepted-and-execution-resumed-2026-10-18) records acceptance of movement of byte-identical existing blocks in the single metadata file, with new-advice-only content and no hand editing/generator change. Preflight reconfirmed the same Basic HEAD and all three recorded source hashes. This clears the **scope** stop above, not source semantics or runtime qualification. Earlier statements describe their historical checkpoint.

The first remaining command actually ran:

```bash
pnpm --dir vona exec tsc --noEmit --composite false --incremental false -p src/suite-vendor/a-test/modules/test-vona/tsconfig.json
```

- Producer exit **2**, duration **16,058 ms**, observer timeout **false** (180-second ceiling), sanitizer exit **0**.
- [Complete sanitized output](./artifacts/ingress-proxy-owner-types-1.log), captured from both streams with fatal UTF-8 decoding, terminal normalization and complete path sanitization before exclusive-create retention. The `.log` remains ignored/local only.
- **35 diagnostics** across eight existing files: `application.test.ts`, `database/dtoGet.test.ts`, `database/dtoMutate.test.ts`, `database/modelGroup.test.ts`, `database/modelRelationsMutate.test.ts`, `error.test.ts`, `guardPassport.test.ts`, `retryable.test.ts`, all under `vona/src/suite-vendor/a-test/modules/test-vona/test/`.
- Counts by code: TS18048 ×1, TS2304 ×1, TS2322 ×6, TS2339 ×16, TS2345 ×4, TS2353 ×1, TS2769 ×1, TS6133 ×5. No diagnostic names the new advice or metadata.
- Read-only comparison confirmed those eight files are byte-identical to HEAD. The existing owner tsconfig includes `test`, not only `src`. These observations **do not prove baseline equivalence or a clean new-source check**; no baseline compiler procedure ran.

The required semantic gate failed, so the subsequent six commands were not run: MCP module semantics, Vona composite, two-file source formatting/lint, and both fresh managed runs. No runtime events/test counts or resource/cleanup observations exist. Source bytes remain unchanged; no historical test, tsconfig, generator or dependency was changed to obtain a pass. The original metadata stop and this new failed gate both remain retained.

**Next action at that historical checkpoint:** approve the bounded baseline-diagnostic comparison and conditional disposition specified in the dossier: in-memory compiler-host HEAD overlays under unchanged installed dependencies, no working-tree replacement/tsconfig write, complete diagnostic-signature equality rather than count-only attribution. Any diagnostic delta stops; exact equality would permit only an explicitly accepted baseline-debt disposition followed by the remaining six commands, never relabeling this exit 2 as a clean pass. This is a recommendation, not an executed baseline, accepted waiver or further runtime authorization. The metadata scope amendment is already accepted and need not be repeated. WBS-MCP-20-01/Phase 20 stay blocked, full ATPs open, verified 0/12; prior native-core/C3 proof remains unchanged.

[Resumed-stop documentary checks](./artifacts/ingress-proxy-resumed-stop-checks-1.log) passed scoped document formatting, full 68-definition spec audit, English chart generation/freshness at 0/12, docs build (producer 0; existing >500 kB warning), explicit path checking and whitespace checks. The trailer retains unchanged source hashes and zero runtime invocations. Separate preservation checks confirmed unchanged historical dossier content and unrelated progress rows; the compiler log was reviewed as bounded compiler/type output, not request/credential data. These documentary checks do not turn the owner-module exit 2 into a pass or clear that historical gate.

## Approved baseline disposition and source-check continuation (2026-10-18)

The user's subsequent “同意，请执行下一步” approved the exact in-memory HEAD-source comparison and continuation **only on complete diagnostic equality**, as recorded in the [dossier](../../wbs-mcp-20-01-execution-dossier.md#baseline-comparison-and-conditional-debt-disposition-approved-2026-10-18). The [read-only compiler-host harness](./artifacts/ingress-proxy-baseline-check.mjs) uses installed TypeScript 5.9.3, the same owner config/dependencies/flags, HEAD metadata bytes and exclusion of the two added files for the baseline only. It does not emit, replace working-tree files or write tsconfig. Full signatures include file/span/category/code/structured message/related information; counts alone are not the criterion.

The [first comparison](./artifacts/ingress-proxy-baseline-1.log) exited 0 in 29,722 ms: baseline roots 155/current roots 156; both have 35 diagnostics with identical signatures, SHA-256 `3f9697be824e42b9fb6a1068f54abaff298e982ca850d0adeb715df7f0d89869`. Current formatted diagnostics also exactly match the original CLI output, and source bytes are unchanged. The approved equality condition is satisfied. **Owner-module tsc remains exit 2**, accepted only as baseline-existing type debt in this installed context; no clean owner-module pass or general type-safety claim follows.

The next checks actually ran: [MCP no-emit semantics](./artifacts/ingress-proxy-mcp-types-1.log), producer 0, 15,000 ms; [Vona composite](./artifacts/ingress-proxy-composite-1.log), producer 0, 22,526 ms. The [first source-format check](./artifacts/ingress-proxy-format-1.log) exited 1 in 206 ms, naming only `ingressProxy.test.ts`; subsequent lint/runtime did not run in that wrapper. Under the existing scoped-correction approval, `oxfmt` formatted only that test, without behavior changes.

After that formatting correction, [baseline comparison 2](./artifacts/ingress-proxy-baseline-2.log) again passed exact equality (26,627 ms), [MCP semantics 2](./artifacts/ingress-proxy-mcp-types-2.log) passed (13,460 ms), [composite 2](./artifacts/ingress-proxy-composite-2.log) passed (6,544 ms), and [format 2](./artifacts/ingress-proxy-format-2.log) passed (198 ms). [Lint 1](./artifacts/ingress-proxy-lint-1.log) exited 1 in 1,070 ms: `@stylistic(lines-between-class-members)` required one blank line after the multiline `session` member in the advice. Only that blank line was added; no assertions, types, behavior, metadata or unrelated source were changed. Both style failures remain retained, not erased. Affected checks are rerun before runtime. All observed command ceilings were respected and sanitizers completed successfully; ignored logs remain local only.

### Current post-style source checks

[Post-style source hashes](./artifacts/ingress-proxy-source-hashes-2.md) and [current sanitized display diff](./artifacts/ingress-proxy-diff-2.patch) supersede the initial fingerprints/display for these checks only. Metadata bytes remain unchanged. Each following log includes before-source hashes and verifies unchanged source bytes afterward:

| Check                                    | Producer exit                         | Duration  | Artifact                                                 |
| ---------------------------------------- | ------------------------------------- | --------- | -------------------------------------------------------- |
| Two-file format                          | 0                                     | 234 ms    | [Format 3](./artifacts/ingress-proxy-format-3.log)       |
| Two-file lint                            | 0                                     | 1,059 ms  | [Lint 2](./artifacts/ingress-proxy-lint-2.log)           |
| Owner HEAD-overlay diagnostic comparison | 0, baseline debt equal, **not clean** | 31,300 ms | [Baseline 3](./artifacts/ingress-proxy-baseline-3.log)   |
| MCP module-local no-emit semantics       | 0                                     | 15,833 ms | [MCP types 3](./artifacts/ingress-proxy-mcp-types-3.log) |
| Vona composite                           | 0                                     | 21,437 ms | [Composite 3](./artifacts/ingress-proxy-composite-3.log) |

All observation-timeout flags are false; all sanitizers completed with exit 0. The final baseline still has identical complete 35-diagnostic signatures and current formatted CLI text, without config/source replacement. The original owner exit 2 and both style failures remain part of this execution history. Composite is the normal repository incremental `tsc -b` command, not a forced whole-repository no-emit check.

## Fresh managed runtime observations

The approved commands run sequentially through the existing isolated runner, with command-local listener disablement and no environment-file change. Each command owns a fresh test-mode application graph and run-specific disposable database/Redis/runtime/public preparation, one-time migration/initialization/seeding and runner cleanup; there is no dev reset or manual cleanup. Each test uses the existing singleton, with no second app, persisted test fixture, listener invocation, network request or global patch. Normal startup still executes `a-web:listen`, whose disabled listener branch does not install an app HTTP server. Probe assertions require `server.listen.disable === true`, `app.server == null`, test mode and completed startup. Runtime startup output is separate from the fixed probe event schema.

### Included owner

```bash
SERVER_LISTEN_DISABLE=true node scripts/runIsolatedTest.ts unit src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts
```

[Included run](./artifacts/ingress-proxy-included-1.log): producer **0**, **68,342 ms**, observer timeout false, sanitizer 0, source bytes unchanged. Selected test: **1 passed, 0 failed, 0 cancelled/skipped/todo**; runner output reports graceful app shutdown. Run identity `20261018051038-f896b894` belongs only to this invocation.

The sole safe event is `alias=included`, `proof=startup-proxy`, `outcome=observed`, `seq=1`, `matched=true`, `wrapped=true`, `transparent=true`, `calls=2`, `closed=true`, `listenerRestored=true`. Passing local assertions establish exact advice match in the included graph, synchronous distinct wrap return with one interception/next, two separately checked synthetic pair identities and fixed sentinel results, transparent exact-original return without invoking it, closed/released sessions, unchanged session counters on unarmed acquisition and restoration of the pre-existing error-listener identity list. This is construction/proxy and local short-circuit evidence, not actual socket ingress, total framework context-count measurement, original-listener delegation or production admission.

### Fresh owner-excluded graph

```bash
PROJECT_DISABLED_MODULES=test-vona SERVER_LISTEN_DISABLE=true node scripts/runIsolatedTest.ts unit src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts
```

[Excluded run](./artifacts/ingress-proxy-excluded-1.log): producer **0**, **64,858 ms**, observer timeout false, sanitizer 0, source bytes unchanged. Selected test: **1 passed, 0 failed, 0 cancelled/skipped/todo**; graceful app shutdown. Run identity `20261018051146-a4f976b2` is distinct from the included invocation. No disabled-suite input or nonempty inherited module exclusion was present before the command-local selection; `TEST_CONCURRENCY=false` was not used.

The sole safe event is `alias=excluded`, `proof=startup-proxy`, `outcome=observed`, `seq=1`, `matched=false`, `wrapped=false`, `transparent=false`, `calls=0`, `closed=true`, `listenerRestored=true`. Passing local assertions establish that `a-web` and `cabloy-mcp` remain composed, `test-vona` and its exact advice match are absent, and the real startup `_callback()` still returns a function synchronously. The excluded branch imports/resolves no probe owner. `closed=true` is vacuous for its empty session list, not a hidden probe invocation. This is fresh graph exclusion of the **test owner**, not literal-false MCP configuration, MCP graph exclusion, hot uninstall, ordinary-route regression or ATP-MCP-OPS-02 proof.

### Retention, cleanup and qualified boundary

The [safe runtime/hash projection](./artifacts/ingress-proxy-runtime-projection-1.md) retains the two fixed events, distinct run identities and full sanitized-log digests. Each event fits the 512-byte limit; each run retains one event with sequence 1, well below 32 events/16 KiB. Full logs include original source-byte hashes; all three source files were unchanged across both commands. The wrapper captured both streams, validated UTF-8 fatally, normalized terminal controls, fully completed path sanitization and applied a narrow credential-indicator screen before exclusive-create retention. Review found startup/module/version output, disposable synthetic paths and bounded test diagnostics, not live credentials/customer/request-body data. The screen/path checker is not universal secret scanning or acceptance proof.

Both managed commands returned 0 and printed normal graceful app shutdown. The existing runner returns success only after `cleanTestClaim` reports `cleaned`; otherwise it throws. Read-only post-exit observation also confirmed both exact run-owned data/generated directories absent. This is runner-reported resource cleanup plus local directory observation, **not an independent Redis/database forensic audit**. No manual cleanup, process signal or test-owned app shutdown occurred.

**Bounded result:** F1/F2 test-module registration and no-listener construction/proxy qualification is implemented and observed in both fresh graphs. Original generated-drift/owner-type/style failures remain chronological; the metadata scope amendment and equality-conditional baseline-debt disposition are separately approved. No production registration, endpoint/listener, original HTTP delegation, system/error/disposal/shutdown chain, binding/OAuth/security readiness or production budget/sink policy is qualified. Native-core and C3 evidence retain their own scope.

**Single next action:** prepare one concentrated F3 production-ingress contract disposition under dossier section 11, with finite exit criteria for trusted binding/readiness, effective AOP and system/error ownership through disposal, module-flag/ordinary-route preservation and app-close drain. Reuse the now-observed F1/F2 construction result; do not repeat its feasibility or C3 qualification. This recommendation is not execution approval or permission to activate a production endpoint. F4 live configuration and full runtime/release evidence remain independent. WBS-MCP-20-01/Phase 20 remain **blocked**, full ATPs **open**, verified **0/12**, production DEC-MCP-04/07/08 **Proposed as a whole**. No staging, commit or push occurred; ignored full logs remain local, not remotely durable.

## Final documentary checks

[Final check log](./artifacts/ingress-proxy-final-checks-1.log) records scoped eight-document formatting and recheck, full `spec:check` (68 definitions/exact-ID chain/local links), English chart generation/freshness at 0/12, docs build (producer 0, 10,532 ms; existing >500 kB chunk warning), whitespace check and explicitly scoped path checking (status 0/no diagnostics). All producers exited 0 and sanitization completed successfully. [Final preservation observations](./artifacts/ingress-proxy-preservation-2.md) confirm unchanged history/unrelated progress, final source hashes and exact run-owned directory/claim absence. Path recognition and narrow sensitive-content review have bounded coverage, not universal secret scanning. These documentary/static gates remain separate from bounded runtime observations and human full-ATP acceptance; they do not clear F3/F4, accept whole production ADRs or advance WBS status.
