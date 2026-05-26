---
name: detect-ssr-leak
description: Detect server-side memory leaks in Node.js SSR services. Use when user asks to "check for memory leak", "detect leak", "SSR memory leak", "内存泄漏", or wants to diagnose growing memory usage on a Node.js server. TRIGGER when user mentions memory leak detection, especially for SSR/Vue/React server-side rendering.
allowed-tools: Bash(fetch *) Bash(curl *) Bash(ps *) Bash(node *) Bash(npm *) Bash(npx *) Bash(pkill *) Bash(kill *) Bash(lsof *) Bash(wc *) Bash(ls *) Bash(rm *) Bash(cat *) Bash(mkdir *) Bash(cp *) Bash(sleep *)
---

# Detect SSR Memory Leak

Detect server-side Node.js memory leaks for SSR rendering services using a three-phase approach: external RSS monitoring, inline heap instrumentation, and CDP heap snapshot comparison.

## Prerequisites

- A running Node.js SSR server (Koa, Express, etc.)
- The target URL (e.g., `http://localhost:7102/login`)
- If using Phase 2, a controller module where the diagnostic endpoint can be added

## Phase 1: External RSS Monitoring (Quick Screening)

Zero code changes. Detects whether a leak exists by monitoring process RSS from outside.

### Steps

1. Find worker PIDs:
```bash
ps -eo pid,ppid,command | grep "node.*bootstrap" | grep -v grep
```
Identify the master PID (ppid of others) and worker PIDs.

2. Create and run the external monitoring script. Use the template at `${CLAUDE_SKILL_DIR}/scripts/external-monitor.mjs`:
```bash
# Copy and edit the script, set WORKER_PIDS and TARGET_URL
cp ${CLAUDE_SKILL_DIR}/scripts/external-monitor.mjs /tmp/ssr-leak-external.mjs
# Edit WORKER_PIDS and TARGET_URL in the script, then run:
node /tmp/ssr-leak-external.mjs
```

3. Interpret results:
- RSS slope < 1 KB/request → Normal (cache warmup)
- 1-5 KB/request → Suspicious, proceed to Phase 2
- \> 5 KB/request → Strong leak signal, proceed to Phase 2

## Phase 2: Inline Heap Instrumentation (Precise Measurement)

Add a temporary diagnostic controller to read `process.memoryUsage()` and `v8.getHeapStatistics()` from within the Node.js process.

### Steps

1. Add the `ControllerMemoryDiag` controller to an existing module. Use the template at `${CLAUDE_SKILL_DIR}/templates/memoryDiag.ts`. Key endpoints:
- `GET /stats` — Returns `process.memoryUsage()` + `v8.getHeapStatistics()` + `pid`
- `POST /gc` — Forces GC via `node:inspector` Session, returns post-GC stats
- `GET /heapSnapshot` — Writes `.heapsnapshot` file via `v8.writeHeapSnapshot()`

2. Mark all methods as public/no-auth so they can be called without authentication.

3. Verify the endpoint works:
```bash
curl -s http://localhost:<PORT>/api/<module>/memoryDiag/stats | python3 -m json.tool
```

4. Run the inline heap measurement script. Use the template at `${CLAUDE_SKILL_DIR}/scripts/inline-heap.mjs`:
```bash
cp ${CLAUDE_SKILL_DIR}/scripts/inline-heap.mjs /tmp/ssr-leak-inline.mjs
# Edit STATS_URL, GC_URL, LOGIN_URL, then run:
node /tmp/ssr-leak-inline.mjs
```

5. Key metrics to watch:

| Metric | Normal | Suspicious | Confirmed Leak |
|--------|--------|------------|----------------|
| `heapUsed` after GC | Stable | 1-5 KB/req | >5 KB/req, never converges |
| `number_of_native_contexts` | 1-3 | Slowly growing | Monotonically increasing |
| `number_of_detached_contexts` | 0 or constant | Growing | V8 contexts not collected |

