# SSR Initialization Owners — 2026-10-29

## Outcome and boundary

The [test-isolated baseline](./ssr-test-baseline-2026-10-29.md) measured warm app initialization at approximately **4.3–4.8 ms p50** on `/demo/basic/state`. This follow-up identifies concrete initialization owners before considering app reuse. It changes neither initialization semantics nor application lifetime and implements no pool, reset hook, shared Query data or optimization.

**Final decision on 2026-10-29: stop this optimization investigation.** The approximately 4.3–4.8 ms warm initialization cost is acceptable for the measured workload; retain fresh per-request applications and implement no pool. Monkey modules are few, and no exclusive dispatch bottleneck or measured gain was established, so implement no dispatch-list optimization either. API/schema, theme and fetch initialization remain identified inclusive paths, not an optimization backlog.

The runtime timing implementation and switch, dedicated tests, benchmark driver and public guide were removed during closeout. This record and its JSON retain historical measurements and hashes, not a supported current profiling interface. Original measurement changes were uncommitted, so the recorded HEAD alone cannot reproduce the experiment; complete removed source and transient loaders are not archived here.

Structured aggregates and source/artifact hashes: [owner evidence](./ssr-init-owners-2026-10-29.json).

## Method and validity

- Cabloy Basic, Web, **Vona integrated SSR**, source/test-mode backend, one worker, built frontend, anonymous direct-loopback HTTP, trusted timing opt-in.
- Existing `withIsolatedRun('e2e', ...)` and `withIsolatedVona(...)` own resources, readiness, shutdown and cleanup. No environment-file edits, development reset, manual port changes or unrelated process stopping.
- CPU sampling: Node CPU profiler with a target interval of 500 microseconds; **431/431 requests valid** (1 first-observed, 30 warmup, 300 serial, 100 at concurrency 4). Sampling covers process startup and all workload phases, not just warm initialization. Only the top 100 inclusive built-handler frames from the relevant worker profile were retained; raw profiles were disposed with successful managed cleanup.
- Wall attribution: a transient asynchronous Node loader injects wrappers into the loaded handler after shared Sys initialization. `sysApplicationInitialize` attaches per-app module/install/dispatch wrappers; actual Main/Monkey methods are wrapped after instance creation. App close flushes totals; process exit emits aggregates. **132/132 requests valid** (1 first-observed, 30 warmup, 100 serial, 1 final request). Exactly 100 app indices, 32–131, contribute to every emitted owner row. All 218 wall-owner rows are retained.
- Both successful runs used handler SHA256 `51545a6265357bc79e9df659ff24b8a81c399eae7ae5e66b7c49e273fe1c2975`. Artifact stability and successful managed cleanup were checked. No source or artifact profiling edits persist.

The first wall-attribution attempt failed **before readiness**, with `ERR_INVALID_RETURN_PROPERTY_VALUE` because the synchronous loader received a null source. It exited 1 and yielded no valid owner samples. Its resources remain subject to the managed runner's failed-run retention policy; no manual cleanup/reset was performed. The asynchronous loader retry succeeded.

### Important measurement limits

1. Async wrappers add clocks, awaits and scheduling overhead. In the attribution run, app-init p50 was **5.243 ms**, module initialization **2.389 ms**, `appInitialize` **1.281 ms**, and `appInitialized` **1.150 ms**. These are perturbed diagnostic values, not a replacement for the earlier baseline or an optimization comparison.
2. Each owner row sums that label's invocations within an app before computing percentiles across 100 apps. Recursive installs, nested bean creation and concurrent `Promise.all` work overlap. Owner totals can exceed the enclosing phase wall time; **do not add them or interpret them as exclusive cost**.
3. The per-app phase variable is not async-local. Concurrent nested work can restore it at different times, so phase labels are approximate. The default `setup` label also covers later rendering outside the explicit phases: its totals are **not** `ssr_init_setup`.
4. Wrapping occurs after `_installInner`; the newly created instance's first `moduleLoading` can be missed. Individual bean constructors and exclusive dispatch overhead were not timed.
5. CPU coordinates refer to runtime-transformed handler code, not reliable on-disk source locations. Evidence calls them `runtimeLine` / `runtimeColumn`; no exact source-map attribution is claimed. Named rendering, proxy/reactivity, bean and module frames provide broad corroboration only. Inclusive sample weights overlap and are not per-request wall durations.
6. Runtime registry size was queried too late, after disposal, and was absent. No runtime module-count claim is made.
7. The benchmark driver's target fields deliberately remain `unverified`; launcher/artifact inspection supplies the environment facts above. One lightweight page and one process per diagnostic run do not establish cross-route or production capacity results.

## Concrete owners

All values below are diagnostic per-app inclusive p50 milliseconds across the 100 serial apps. Invocation counts are per app, calculated from aggregate calls divided by 100. Rows overlap.

| Recorded path                                    | Calls/app | p50 ms | Source-confirmed work                                                   |
| ------------------------------------------------ | --------: | -----: | ----------------------------------------------------------------------- |
| `modules:dispatch:moduleLoaded`                  |        19 |  1.584 | Lifecycle dispatch, actual hooks and nested bean/module work            |
| `modules:hook:a-api:moduleLoaded`                |        13 |  1.226 | API and API-schema bean initialization; default API module use          |
| `appInitialized:hook:a-style:appInitialized`     |         1 |  0.886 | Theme model and base-CSS bean initialization                            |
| `appInitialize:hook:a-fetch:appInitialize`       |         1 |  0.668 | Fetch bean, config merge, composer, Axios instance and interceptors     |
| `appInitialize:hook:home-passport:appInitialize` |         1 |  0.262 | Passport model initialization                                           |
| `appInitialized:hook:a-router:appInitialized`    |         1 |  0.247 | Fresh router and guard setup                                            |
| `modules:dispatch:beanInit`                      |        38 |  3.347 | Inclusive, overlapping bean-init dispatch totals, not a phase partition |

