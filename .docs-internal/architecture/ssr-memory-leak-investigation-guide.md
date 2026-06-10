# SSR Memory Leak Investigation Guide

This note records the confirmed root cause, the formal fix, the measurement workflow, and the residual-runtime findings from the Zova SSR memory leak investigation.

Use it when future work needs to:

- re-check SSR leak regressions after framework changes
- understand why `withCurrentInstanceScopeSSR(instance, fn)` exists
- reproduce the `toolMinimal` vs `toolTwo` comparison workflow
- distinguish a real business-object leak from normal Node/V8 async-runtime retention

## Why this note exists

The investigation started from a strong SSR leak signal on the demo SSR pages and ended with a formal runtime-core fix plus several rounds of follow-up analysis.

The main risk for future contributors is not forgetting the final API name. The bigger risk is forgetting:

- which execution boundary actually leaked
- which pages were used as control vs comparison
- which measurements were meaningful
- which retained objects turned out to be runtime noise rather than a second business-level root cause

This guide preserves those conclusions so future leak investigations can start from the right baseline.

## Final conclusion

The confirmed primary leak cause was:

- Zova's simulated setup restored Vue `currentInstance`
- but it did not restore Vue SSR setup state
- so SSR-only composable/runtime behavior executed under incomplete setup semantics

The formal fix was to move the helper into the real `@cabloy/vue-runtime-core` source and consume it from Zova:

- `withCurrentInstanceScopeSSR(instance, fn)`

After that fix:

- the main SSR leak slope dropped by an order of magnitude
- `toolMinimal` returned to normal after-GC behavior
- `toolTwo` retained only a very small tail
- later retainer-path analysis did **not** confirm a second business-level root cause

## The control pages

Two pages were used repeatedly because they isolate different layers of SSR work.

### `toolMinimal`

Sources:

- `zova/src/suite/a-demo/modules/demo-basic/src/page/toolMinimal/controller.tsx`
- `vona/src/suite-vendor/a-test/modules/test-ssr/src/controller/toolMinimal.ts`

Purpose:

- minimal SSR page
- controller lifecycle and render path only
- no extra page-data model layer

This page is the control for answering:

- does the core SSR page lifecycle leak on its own?
- is a retained object family specific to the page-data/model path, or common to any SSR request?

### `toolTwo`

Sources:

- `zova/src/suite/a-demo/modules/demo-basic/src/page/toolTwo/controller.tsx`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/model/pageData.ts`
- `vona/src/suite-vendor/a-test/modules/test-ssr/src/controller/toolTwo.ts`

Purpose:

- same SSR page chain as `toolMinimal`
- plus `ModelPageData` hydration / page-data access

This page is the comparison for answering:

- does the page-data/model path introduce a second leak source?
- after the main fix, does the residual tail come from router/model/page-data logic or from runtime internals?

## The real leaking boundary

The critical boundary was the simulated setup helper used by Zova contexts.

Primary source:

- `zova/packages-zova/zova-core/src/core/context/util.ts`

Current behavior:

- client uses `withCurrentInstanceScope(...)`
- server uses `withCurrentInstanceScopeSSR(...)`

That helper is the main source-of-truth boundary for SSR simulated setup.

If future regressions appear, this file is the first place to inspect.

## Why the fix belongs in runtime-core

The bug was not merely a Zova-local missing branch. The mismatch was between:

- Vue's real SSR setup semantics
- Zova's simulated setup window

Because the missing state was runtime-core state, the durable abstraction needed to live in `@cabloy/vue-runtime-core`, not in a Zova-local shim.

That is why the final API is:

- `withCurrentInstanceScopeSSR(instance, fn)`

and not:

- a local symbol-based tracker
- a global setter bridge from `globalThis`
- an env-gated experimental patch in Zova

## Important execution paths covered by the fix

The fix matters anywhere Zova re-enters Vue composable behavior from simulated setup.

Representative sources:

- `zova/packages-zova/zova-core/src/composables/useController.ts`
- `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
- `zova/packages-zova/zova-core/src/core/context/hooks.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts`

These were the important categories:

- controller / render / style bean `__init__`
- hook replay through `ctx.util.instanceScope(...)`
- SSR `useSSRContext()` access
- SSR `$useMeta(...)`
- model `useQuery` / `useMutation` wrappers

## Why `CtxComponent` patches `render` and `ssrRender`

A separate but closely related boundary in this investigation was:

- `zova/packages-zova/zova-core/src/core/context/component.ts`

This file matters because Zova pages and components do **not** treat the outer Vue component as the final business render source.

Representative source:

- `zova/packages-zova/zova-core/src/components/component.ts`

That outer component mainly:

1. runs `useControllerPage(...)`
2. creates a `ZovaContext`
3. loads controller/render/style beans
4. returns a minimal outer render shell

The real business UI is then produced by either:

- the controller bean's `render()`
- or a separate render bean's `render()`

### Why patch `instance.render`

`CtxComponent.activate()` replaces the instance's `render` function so that, once the bean graph is initialized, the component render path is redirected to the bean-side render chain.

In practice that means:

- before `ctx.meta.state.inited` is ready, it falls back to the original Vue render
- after initialization, it calls the controller/render bean path instead

This is the runtime bridge that lets Zova use controller/render beans as the real render authority while still mounting through normal Vue components.

### Why clear `instance.ssrRender` and `type.ssrRender`

Vue SSR prefers `ssrRender` when it exists.

The relevant runtime behavior is:

1. server-renderer checks `instance.ssrRender || comp.ssrRender`
2. if an SSR render function exists, Vue executes that path directly
3. otherwise, if `instance.render` exists, Vue falls back to `renderComponentRoot(instance)`
4. `renderComponentRoot(instance)` then executes `instance.render(...)`

This matters because if the compiled `ssrRender` path remains active, SSR can bypass Zova's patched `instance.render` and therefore bypass the controller/render bean chain.

By temporarily setting both of these to `null` during the component lifetime:

- `instance.ssrRender`
- `instance.type.ssrRender`

Zova forces Vue SSR to use the fallback branch that ultimately executes the patched `instance.render`.

That is how SSR output is kept aligned with the same controller/render-bean business path that Zova wants to own on the client.

### Why both levels must be reset

Resetting only one level is not enough.

Because Vue SSR reads:

- `instance.ssrRender || comp.ssrRender`

any surviving SSR render function can still short-circuit the fallback.

So Zova clears:

- the instance-level `ssrRender`
- and the shared component-type `ssrRender`

before rendering, then restores both during disposal.

### Why the component-type reset uses a reference count

`instance.type` is shared across concurrent SSR requests.

Without a reference count, one request could:

1. clear `type.ssrRender`
2. finish first
3. restore `type.ssrRender`
4. while another in-flight request still needs the fallback-to-`instance.render` behavior

That would re-enable the compiled SSR path too early for the still-running request.

The `SymbolTypeSSRRenderResetCount` tracking in `CtxComponent` prevents that by restoring the shared `type.ssrRender` only when the last active reset scope exits.

### Why this matters for leak investigation

This render-patch boundary is not just a correctness detail.

It sits at the intersection of:

- component-instance lifecycle
- shared component-type mutation during SSR
- controller/render bean ownership
- per-request cleanup timing

That is why it became an important place to audit while checking whether SSR retained graphs were caused by business render ownership problems or by lower-level runtime behavior.

## Build and run workflow used during investigation

When frontend code changed, the safest alignment step was:

```bash
npm run build
```

That rebuilds Zova and then Vona so the SSR output and backend assets stay aligned.

A typical single-worker SSR verification command was:

```bash
cd vona
SERVER_LISTEN_PORT=7907 SERVER_WORKERS=1 SSR_MEMORY_DIAG_TOKEN=diag7907 node --inspect=9231 ./dist/normal/bootstrap.js
```

Representative test URLs:

- `http://127.0.0.1:7907/demo/basic/toolMinimal`
- `http://127.0.0.1:7907/demo/basic/toolTwo`

## Which measurements mattered

The investigation used several different measurement styles, but they do not all mean the same thing.

### 1. External RSS only