## Phase 3: CDP Heap Snapshot Comparison (Root Cause Identification)

If Phase 2 confirms a leak, use Chrome DevTools Protocol to take and compare heap snapshots, identifying the exact leaking object types.

### Steps

1. Enable inspector on the target worker:
```bash
# Find worker PID, then send SIGUSR1
kill -USR1 <WORKER_PID>
```

2. Verify inspector is available:
```bash
curl -s http://127.0.0.1:9229/json
```

3. Run the CDP streaming heap analysis script. Use the template at `${CLAUDE_SKILL_DIR}/scripts/cdp-heap-analyze.mjs`:
```bash
cp ${CLAUDE_SKILL_DIR}/scripts/cdp-heap-analyze.mjs /tmp/ssr-leak-cdp.mjs
# Install ws if needed: cd /tmp && npm install ws
# Edit TARGET_URL, then run:
node /tmp/ssr-leak-cdp.mjs
```

4. The script will:
- Connect to the worker via CDP WebSocket
- Take a baseline heap snapshot after GC
- Send load requests to the target URL
- Take a post-load heap snapshot after GC
- Stream-parse both snapshots and compare object counts/sizes by type

5. Interpret the V8 node type mapping:
```
type_0 = hidden        type_5 = closure           type_10 = concatenated string
type_1 = object        type_6 = regexp            type_11 = sliced string
type_2 = array         type_7 = number            type_12 = symbol
type_3 = string        type_8 = native            type_13 = bigint
type_4 = code          type_9 = synthetic         type_14 = object shape
```

6. Common SSR leak patterns by type:
- **object (type_1) growth** → Vue/React app instances not unmounted, component trees retained
- **closure (type_5) growth** → Reactive effects (watch/computed/effect), event handlers, `_createPerformAction` closures capturing `this`
- **string (type_3) growth** → Template compile results, property names, module source text retained by object references
- **array (type_2) growth** → Reactive dependency tracking arrays, listener lists

## Cluster Mode Handling

If the server runs in cluster mode (multiple workers), requests distribute across workers. Two strategies:

1. **Single worker mode (recommended)**: Restart with `META_MODE=production SERVER_WORKERS=1` (or equivalent env vars) for clean measurements
2. **Per-PID tracking**: The diagnostic endpoint returns `pid`, group measurements by PID in the analysis script

## Known SSR Leak Suspects

When analyzing, check these common root causes:

1. **Vue app instance not unmounted**: `createSSRApp()` creates app instances that must be unmounted after `renderToString()`. Missing `app.unmount()` leaks the entire component tree.
2. **Dynamic `import()` with cache-busting nonce**: Each unique URL creates a new V8 module record. Old modules may never be GC'd.
3. **Closures capturing request context**: `_createPerformAction` or similar closures that capture `this` (bean/service instances) prevent the entire request context from being GC'd.
4. **Unbounded caches**: Caches keyed by variable data (host, locale) that grow without TTL or size limits.
5. **Event listener accumulation**: Listeners added per-request on global objects that are never removed.

## Cleanup

After analysis, remember to:
- Remove the `ControllerMemoryDiag` from the codebase (it's a diagnostic tool, not production code)
- Delete temporary heap snapshot files from `/tmp/`
- If inspector was enabled via SIGUSR1, restart the server to disable it

## Arguments

If the user provides arguments, parse them as:
- `$1` or `$ARGUMENTS` — Target URL (default: ask the user)
- If no URL provided, ask: "What is the target URL to test for memory leaks?"

## Report Format

After completing the analysis, present results in this format:

```
## Memory Leak Detection Results

### Phase X: [method name]

**Verdict:** PASS / SUSPICIOUS / LEAK DETECTED

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| heapUsed | X MB | Y MB | +Z KB/request |
| ... | ... | ... | ... |

### Top Leaking Types (if Phase 3)
[table of object/closure/string growth]

### Root Cause Analysis
[analysis of why the leak is happening, referencing specific code paths]

### Recommendations
[specific code changes to fix the leak]
```
