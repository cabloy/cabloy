# SSR Test-Isolation Baseline — 2026-10-29

## Final disposition — investigation closed

On 2026-10-29, the measured warm app-initialization cost of approximately 4.3–4.8 ms was accepted for this workload. Keep a fresh app per request; implement neither an app pool nor Monkey dispatch-list optimization. The latter has no established exclusive-cost bottleneck or measured benefit that justifies another mechanism.

The temporary runtime timing implementation, `CABLOY_SSR_TIMING` switch, benchmark driver, dedicated tests and public guide were removed during closeout. This document and its JSON are **historical evidence**, not instructions for a currently supported diagnostic feature. The measured values and artifact/source hashes are unchanged; they do not describe the rebuilt post-cleanup artifacts. See [owner attribution and final decision](./ssr-init-owners-2026-10-29.md).

## Question and scope

Measure whether fresh-app initialization is material before designing an SSR app pool. This run uses the real **Vona integrated SSR** path with managed test isolation, not Zova standalone SSR. It does not implement or simulate app reuse.

Structured results and artifact/source hashes: [baseline evidence](./ssr-test-baseline-2026-10-29.json).

## Environment and method

- Cabloy Basic; Node version recorded in the evidence JSON.
- Vona source backend: `--workers=1 --flavor=normal --mode=test`.
- Existing built Web SSR artifact, selected by `basic-siteweb`'s `ssrSite.web.ts`: `ssr-cabloyBasicWeb-5.0.0`.
- Trusted `CABLOY_SSR_TIMING=true` passed only to the owned server environment.
- Anonymous direct-loopback HTTP requests to `/demo/basic/state` with bounded keep-alive connections; no browser, authentication, query cachebuster, redirect following or retries.
- One fresh managed server process. Three sequential rounds **in that same process**, not three independent process-cold runs.
- Each round: one first-observed request, 10 excluded warmup requests, 50 serial requests, then 100 requests at concurrency 4. Total: **483 requests**, all valid; 450 measured warm requests.
- Before round 1, the launcher performed its managed readiness handshake. Rounds 2 and 3 followed the preceding workload.
- The route's no-store policy was verified by the earlier managed correctness tests. This driver does not record cache headers. The state demo has no authored API query, although normal layout/framework behavior still runs; it is not a data-heavy business workload.
- The framework changes remained uncommitted. Evidence includes the actual HEAD, selected source hashes and the deployed artifact tree digest. The deployed tree was unchanged before/after sampling.
- Managed server shutdown and resource cleanup completed; producer exited 0. No environment-file edits, development-database reset, manual port reassignment or unrelated process stopping.

The client driver does not establish server provenance itself. The environment facts above come from the launcher and source/artifact inspection, and supplement the driver's deliberately `unverified` target fields.

## Results

All durations below are milliseconds. Phase values are inclusive, non-additive server spans. The client value includes the complete HTTP response.

### Warm serial workload

| Round | Client p50 | Client p95 | Handler p50 | App init p50 | Inclusive render p50 | Successful responses/s |
| ----- | ---------: | ---------: | ----------: | -----------: | -------------------: | ---------------------: |
| 1     |     16.157 |     20.694 |      14.209 |        4.838 |               13.453 |                 58.622 |
| 2     |     14.882 |     21.615 |      12.912 |        4.480 |               12.221 |                 61.979 |
| 3     |     14.020 |     17.274 |      12.492 |        4.315 |               11.823 |                 68.447 |

The workload continued to warm across rounds. Keep the per-round distributions rather than treating these as independent replicates or averaging their percentiles.

### Warm concurrency-4 workload

| Round | Client p50 | Client p95 | Handler p50 | App init p50 | Successful responses/s |
| ----- | ---------: | ---------: | ----------: | -----------: | ---------------------: |
| 1     |     59.498 |     64.034 |      12.942 |        4.472 |                 66.608 |
| 2     |     57.692 |     78.599 |      12.790 |        4.387 |                 64.563 |
| 3     |     55.199 |     61.554 |      12.184 |        4.211 |                 71.339 |

Concurrent end-to-end latency is much larger than the handler span. With one worker, waiting before handler admission, event-loop scheduling and response delivery can contribute outside the measured handler boundary. The driver runs on the same machine too. These timings do not independently attribute the gap to one cause, and more concurrent connections do not imply parallel JavaScript execution.

### Initialization detail

Warm serial p50 values across rounds:

| Phase                                |       Range |
| ------------------------------------ | ----------: |
| Setup                                | 0.016–0.017 |
| Module initialization                | 1.946–2.088 |
| `appInitialize`                      | 1.049–1.224 |
| `appInitialized`                     | 1.001–1.144 |
| `appReady`                           | 0.256–0.312 |
| Navigation, nested inside `appReady` | 0.227–0.275 |
| Server entry                         | 0.024–0.025 |
| State/meta injection                 | 0.119–0.144 |
| App/context cleanup                  | 0.152–0.172 |

Do not sum phase medians as if they were a representative individual request. Navigation is already included in `appReady` and app initialization.

### First observed request

Round 1's first request:

- Complete client response: **717.261 ms**.
- Zova handler: **71.598 ms**.
- Inclusive render: **66.456 ms**.
- App initialization: **18.286 ms**.

The large client/handler gap is outside current handler instrumentation. Earlier bundle/Sys preparation, upstream work, scheduling and HTTP handling are possible contributors, not individually measured facts. It must not be attributed to per-request app initialization. Later round-first samples were already warm: 15.296 and 14.783 ms client wall time.

## Decision supported by these measurements

App initialization is **material but not dominant** on this lightweight route: its warm serial p50 is approximately 4.3–4.8 ms. The ratio of app-init p50 to handler p50 is approximately 34–35%; relative to complete serial-response p50 it is approximately 30–31%.

Those are **ratios of separate medians**, not medians of per-request shares and not measured optimization gains. Even an unrealistic elimination of initialization alone would target a few milliseconds here; a real pool would still need request rebinding, navigation, state preparation, cleanup and isolation checks. Pooling may also affect work outside this span, which this experiment does not quantify.

At baseline collection time, the following investigation was recommended. It was subsequently completed in the [owner record](./ssr-init-owners-2026-10-29.md); it is not open follow-up work:

1. Inspect the existing module initialization and `appInitialize` / `appInitialized` owners, which account for most measured startup cost.
2. Identify concrete expensive owners and whether their request-independent work can already live at Sys/module-load scope without retaining request state.
3. Compare an approved narrow optimization against this same isolated workload before accepting app-wide reset/reuse complexity.

This run neither proves an app pool unsafe nor establishes its benefit. Existing lifecycle/isolation concerns still require explicit design and separate approval. Do not infer that clearing QueryClient or running reset hooks would recover the full measured time safely.

## Historical reproduction recipe — not runnable on the cleaned checkout

The recipe below records the original workload. Its `scripts/benchSsr.ts` import and runtime timing switch were removed; do not execute it against the current checkout or interpret a missing import as local dependency drift. Reproduction requires the original measurement implementation and compatible built artifacts identified by the retained hashes. The recorded HEAD alone is insufficient because measurement changes were uncommitted; these records do not archive the complete removed implementation or guarantee exact replay.

The run used the existing exported managed boundaries rather than another server lifecycle or runner mode. Any future reproduction must again coordinate frontend builds/dependency writes and use approved disposable resources.

```bash
set -o pipefail
node --input-type=module <<'NODE' 2>&1 | node repo-agent-governance/tools/evidence-paths/sanitize.mjs sanitize
import { withIsolatedRun, withIsolatedVona } from './scripts/runIsolatedTest.ts';
import { parseArgs, runBenchmark } from './scripts/benchSsr.ts';
const reports = [];
await withIsolatedRun('e2e', async ({ env, port }) => {
  await withIsolatedVona(port, { ...env, CABLOY_SSR_TIMING: 'true' }, async () => {
    for (let round = 1; round <= 3; round++) {
      const result = await runBenchmark(
        parseArgs([`http://127.0.0.1:${port}/demo/basic/state`]),
      );
      reports.push({ round, ...result });
      if (!result.valid) throw new Error('SSR baseline sample failed validation');
    }
  });
});
console.log(JSON.stringify({ cleanup: 'completed', reports }));
NODE
```

The original run additionally hashed selected source files and the complete deployed artifact tree before measurement, and verified artifact stability after cleanup. Reproduction without these hashes reproduces the workload, not the original artifact provenance. Keep producer and sanitization exit codes visible; failed runs retain resources according to the managed runner's existing policy.

## Limits

- Test-mode backend, built frontend and one worker: useful for phase attribution and same-condition comparison, not production capacity certification.
- Only one simple page, one server process and one workload ordering. No cross-route, multi-worker or repeated-cold-start claims.
- Timing remains enabled throughout; instrumentation overhead was not measured against an off-control workload.
- No server CPU, allocation, retained-memory, GC or leak evidence.
- No per-bean profiling and no universal API-wait timing. Render residual remains unclassified.
- Structured evidence contains only workload/timing data, repository-relative paths and hashes. No HTML, cookies, target origin, transient port, credentials or environment snapshots are retained. Path checking passed; it is not secret scanning or performance acceptance proof.
