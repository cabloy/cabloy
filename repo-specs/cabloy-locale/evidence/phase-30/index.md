# Development Locale Reload Evidence

## Scope and Authority

- Task: [WBS-LOC-30-02](../../pdp-wbs.md#wbs-loc-30-02-preserve-provider-overrides-through-development-reloads), independently dependency-ready after the bounded Japanese WBS-LOC-20-01 proof.
- Chain: PRD-LOC-06 → SRS-LOC-11 → WBS-LOC-30-02 → [ATP-LOC-06](../../test-plan.md#atp-loc-06-match-reload-behavior-to-clean-registration).
- Edition: Cabloy Basic. Existing Basic Web flavor `cabloyBasicWeb`; no new Site, route, API, DTO, language policy, migration or persistence owner.
- The user explicitly approved the bounded execution dossier on 2026-10-25, including focused service/Sys regressions, minimal reload repairs, actual development watcher edits/deletions, clean-start comparison, and owned cleanup. This does not authorize adjacent tasks, reset/init, environment/port edits, reinstall, commit, publication or deployment.
- Execution base: `e6324778c8d8aeab1b5faa5402300039b3fd226d`. This externally created commit includes the preceding phase-20 records/lockfile alignment; it was not created by this execution. Prior untracked metadata tests remain preserved, not attributed as new reload work. The base SHA alone does not reproduce the dirty tested source; final attribution is recorded below after checks.

## Repair and Regression Boundary

`vona/src/suite-vendor/a-vona/modules/a-hmr/src/service/hmr.ts` previously replaced only a normal target's scoped dictionary. Startup also builds an ordered global dictionary, so changed/deleted ordinary values could remain stale globally. The repair calls the existing `worker.reload()` from the locale scene. The watcher already broadcasts that scene; another `reloadAll()` broadcast is unnecessary. Fresh startup restores project/provider precedence and both maps without retaining mutable module contributions or introducing a generic ownership registry.

The backend loader's override snapshot already includes project and provider resources before ordinary defaults. Its placement was verified, not moved again. Existing inner HMR watches provider aggregators, and outer CLI nodemon observes imported helpers; actual observations below distinguish these layers.

Focused backend coverage in existing `locale-test/test/locales.test.ts` invokes actual `ServiceHmr._reloadLocale`, verifies the restart boundary and unchanged pre-restart maps, then invokes real fresh `loadLocales`. It covers scoped/global value changes, key deletion, ordered collision fallback, project/provider precedence, and envelope separation. This fixture is not a watcher test.

Frontend coverage in existing `locale-test/test/locale.test.ts` uses actual ZovaSys initialization, the registered `vite:beforeFullReload` callback, close/disposal and reinitialization, plus fresh-Sys comparison and direct SysLocale disposal/reinitialization. The event transport is a fixture, not a Vite watcher. No frontend production change, route metadata, generated consumer, shared schema state or style/theme behavior was changed.

## Development Resource Boundary

Only the existing `npm run dev:one` and `npm run dev:zova:web` commands were used, with installed Node 24.11.0 supplied through child-scoped PATH. Existing prepared worktree development databases were reused. Startup version/instance checks passed; no database reset or creation command was run. Existing configured backend listener `7104`, Web listener `9002` and HMR listener `24681` were used unchanged. Other Basic/Start worktree runtimes were identified and left untouched. Local override files were checked for existence only; their contents were not read to select values.

Initial qualification artifacts: [backend startup](./artifacts/backend-dev-startup.txt) and [Web startup](./artifacts/frontend-dev-startup.txt). Backend qualification producer and sanitizer both exited 0 after owned shutdown. Web qualification was intentionally interrupted with SIGINT; its wrapper reported exit 1, not a successful verification result. The first browser probe without backend availability displayed connection refusal; later watcher runs kept the owned backend available for the standalone Web API dependency.

## Exact Watcher Procedure

[The retained ATP procedure](./watcher-proof.mjs) runs real child development commands and Playwright Chromium against the existing Web URL, not a source-evaluation/mock loader. It temporarily modifies only authored files whose original bytes are saved and restored in `finally`:

1. Add synthetic project target override and colliding provider/ordinary text for explicit `en-us` lookup. This avoids changing the product's enabled languages or default; Japanese resource installation remains independent of enablement.
2. Add a temporary backend `home-base` Main `moduleLoaded` observer that logs actual `AppLocale.getText` scoped/global arrays and worker PID. No public endpoint is added.
3. Start the backend, establish baseline, then edit the ordinary target dictionary, provider aggregator, and imported per-target helper in sequence.
4. Delete a helper key, then remove an entire provider target contribution. A unique target-only key (`home-index` on Vona, `home-indexweb` on Zova) verifies scoped/global removal independently from deleting a key in the remaining target.
5. Await actual watcher startup/restart output and expected lookups after each filesystem write, then stop and restart against the same edited source and compare with clean startup.
6. Repeat the five edits on Zova. Query the live browser `window.sys.meta.locale`; require a changed document time origin after every edit without manually reloading the page. Compare with a newly started development server and fresh browser document.
7. Close only owned browsers/process groups, restore original bytes for all nine temporary source paths, and retain restoration hashes. No shared identity/port/configuration or business records are changed.

The JSON artifacts retain the exact synthetic source fragments, edited paths/hashes, ordered key lists, snapshots, PIDs/document identities and cleanup. These hashes refer to original source bytes, not path-redacted artifact bytes. The procedure defaults to exclusive artifact creation; pass a fresh filename prefix for another authorized run.

## Observed Checks and Failures

| Check | Observed result | Primary artifact |
| --- | --- | --- |
| Initial DB-free direct import of decorated HMR service | Failed with the framework's config/import guard; not an acceptable way to bootstrap this service. No decorator interception or mock loader added. | [Import failure](./artifacts/backend-service-reload-red.txt) |
| Managed actual-service regression before repair | 4 passed / 1 failed (`Missing expected rejection`), proving the old path did not request restart. | [Managed red](./artifacts/backend-service-reload-managed-red.txt) |
| `npm run test -- 'locale-test/test/*.test.ts' 'test-vona/test/locale.test.ts'` after repair | 10 passed / 0 failed, producer 0 / sanitizer 0; managed graceful shutdown and successful run cleanup. | [Managed green](./artifacts/backend-service-reload-managed-green.txt) |
| Native Vona typecheck, `node scripts/typecheck.ts native vona --noEmit --incremental false --project tsconfig.json` | Producer 0 / sanitizer 0. No extra dependency preparation. | [Backend types](./artifacts/backend-service-reload-typecheck.txt) |
| Backend scoped formatter/lint/diff checks | Passed for service and regression files. | [Backend style](./artifacts/backend-service-reload-format-lint.txt) |
| Initial real watcher run | Both seven-snapshot sequences passed, all temporary sources restored, but overall exit 1 because the backend npm/nodemon wrapper did not exit within 15 seconds. Later inspection found no remaining listeners. Not recorded as complete acceptance. | [Initial snapshots/cleanup failure](./artifacts/watcher-proof.json), [backend](./artifacts/backend-watcher.txt), [Web](./artifacts/frontend-watcher.txt), [Web clean start](./artifacts/frontend-clean-start.txt) |
| First watcher rerun | Both sequences and cleanup passed, overall exit 0. The otherwise-idle owned nodemon CLI needed a second SIGINT after its worker/master had shut down; only that verified owned process was signalled. | [Rerun snapshots](./artifacts/rerun-watcher-proof.json), `rerun-*.txt` |
| Stronger unique-target fixture, first attempt | Backend seven snapshots passed; Web baseline timed out because the fixture incorrectly targeted backend-only `home-index`. Zova correctly skipped that absent target. Overall exit 1; all sources restored and cleanup completed. Corrected only the fixture target to observed frontend `home-indexweb`, retaining the failed attempt. | [Fixture failure](./artifacts/final-watcher-proof.json), `final-*.txt` |

The pre-repair failed managed run intentionally retained its runner claim/resources `20261025123234-8a45a6cd` under existing failed-run policy. They were not manually removed or reset. The successful managed run `20261025123624-3b9df796` automatically removed its owned runtime/database/claim paths. Retaining failed-run inspection resources is separate from development process cleanup.

Initial Vite cold dependency optimization produced transient dynamic-import failures, disposed-module errors and hydration warnings in development output. These remain visible in the initial/rerun artifacts. Registry assertions alone do not prove complete-page hydration correctness, and this increment does not close ATP-LOC-04. The final sequence waits for startup optimization to settle before edits; its actual console/result disposition is recorded at closure rather than suppressing diagnostics.

## Evidence Privacy and Limits

The first backend qualification capture emitted a development credential diagnostic before the path-only sanitizer. The retained diagnostic line was explicitly redacted after discovery; it must not be interpreted as having been secret-safe at initial capture. No credential value is reproduced in this record. The runtime was stopped, and later procedure output is credential-redacted in memory before durable retention. No credential configuration or rotation was performed.

While the first capture was still open, presentation-only rewrite left NUL padding when the producer appended shutdown output. After closure, 499 padding NUL bytes were removed; shutdown/failure text and exits were preserved. Backend managed logs also required ANSI SGR-only normalization. The path checker passed afterward. The one-shot procedure additionally replaces checkout/home paths before retention; the repository path checker and manual content review remain required. Neither path checking nor these targeted redactions are universal secret scanning or ATP proof.

## Closure

### Final runtime and focused checks

- Final accepted command: `PATH=<installed-node-24.11.0-bin>:$PATH node repo-specs/cabloy-locale/evidence/phase-30/watcher-proof.mjs accepted-`, exit **0**. [Accepted report](./artifacts/accepted-watcher-proof.json) retains seven backend and seven frontend snapshots: baseline, five actual filesystem edits with automatic reload, and equivalent clean startup on the same final source. [Backend watcher](./artifacts/accepted-backend-watcher.txt), [backend clean start](./artifacts/accepted-backend-clean-start.txt), [Web watcher](./artifacts/accepted-frontend-watcher.txt), and [Web clean start](./artifacts/accepted-frontend-clean-start.txt) retain real process output and owned wrapper exits.
- Both scoped/global maps preserved project/provider precedence, reflected ordinary/aggregator/helper edits, and returned raw keys after key and whole-target contribution removal. The unique removed-target marker is independent from the remaining home-base contribution. Backend worker/restart observations and Web changed-document identities are retained; no manual page reload substituted for the watcher.
- All nine temporary source paths were restored byte-for-byte; hashes were checked again against the accepted report after completion. No cleanup error was reported. Owned backend/Web listeners were absent after shutdown; only owned process groups were signalled. The failed managed test resources described above remain intentionally retained, not confused with a live dev process.
- Backend managed **10/10** tests, native typecheck and scoped style checks passed as linked above. [Frontend lifecycle checks](./artifacts/frontend-lifecycle-tests.txt) retain the exact `node --experimental-transform-types --test zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts` command and final **6/6** pass, native Zova typecheck, formatter, lint and diff-check exits **0**. An earlier native typecheck failed with TS2322/TS2790 because the new test assigned/deleted ambient boolean `process.env.DEV`; the test now uses the existing `Record<string, string | undefined>` fixture access idiom. The failure and successful restored-source rerun remain in the same artifact.
- The accepted Web baseline captured one cold dynamic-import pageerror for home-passport. After the explicit startup-settlement interval, the five-edit observation captured no new pageerror. Runtime console output still retains cold optimizer/disposal/hydration diagnostics. This is registry reload correctness, not a claim of warning-free startup, complete-page hydration, ATP-LOC-04 or full two-language acceptance. No frontend production source changed, so this test-only frontend diff did not require another paired production SSR/REST build or generated-consumer handoff.

### Final source attribution

Base: `e6324778c8d8aeab1b5faa5402300039b3fd226d`, plus the following three uncommitted authored sources:

| Source | SHA-256 |
| --- | --- |
| `vona/src/suite-vendor/a-vona/modules/a-hmr/src/service/hmr.ts` | `8a20ec1fdd2bf904a5223bd565771a911ec918f3733c1b610fb2d340e2a490be` |
| `vona/src/suite/cabloy-locale/modules/locale-test/test/locales.test.ts` | `ec3ebcd1c695a3a4523180aa34f1c73362382d45ed19a88a55fa1e6806b9ec33` |
| `zova/src/suite/cabloy-locale/modules/locale-test/test/locale.test.ts` | `a98633510e413564a0671ba0ce78fd7fb3635f09a578cf8d60c645b39dcaa986` |

Reload-only diff SHA-256: `d06bc7368741e1fbbd1aa03b82068220040aa949413ab6c65b6b3f3f268bb3b6`, calculated over exact bytes from `git diff --binary HEAD --` followed by the three paths in the table's order. Evidence, progress, README, charts, previous untracked metadata tests and restored runtime fixture edits are excluded from this digest. The base alone is not the tested snapshot.

### Disposition

**WBS-LOC-30-02 verified for its bounded reload-correctness contract / ATP-LOC-06.** Applicable real watcher and lifecycle proof is retained; earlier failed attempts are not relabelled as passing. [Documentary closure checks](./artifacts/closure-checks.txt) retain exits **0** for full `spec:check` (32 definitions), deterministic chart generation/freshness (English, 2/6 verified), phase-30 path check, five-file scoped formatting and `git diff --check`. Authority audit is static structure only; chart freshness is not ATP proof or human approval. The formatter excludes the evidence pair even when an explicit ignore-path override is supplied (exit 2 retained); no formatter pass is claimed for those two files, and primary runtime artifacts were not reformatted. Progress now distinguishes two verified tasks, one planning-complete task and three not-started tasks.

Both refreshed SVGs were rendered in Chromium and visually inspected: labels remain readable without observed clipping/overlap, the roadmap shows WBS-LOC-30-02 verified and WBS-LOC-30-01 as a dependency-ready candidate, and the scope-count view correctly shows 2/6 verified with four remaining (including the planning-complete item). Existing generator styles and non-calendar semantics were preserved. Screenshots were temporary inspection output, not new product artifacts.

Supplemental review of all 29 retained UTF-8 files at this point found no machine-local root strings, Bearer values, JWT-shaped values, NUL or ANSI controls in the targeted pattern checks. Accepted fixture/source fragments, reload snapshots and diagnostic boundaries were also inspected. This limited review supplements the bounded path recognizer; it does not certify general secret absence. [Final recheck](./artifacts/final-closure-checks.txt) records the post-edit audit/freshness/path/diff and source-restoration checks.

No reset/init, environment/port edit, dependency reinstall, commit/push, deployment or publication was performed. Full dictionaries, Traditional Chinese delivery, attributable human terminology review, complete consumer integration and release acceptance remain outside this closure. The single next candidate is a separately approved WBS-LOC-30-01 dictionary-inventory execution dossier with explicit terminology-review ownership; no adjacent execution is authorized.