Use for quick screening, not final judgment.

What it can tell you:

- whether memory is obviously climbing
- whether a change drastically changes process growth

What it cannot reliably tell you:

- whether objects survive after GC
- whether growth belongs to request objects or runtime caches

During this investigation, external RSS alone could be misleading. Some runs made `toolMinimal` look worse than `toolTwo`, but after-GC measurements removed that conclusion.

### 2. Inspector + forced GC

This was the main confidence signal.

Use:

- `HeapProfiler.collectGarbage`
- then sample `process.memoryUsage()` / heap state
- compare before vs after 100 requests

This is the best quick signal for deciding whether a suspected leak survives GC.

### 3. Heap snapshot diff

Use when after-GC tail remains but the source is unclear.

This answers:

- which V8 object families grew
- whether growth is business-object shaped or runtime-internal shaped
- what retainer paths keep suspicious objects alive

## The residual-tail conclusion

After the formal runtime-core fix, `toolMinimal` and `toolTwo` both still showed small residual growth in heap snapshots.

The important conclusion is:

- the residual growth did **not** identify a second business-level root cause

### What `toolTwo` showed

The largest post-fix snapshot growth on `toolTwo` was dominated by internal/runtime categories such as:

- `code`
- `hidden`
- `object shape`
- `TrustedByteArray`
- `ProtectedFixedArray`
- `WeakArrayList`

This did **not** produce a strong retained family for:

- `ModelPageData`
- router page-data objects
- SSR meta store
- query cache wrappers
- controller or bean graphs

### Why `toolMinimal` mattered

Running the same snapshot diff on `toolMinimal` showed a similar residual pattern.

That proved the residual tail was not `toolTwo`-specific. If both pages show the same kind of retained objects, the retained family is more likely to be:

- runtime-internal
- Node async-runtime state
- V8 metadata/code-space behavior

and less likely to be:

- page-data or router business logic

## Retainer-path findings for `object :: (unknown)`

A deeper retainer-path pass was run specifically for `toolMinimal` because one snapshot diff showed `object :: (unknown)` as a notable aggregate bucket.

The key result was:

- those anonymous objects were mainly internal table/backing objects
- their retainers usually ran through Node async-runtime structures

Representative retainer paths looked like:

```text
(Global handles)
 -> TCP / HTTPParser
 -> Socket
 -> Timeout
 -> AsyncContextFrame
 -> table
 -> object:(unknown)
```

Other representative paths included:

```text
promiseRejectHandler
 -> pendingUnhandledRejections
 -> Map
 -> table
 -> object:(unknown)
```

and timer-list chains ending in:

- `Timeout`
- `AsyncContextFrame`
- internal `table`

### What these table objects contained

Outgoing edges from the suspicious anonymous objects repeatedly referenced names such as:

- `VonaAsyncLocalStorage`
- `AsyncLocalStorage`
- `ServiceDb`
- `ServiceTransactionState`

This is why the final interpretation changed.

These objects were not page controllers or SSR page state bodies. They were more like:

- async context tables
- ALS payload/backing structures
- runtime bookkeeping attached to socket / timeout / parser lifetimes

## The idle-after-load check

A final check was used to distinguish:

- permanently leaked request-state
- from short-lived async-runtime retention

Workflow:

1. send 400 requests to `toolMinimal`
2. take a post-load snapshot
3. idle for 30 seconds
4. force GC and take a post-idle snapshot

Key result:

- unknown-object count dropped slightly
- `AsyncContextFrame`, `Timeout`, `Socket`, and `TCP` counts also dropped

This matters because it means the most suspicious async-context branch was not fixed in place forever. It naturally receded after idle time.

That strongly supports the conclusion that this branch is:

- a request-afterglow or runtime transition state
- not a durable Zova SSR business leak

## What future investigators should conclude from this history

If a future run shows a small residual tail after the main SSR helper fix, do **not** immediately assume:

- page-data leak
- controller graph leak
- SSR meta leak
- bean-container ownership leak

First ask:

1. does after-GC heap still show a meaningful slope?
2. does `toolMinimal` share the same tail?
3. do heap snapshots point to business objects, or to runtime categories like code/hidden/table/Map?
4. do suspicious async-context objects recede after idle time?

If the answers look like this investigation, then the residual is more likely to be:

- normal runtime retention
- Node socket/timeout/ALS lifecycle overlap
- V8 internal bookkeeping

not a new framework-level regression.

## Recommended investigation order for future regressions

When a new SSR memory leak report arrives, use this order.

### Step 1: re-check the main boundary

Inspect:

- `zova/packages-zova/zova-core/src/core/context/util.ts`
- the current `@cabloy/vue-runtime-core` implementation of `withCurrentInstanceScopeSSR(...)`

Questions:

- did SSR server code stop using the SSR helper?
- was the helper semantics weakened?
- did a refactor move work out of the synchronous setup window?

### Step 2: compare `toolMinimal` and `toolTwo`

If both pages leak similarly, suspect runtime/shared behavior.

If only `toolTwo` regresses, inspect page-data/model/router work first.

### Step 3: use after-GC measurements before trusting RSS

Do not stop at process RSS.

Prefer:

- single worker
- inspector enabled
- forced GC before sampling

### Step 4: use heap snapshots only after step 3 confirms a tail

When reading snapshots, first separate:

- business-object names
- from runtime-internal families like `code`, `Map`, `WeakMap`, `AsyncContextFrame`, or anonymous table objects

### Step 5: idle-before-second-snapshot when async context is suspected

If retainer paths run through:

- `Socket`
- `Timeout`
- `HTTPParser`
- `AsyncContextFrame`
- `AsyncLocalStorage`

then always run an idle-after-load check before calling it a real leak.

## Boundaries this investigation does not prove

This note should not be over-read.

It does **not** prove that:

- all async-runtime retention is harmless in every future scenario
- Vona AsyncLocalStorage can never contribute to a leak
- logger or module-level Maps can never become problematic

It only proves that in this investigation:

- the dominant SSR leak was the missing SSR setup-state helper
- the residual retained objects found later were not enough to justify a second product-code fix

## Invariants future refactors should preserve

1. server simulated setup must continue to use `withCurrentInstanceScopeSSR(...)`
2. SSR setup-state restoration must remain scoped to the synchronous execution window
3. leak investigations must distinguish after-GC survival from raw RSS growth
4. `toolMinimal` should remain a valid minimal SSR comparison page
5. future retained-object analysis should not classify async-runtime tables as business leaks without idle-time verification

## Related sources and references

Core fix boundary:

- `zova/packages-zova/zova-core/src/core/context/util.ts`

Representative simulated-setup consumers:

- `zova/packages-zova/zova-core/src/composables/useController.ts`
- `zova/packages-zova/zova-core/src/bean/beanContainer.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts`

Minimal comparison pages:

- `zova/src/suite/a-demo/modules/demo-basic/src/page/toolMinimal/controller.tsx`
- `zova/src/suite/a-demo/modules/demo-basic/src/page/toolTwo/controller.tsx`
- `vona/src/suite-vendor/a-test/modules/test-ssr/src/controller/toolMinimal.ts`
- `vona/src/suite-vendor/a-test/modules/test-ssr/src/controller/toolTwo.ts`

SSR cleanup path reviewed during second-cause analysis:

- `zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts`
- `zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts`
- `zova/packages-zova/zova-core/src/core/app/application.ts`

Diagnostic templates already in the repo:

- `vona/.claude/skills/detect-ssr-leak/templates/memoryDiag.ts`
- `vona/.claude/skills/detect-ssr-leak/scripts/inline-heap.mjs`
- `vona/.claude/skills/detect-ssr-leak/scripts/cdp-heap-analyze.mjs`

## Practical takeaway

If future work asks "is the SSR leak back?", start by verifying whether the system has regressed back across the main helper boundary.

If future work asks "what are these retained anonymous objects in the snapshot?", remember the outcome here:

- many of them will be runtime tables
- many will be retained through async context or Map internals
- some will naturally recede after idle
- do not promote them to a framework bug until after-GC and idle-time checks both say they truly persist
