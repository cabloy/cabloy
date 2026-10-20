# Protected SQLite Registry Profile: Bounded Qualification and Documentary Reconciliation

## Authority and scope

Cabloy Basic; WBS-MCP-20-01 [execution dossier section 19](../../wbs-mcp-20-01-execution-dossier.md#19-proposed-protected-sqlite-registry-profile-and-bounded-execution-package-2026-10-19). On 2026-10-20, after the earlier limited five-test completion report was explicitly corrected, `zhennann` approved the concrete four-path correction, complete twelve-group qualification, fresh baselines, existing producer budgets/stops and bounded evidence/documentary handoff by replying “同意，请执行下一步”. This records acceptance/execution only of the bounded unregistered native profile, not whole DEC-MCP-08, production B/R integration or ATP/release closure. No repeat approval was inferred from task notifications.

Observed execution HEAD: `3fe6a4fd1c305e5079fe2d018e90b37380514a40`, branch `worktree-spec-basic-cabloy-mcp`. Preflight was **dirty**, with four attributable carried source paths from the preceding limited implementation, not a clean revision. [Preflight](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/preflight.json) and [before/after source disposition](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/source-disposition.json) identify bytes. Source authoring stayed within:

- `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts`
- `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/index.ts`
- `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/protectedSqliteRegistry.test.ts`
- `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/protectedSqliteRegistryFixture.ts`

The barrel's carried named exports did not change during correction. No scaffolding, bean/controller/service, schema/migration, generated metadata, shared ORM/client, configuration/environment, frontend or dependency-intent edit occurred. No commit/push, manual reset, reinstall, signals or production operation occurred. Standard approved managed disposable initialization/seeding and cleanup remained runner-owned.

## Implementation and supported class

The pure opaque owner explicitly prepares outside request boundaries; lookups require a live boundary. The production factory binds native `better-sqlite3`, the monotonic clock and framework boundary lookup. Test collaborators are direct implementation-file imports, not public barrel exports. The profile uses one private `readonly:true`, `fileMustExist:true`, `timeout:100` connection and one fixed preprepared exact binary-name/nondeleted/two-row query. It does not enter Knex/Tarn/Model/cache/event paths or supply native verbose/custom SQL/hooks/addons. SQL type/byte CASE guards and an invalid marker precede returned scalar validation; results/snapshots/facade are frozen and detached.

Corrections prevent prepare after close-before-open, refuse accessor/extra/inherited option shapes without evaluating a filename getter, reject malformed text and quarantine over-cardinality projections. Cleanup checks actual fixed close results before exact fixture-directory removal. Native caught errors are never inspected or serialized. One active read, zero queue, no retry/reopen/fallback; reentrant close closes admission immediately and defers actual close until native-call unwind, with a cached terminal Promise and truthful `close_failed` ownership retention.

Limits remain 256 UTF-8 bytes/name, 65,536 bytes/config, 1,000 ms admission budget and 100 ms private busy timeout. These do **not** bound scans/native CPU/VM work or provide cancellation. Readonly/open/no-create does **not** promise filesystem-write-free acquisition: WAL/SHM/locks may occur. Existing WAL is inspected, never converted or repaired in a request. Unsupported profiles are refused. Trusted in-process code is not a malicious Proxy/native-code sandbox. Datasource attestation/replacement, production workload/platform, B capability/startup/config, R installation and downstream sinks remain separate gates.

Installed context: Node `v24.8.0`, `darwin/arm64`, `better-sqlite3 12.11.1`, Knex `3.3.0`, Tarn `3.1.2`; native addon SHA-256 `c6fac315df023cf5efec45a3511e6515c6b0f7461a4a284b1b7a79c7ef8febe7`. Native fingerprint and 815 recorded shared manifest/lock/metadata/REST prerequisites were unchanged after producers. This bounded inventory is not universal filesystem forensics.

## Actual producer chronology

All captures are under [the fresh artifact directory](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/). Each producer has matching `<label>.json` disposition/source hashes and `<label>.log` complete sanitized streams. Exact commands are retained there; P labels correspond to section 19. All managed invocations use command-local `SERVER_LISTEN_DISABLE=true` and the standard root isolated runner, not raw test execution or a second app.

| Stage / label            | Observed result                                                           |
| ------------------------ | ------------------------------------------------------------------------- |
| P1-baseline              | `npm run deps:vona`, exit 0                                               |
| P2/P3-baseline           | Exact a-ormdialect/MCP no-emit semantic commands, both exit 0             |
| P4-baseline              | Vona composite, exit 0                                                    |
| P8/P9-baseline           | Foundation 12 passed/0 failed; owner 40 passed/0 failed; both exit 0      |
| source-format            | Exact four-path formatter write, exit 0                                   |
| P2/P3/P4-final           | Semantics/composite, all exit 0                                           |
| P5-final                 | Four-path format check, exit 0                                            |
| P6-final                 | **Exit 1**, eight test-only lint diagnostics; stopped remaining producers |
| source-format-correction | Scoped lint correction plus exact formatter write, exit 0                 |
| P2/P3/P4-correction      | Semantics/composite, all exit 0, on the lint-corrected bytes              |
| P5/P6-correction         | Four-path format/lint, both exit 0, on the lint-corrected bytes           |
| P7-final                 | **Exit 1; 5 passed/7 failed**; stopped P8/P9; failed resources retained   |
| P7-correction            | Sole runtime correction/rerun: **12 passed/0 failed**, exit 0             |
| P8/P9-final              | Foundation **12/0**, owner **40/0**, both exit 0                          |

The initial lint failure and P7 failure remain retained, not rewritten as passes. Manual content redaction in the lint capture is documented below. The first P7 failure exposed fixture storage typing: native number parameters bind SQLite REAL, while deliberately affinity-free columns must contain INTEGER for valid id/boolean samples. Driver source `vona/node_modules/better-sqlite3/src/util/data.cpp:2–11` confirms number/double versus BigInt/int64 binding. The sole runtime correction changed only fixture seed/sample bindings to BigInt for intended integer values. Fractional/unsafe/text/BLOB malformed samples remain; production guards were not relaxed.

Twenty P executions occurred (including six managed invocations), within twenty-two maximum. Two exact-source formatter writes are separately recorded authoring operations, not hidden P reruns. Ten deps passes occurred including P1, three composites and six managed preruns, within twelve maximum. No capture overflow, fatal decode failure, supported path-sanitizer failure, observation exceedance or shared-prerequisite drift was recorded. Observation thresholds did not authorize killing or artificial settlement.

## Twelve-group runtime matrix

Final runtime suite has twelve serial groups, no sampling; case/suite limits 15/120 seconds. [P7 correction](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/P7-correction.log) records their actual pass and bounded numeric/boolean diagnostics.

| Group | Demonstrated scope                                                                                                   | Proof distinction                                           |
| ----- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1     | Thirteen unsupported shapes, zero getter/opener/poison reads; missing file not created                               | Controlled options and real production-factory missing file |
| 2     | Explicit outside-boundary prepare, boundary-required lookup, no first-use open, fixed counters/states                | Controlled plus real private SQLite                         |
| 3     | Fixed parameter/binary/deleted/two-row shape; empty/exact-byte/multibyte/NUL names; invalid input before execution   | Controlled statement/bindings plus real collation           |
| 4     | Missing/one/duplicate/deleted/disabled classifications, malformed duplicate denial, detached frozen scalar row       | Real synthetic SQLite                                       |
| 5     | NULL/empty/at-limit config; eighteen malformed SQL/projection samples refused                                        | Real SQLite projection guards plus controlled validation    |
| 6     | Separate writer commits visible to repeated prepared reads; previous detached result unchanged                       | Real SQLite, not B config/generation proof                  |
| 7     | Six native failure-stage poison collaborators untouched, ordinary owned getter control observed                      | Controlled local faults, no global exporter interception    |
| 8     | Query/projection/preparation quarantine, no retry/reopen, private cleanup owner retained                             | Controlled failure classes                                  |
| 9     | Expired/late refusal, reentry, active-call close unwind, no success after closing                                    | Controlled clock/native collaborator, no cancellation proof |
| 10    | Effective readonly/write refusal/no-create/WAL/timeout; non-WAL unchanged and refused; ordinary writer unaffected    | Real native profile and local controlled mismatch           |
| 11    | Actual healthy close once; unopened close prevents open; close failure remains faulted/owned                         | Real healthy close versus controlled failure                |
| 12    | Reverse close attempts and uncertain-close no deletion; healthy exact-child cleanup; existing 12/40 regressions pass | Real local cleanup versus controlled custody witness        |

## Resource and capture custody

[Resource disposition](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/resource-disposition.json) records read-only checks of exact observed run paths. The two baselines and three successful final managed runs reported graceful app shutdown; data/generated/claim paths were absent. Root runner exit 0 additionally requires `cleanTestClaim` status `cleaned` (`scripts/runIsolatedTest.ts:642–650`). This is observed runner/path proof, not independent Redis forensics. Private healthy fixture diagnostics report closed owners and zero open native handles before/after exact child removal.

The original failed P7 also reported graceful app shutdown but explicitly retained resources. Its exact data/generated/claim paths still existed when inspected. Later success does not clean or supersede that failed-run custody; no manual cleanup was performed. Controlled uncertain cleanup used no live native close-failure injection.

Complete streams were buffered within 2 MiB/stream, 4 MiB combined; fatal UTF-8 decoding, terminal/newline normalization and supported complete-buffer path sanitation preceded retention. Bounded proof diagnostics contain server-owned aliases/counts/booleans only. Manual content inspection of producer captures found four quoted malformed synthetic text/path literals in the lint advice; these were replaced with a fixed redaction marker while preserving locations/rules/failure/advice. [Manual review record](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/manual-capture-review.json) records before/after hashes. No protected row/config/SQL/binding/raw native-error payload or credential was observed elsewhere in the inspected captures. Managed assertion/runner failure stacks and repository-relative runtime paths are retained as ordinary failure evidence. This is neither universal secret scanning nor authenticity/design acceptance. Ignored `.log` captures are local and unstaged; no forced staging occurred.

## Historical static gap and documentary handoff

The following two paragraphs record the stop **before** the separately approved amendment below; they are preserved as history, not the current qualification disposition. **At that stop, full section-19 qualification could not be claimed.** P2–P6 correction checks passed before the final fixture-only INTEGER binding correction. Their source hashes differ from P7-correction/P8/P9-final only for that fixture. Thus current lib/barrel/test semantic/style observations remain traceable, but the final fixture bytes lack fresh static verification. The approved P2/P3/P4/P5/P6 maxima are exhausted; no extra check was run by borrowing unrelated allocations. Runtime success alone cannot close this gap.

One next action: seek a **verification-only amendment**, no source authoring or runtime/deps rerun, for one MCP no-emit project check and exact four-path format/lint checks against the frozen final bytes; each once with no automatic retry, same capture limits, stop on failure/drift. The selected MCP project imports the profile and fixture; the Vona composite workflow does not establish test-file coverage in place of that project check. Further changes or checks need their own bounded disposition. The original P7 failure and retained-run custody remain historical even if the amendment passes.

Initial documentary D1 exited 1 on the new summary and selected progress-cell formatting; remaining D producers stopped. That failure is retained. The scoped documentary correction formats the summary and restores the selected cell's existing table padding without altering other progress cells. Subsequent D1-correction and D2–D6 captures, when present, identify their actual exits and frozen input hashes; they are independent from this source-check gap and do not self-certify their own final captures. No final documentary pass is predeclared here. WBS-MCP-20-01 and Phase 20 remain **blocked**, ATPs **open**, verified **0/12**. No production datasource, full endpoint, OAuth/host/instance admission, downstream sink, release or successor execution is qualified or authorized.

## Approved verification-only amendment and bounded outcome

After the historical static gap was reported, `zhennann` explicitly approved the proposed three-check amendment, each once without automatic retry. [Amendment preflight](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/amendment-preflight.json) records that authority and frozen final source hashes. No source authoring, runtime/deps rerun or additional cleanup occurred in the amendment.

| Final-byte check                                                      | Disposition | Duration  | Capture                                                                                                   |
| --------------------------------------------------------------------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------- |
| MCP project no-emit semantics, including imported profile and fixture | Exit 0      | 13,961 ms | [JSON](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/amendment-MCP-semantics.json) |
| Exact four-path format check                                          | Exit 0      | 263 ms    | [JSON](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/amendment-source-format.json) |
| Exact four-path lint check                                            | Exit 0      | 1,265 ms  | [JSON](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/amendment-source-lint.json)   |

All three dispositions record valid complete captures, no source/shared drift and passed path sanitation. Their four source hashes match [successful P7 runtime](./artifacts/protected-sqlite-registry-3fe6a4fd1c-20261020-correction/P7-correction.json). **The final-fixture static gap is closed; the unregistered profile is implemented and qualified within the declared configuration class only.** Earlier composite/baseline observations retain their own input revisions; the amendment supplies the missing final test-project coverage, not a new runtime/composite pass. The original lint/runtime failures and failed-run custody above remain unchanged.

The earlier documentary D1 failure was followed by D1-correction and D2–D6, all exit 0 with valid captures and no shared drift. Those passes cover their recorded documentary hashes only. They do not certify the later reconciliation bytes or their own last capture. The new documentary verification record linked below identifies this increment's actual checks separately.

## Main-source synchronization and next boundary (2026-10-20)

After the user updated Basic main and synchronized it back, reconciliation preflight observed clean `dacbf27fd51cbbf15ed1f9f190310d3876999a97`; local main `74ff2068114a7cdbb30744dc27bb60f75dca26bd` is its ancestor. A read-only byte/hash comparison confirmed all four paths still match the amendment, and the two framework paths are identical to local main. This establishes source applicability, **not runtime qualification at the newer HEAD**, native ABI/deployment compatibility or remote publication. No source checks, dependency installation or runtime tests were repeated in this documentary increment.

The user approved reconciliation of this summary, phase-20 index, dossier and selected progress Next action plus preparation of one finite B existing-ready admission execution package. [Dossier section 20](../../wbs-mcp-20-01-execution-dossier.md#20-proposed-existing-ready-admission-foundation-execution-package-2026-10-20) owns that proposed package. Preparation does not approve framework implementation, production registration or B/R integration. Basic main remains the sole framework source of truth; framework implementation and synchronization need their own explicit scope.

WBS-MCP-20-01 and Phase 20 remain **blocked**, full ATPs **open**, verified **0/12**. One next action is disposition/execution approval of the finite section-20 package, not another pure-profile qualification cycle. This round's documentary checks and preservation observations are recorded in [the reconciliation artifact directory](./artifacts/b-admission-package-dacbf27fd5-20261020/); no passing result is inferred from a planned command.
