# ADR 0003: Stop SSR Leak Fixes at the Runtime-Core Boundary

## Status

Accepted and implemented.

## Background

The SSR leak investigation for Zova started with a strong memory-growth signal on the demo SSR pages and eventually confirmed a framework-level semantics mismatch.

The confirmed primary cause was:

- Zova simulated setup restored Vue `currentInstance`
- but it did not restore Vue SSR setup state
- so SSR-only composable/runtime behavior ran under incomplete setup semantics

The durable fix was implemented by introducing and consuming:

- `withCurrentInstanceScopeSSR(instance, fn)`

This moved the responsibility to the correct abstraction boundary in `@cabloy/vue-runtime-core`.

After that fix, the main after-GC leak slope dropped sharply and the control page returned to normal behavior.

At that point, the remaining question was whether the repository should continue with a second product-code cleanup round to chase the small residual tail.

## Problem

Once the primary leak was fixed, a small residual tail still appeared in some measurements, especially on `toolTwo`.

That created a tempting but risky next step:

- continue adding more product-side cleanup code in Zova/Vona until the tail disappears

The problem with that approach is that small residual tails can come from very different sources:

1. a real second business-level leak
2. Node/V8 runtime retention that naturally recedes
3. normal code-space, table, or hidden-class growth visible in snapshots
4. measurement noise when looking at RSS rather than after-GC state

Without stronger evidence, a second product-code fix would increase complexity while solving an unproven problem.

## Decision

Stop product-code SSR leak fixes at the runtime-core boundary unless future evidence shows a second persistent business-level root cause.

In practice, this means:

1. keep the formal runtime-core fix as the accepted repair
2. do not promote residual-tail hypotheses into permanent Zova/Vona cleanup logic without stronger proof
3. treat later severing/cleanup flags as investigation tools, not as accepted product behavior
4. require after-GC and idle-time validation before classifying residual retained objects as a real framework regression

## Why this decision was chosen

### 1. The primary root cause was proven and fixed

The investigation produced a confirmed semantics bug and a durable repair:

- the leak aligned with the missing SSR setup-state window
- the runtime-core helper fixed that mismatch
- the main slope dropped after the fix

That is a complete product-level fix, not just a partial mitigation.

### 2. The residual tail did not produce a second proven business-level root cause

Several follow-up experiments were run after the main fix, including:

- page-level comparison: `toolMinimal` vs `toolTwo`
- severing SSR context, Vue app graph, and Zova app refs
- heap-snapshot comparison by object family
- retainer-path analysis for `object :: (unknown)`
- idle-after-load verification

Those follow-ups did **not** isolate a second retained business-object family such as:

- page-data model objects
- controller or bean graphs
- SSR meta store
- router page state

Instead, the most suspicious retained paths pointed to runtime structures such as:

- `AsyncContextFrame`
- `Socket`
- `Timeout`
- `HTTPParser`
- internal `Map` / table objects
- `AsyncLocalStorage` payload tables

### 3. Idle-time verification showed natural recession

The retained async-context branch was checked again after load, idle time, and forced GC.

The relevant counts dropped, including:

- `AsyncContextFrame`
- `Timeout`
- `Socket`
- `TCP`

That result strongly suggests request-afterglow or runtime transition state rather than a durable framework leak.

### 4. Additional product-side cleanup would have weak evidence and non-trivial cost

A second round of permanent cleanup code would increase maintenance burden in sensitive code paths such as:

- SSR handler finalization
- app/context teardown
- component render patch boundaries
- model/query cleanup timing

Because the residual tail was not tied to a proven business-level retained graph, the cost of such changes would outweigh the evidence supporting them.

## Alternatives considered

### Alternative A: continue adding permanent SSR cleanup logic

Examples:

- sever more app/context references in the SSR handler
- aggressively clear more caches after each request
- retain cleanup flags as enabled product defaults

Rejected because:

- no stable second root cause was confirmed
- severing experiments did not produce strong, repeatable wins
- the residual tail looked increasingly runtime-internal rather than framework-business-shaped

### Alternative B: revert to a Zova-local SSR helper or more local shims

Rejected because:

- the real semantics boundary belonged in runtime-core
- a Zova-local workaround would preserve the wrong abstraction
- the runtime-core helper already solved the confirmed primary cause

### Alternative C: treat every residual snapshot growth as a bug

Rejected because:

- snapshot growth alone does not prove retained business state
- internal code-space and async-runtime objects can legitimately appear after request bursts
- after-GC and idle-time checks are required before escalation

## Consequences

### Benefits

- the codebase keeps the proven fix without accumulating speculative cleanup behavior
- future investigations inherit a clear escalation rule
- contributors are less likely to overfit the product code to snapshot noise
- the sensitive SSR and runtime lifecycle paths stay simpler

### Trade-off

A small residual tail may still appear in some measurements.

This ADR accepts that outcome when the evidence indicates:

- after-GC behavior is already near-normal
- retained objects are runtime-internal
- idle-time checks show natural recession

That trade-off is acceptable because it avoids shipping complexity for an unproven second bug.

## Guidance for future work

Only reopen product-code SSR leak fixes if future evidence satisfies all of the following:

1. after-GC measurements show a persistent non-trivial slope
2. the behavior reproduces consistently on the minimal control page or clearly isolates to a business layer
3. heap snapshots identify a retained business-object family, not only runtime-internal structures
4. idle-time verification fails to show natural recession

If those conditions are not met, treat residual findings as investigation artifacts or runtime-level observations rather than framework regressions.

## Related records

- `repo-docs-internal/architecture/ssr-memory-leak-investigation-guide.md`
- `repo-docs-internal/architecture/ssr-leak-experiment-flags-inventory.md`