`modules:install:home-api` records 52 calls/app and 1.453 ms p50. This **does not mean 52 installations**: `_install` includes the already-installed/wait paths, and the sum includes recursive overlap. `_installInner:home-api` records only one call/app. High repeat-entry counts are a reason to inspect the path, not evidence of repeated resource loading.

### 1. Module dispatch and API/schema initialization

Source: [AppModule](../../zova/packages-zova/zova-core/src/core/component/module.ts), [ordered iteration](../../vona/packages-utils/utils/src/utils.ts), [a-api Monkey](../../zova/src/suite-vendor/a-zova/modules/a-api/src/monkey.ts).

- `AppModule.initialize()` selects preload, monkey and sync capabilities separately.
- Every `_monkeyModule(...)` scans the full ordered module registry, including non-monkey modules. `forEach(...)` awaits the async callback for each registry entry, even when that entry has no eligible hook.
- It first invokes a targeted Main when applicable, then eligible installed per-app Monkeys, then AppMonkey. Reverse ordering is also supported. Sync dispatch has a corresponding scan.
- `a-api.moduleLoaded` eagerly obtains the target module's `api` and `apiSchema` beans and publishes them into that app's scope. Loading a-api also ensures the default API module is used. Bean initialization in turn triggers additional lifecycle dispatch.
- The observed a-api time therefore includes nested bean and module work; it is not a pure descriptor-building cost or proof of API network latency.

Sys already loads/installs server module resources and shares config, constants, locales and errors. App-level installation does not deep-clone those resources: its fresh record carries app installation state, Main/Monkey instances, scopes and component registration. Moving the entire module/bean path to Sys would incorrectly move app ownership with it.

### 2. Theme and styles

Source: [a-style Monkey](../../zova/src/suite-vendor/a-zova/modules/a-style/src/monkey.ts), [BeanTheme](../../zova/src/suite-vendor/a-zova/modules/a-style/src/bean/bean.theme.ts).

`appInitialized` creates the theme model and default CSS bean. Theme initialization owns state queries, watchers, theme/handler beans and token output. Cookie-disabled SSR deliberately applies both light/dark theme variants so the browser can resolve its final theme during bootstrap. That second application is a correctness requirement, not redundant work that can simply be removed.

Keep TypeStyle collection, theme model, tokens and render callbacks app/request-local. Immutable theme definitions might admit separate caching, but these measurements neither isolate their generation cost nor establish a safe cache key.

### 3. Fetch, passport and router

Source: [fetch Monkey](../../zova/src/suite-vendor/a-zova/modules/a-fetch/src/monkey.ts), [BeanFetch](../../zova/src/suite-vendor/a-zova/modules/a-fetch/src/bean/bean.fetch.ts), [composer](../../zova/src/suite-vendor/a-zova/modules/a-fetch/src/service/composer.ts), [passport Monkey](../../zova/src/suite/a-home/modules/home-passport/src/monkey.ts), [router Monkey](../../zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts).

Fetch setup merges API/config options, constructs a composer, creates Axios and installs interceptors whose closures reference app-owned state. `patchAxios` is already guarded globally. Passport models own request-sensitive token/persistence/watch state; router initialization owns history, guards and readiness. The observed time does not justify sharing those instances across requests.

## Candidate considered and declined

An ordered, Sys-registry-scoped list of modules with `capabilities.monkey` was considered to reduce full-registry traversal. It was not implemented and is **not recommended follow-up work under the current decision**: Monkey modules are few, inclusive measurements do not isolate traversal cost, and there is no demonstrated benefit to justify extra caching, invalidation and scheduling semantics.

In particular, the 3.347 ms inclusive bean-dispatch total is not a potential saving. High invocation counts alone do not establish a bottleneck. API laziness, theme caching and app pooling are also outside the closed scope. Reopen performance work only for an actual latency/throughput requirement with evidence pointing to a concrete owner, rather than to preserve an optimization candidate.

## Evidence handling and verification

Retained evidence contains aggregate timings, module/hook labels, repository-relative locations and hashes. It omits raw CPU profiles, full HTML, authentication material, origins, transient ports and environment snapshots. The path sanitizer has bounded coverage; path checking is not secret scanning, behavioral acceptance or a production-performance guarantee.

The attribution experiment itself changed only internal evidence and documentation; the subsequent approved closeout removed its runtime timing/tooling additions and restored the original SSR code. Historical measurements and hashes remain intact, with explicit closeout metadata added to both JSON records.

Closeout verification on 2026-10-29:

- Existing SSR profile/navigation unit tests: **10 passed**.
- `npm run build:zova:admin`, `npm run build:zova:web`, then `npm run deps:vona`: passed. The generated Vona lockfile alignment is retained rather than manually downgrading current generated dependencies.
- `npm run test:e2e -- cabloy-basic --grep 'ATP-BASIC-SSR-(01|02|03|04|06):'`: **5 passed**, covering Web hydration, cache policies/concurrent routes, anonymous Admin redirect and nested Admin hydration; managed process shutdown and cleanup completed.
- `npm run docs:build`: passed, with a non-fatal chunk-size warning.
- Authored runtime/tooling/public-documentation references and both deployed Basic Admin/Web JavaScript trees: no removed timing symbols found.
- Relative evidence links, JSON parsing, evidence-path checks and `git diff --check`: passed.

No production-performance gain, dispatch optimization or app-pool behavior is claimed.
