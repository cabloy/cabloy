// Inline Heap Measurement Script for SSR Memory Leak Detection
// Requires: Phase 2 diagnostic controller (ControllerMemoryDiag) to be deployed
// Usage: node inline-heap.mjs

// ===== CONFIGURATION =====
const TARGET = 'http://localhost:7102';
const STATS_URL = `${TARGET}/api/play/memoryDiag/stats`;   // Adjust module path
const GC_URL = `${TARGET}/api/play/memoryDiag/gc`;          // Adjust module path
const HEAP_SNAPSHOT_URL = `${TARGET}/api/play/memoryDiag/heapSnapshot`;
const LOGIN_URL = `${TARGET}/login`;                         // URL to test
const ITERATIONS = 200;     // Total iterations
const BATCH_SIZE = 5;       // Parallel requests per iteration
// =========================

function mb(bytes) { return (bytes / 1024 / 1024).toFixed(2); }
function kb(bytes) { return (bytes / 1024).toFixed(1); }

async function getStats() {
  const res = await fetch(STATS_URL);
  const json = await res.json();
  return json.data || json;
}

async function forceGc() {
  const res = await fetch(GC_URL, { method: 'POST' });
  const json = await res.json();
  return json.data || json;
}

async function takeHeapSnapshot() {
  const res = await fetch(HEAP_SNAPSHOT_URL);
  const json = await res.json();
  return json.data || json;
}

// Phase 1: Baseline after GC
console.log('=== Phase 1: Baseline (after GC) ===');
const baseline = await forceGc();
console.log(`Worker ${baseline.pid}: heapUsed=${mb(baseline.memoryUsage.heapUsed)}MB, rss=${mb(baseline.memoryUsage.rss)}MB`);
console.log(`  native_contexts=${baseline.heapStatistics.number_of_native_contexts}, detached_contexts=${baseline.heapStatistics.number_of_detached_contexts}`);

// Phase 2: Baseline heap snapshot
console.log('\n=== Phase 2: Baseline heap snapshot ===');
const snapshot1 = await takeHeapSnapshot();
console.log(`Snapshot: pid=${snapshot1.pid}, file=${snapshot1.file}`);

// Phase 3: Load test with memory tracking
console.log(`\n=== Phase 3: Load test (${ITERATIONS * BATCH_SIZE} requests) ===\n`);
const readings = [];

console.log('Iter | Req#  | PID   | heapUsed (MB) | rss (MB)  | nativeCtx | detachedCtx | ext (MB)');
console.log('-----|-------|-------|---------------|-----------|-----------|-------------|----------');

for (let i = 0; i < ITERATIONS; i++) {
  const promises = [];
  for (let j = 0; j < BATCH_SIZE; j++) {
    promises.push(fetch(LOGIN_URL).then(r => r.text()).catch(() => null));
  }
  await Promise.all(promises);

  if ((i + 1) % 10 === 0) {
    const stats = await getStats();
    const reading = {
      iteration: i + 1,
      totalRequests: (i + 1) * BATCH_SIZE,
      pid: stats.pid,
      heapUsed: stats.memoryUsage.heapUsed,
      heapTotal: stats.memoryUsage.heapTotal,
      rss: stats.memoryUsage.rss,
      external: stats.memoryUsage.external,
      nativeContexts: stats.heapStatistics.number_of_native_contexts,
      detachedContexts: stats.heapStatistics.number_of_detached_contexts,
    };
    readings.push(reading);

    console.log(
      `${String(reading.iteration).padStart(4)} | ${String(reading.totalRequests).padStart(5)} | ${String(reading.pid).padStart(5)} | ${mb(reading.heapUsed).padStart(13)} | ${mb(reading.rss).padStart(9)} | ${String(reading.nativeContexts).padStart(9)} | ${String(reading.detachedContexts).padStart(11)} | ${mb(reading.external).padStart(8)}`
    );
  }

  if ((i + 1) % 50 === 0) await new Promise(r => setTimeout(r, 200));
}

// Phase 4: Force GC and measure
console.log('\n=== Phase 4: After GC ===');
const afterGc = await forceGc();
console.log(`Worker ${afterGc.pid}: heapUsed=${mb(afterGc.memoryUsage.heapUsed)}MB, rss=${mb(afterGc.memoryUsage.rss)}MB`);
console.log(`  native_contexts=${afterGc.heapStatistics.number_of_native_contexts}, detached_contexts=${afterGc.heapStatistics.number_of_detached_contexts}`);

// Phase 5: Post-load heap snapshot
console.log('\n=== Phase 5: Post-load heap snapshot ===');
const snapshot2 = await takeHeapSnapshot();
console.log(`Snapshot: pid=${snapshot2.pid}, file=${snapshot2.file}`);

// Analysis
console.log('\n========== Memory Leak Analysis ==========\n');

const baselineHeap = baseline.memoryUsage.heapUsed;
const afterGcHeap = afterGc.memoryUsage.heapUsed;
const totalRequests = ITERATIONS * BATCH_SIZE;
const leakPerRequestKB = (afterGcHeap - baselineHeap) / totalRequests / 1024;

console.log(`Baseline heapUsed (after GC): ${mb(baselineHeap)} MB`);
console.log(`After load + GC heapUsed:     ${mb(afterGcHeap)} MB`);
console.log(`Delta:                        ${kb(afterGcHeap - baselineHeap)} KB`);
console.log(`Leak rate:                    ${leakPerRequestKB.toFixed(2)} KB/request`);

const baselineCtx = baseline.heapStatistics.number_of_native_contexts;
const afterGcCtx = afterGc.heapStatistics.number_of_native_contexts;
const baselineDetached = baseline.heapStatistics.number_of_detached_contexts;
const afterGcDetached = afterGc.heapStatistics.number_of_detached_contexts;

console.log(`\nNative contexts:   ${baselineCtx} → ${afterGcCtx} (${afterGcCtx - baselineCtx > 0 ? '+' : ''}${afterGcCtx - baselineCtx})`);
console.log(`Detached contexts: ${baselineDetached} → ${afterGcDetached} (${afterGcDetached - baselineDetached > 0 ? '+' : ''}${afterGcDetached - baselineDetached})`);

// Linear regression
const xs = readings.map((_, i) => i);
const ys = readings.map(r => r.heapUsed);
const n = xs.length;
let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
for (let i = 0; i < n; i++) { sumX += xs[i]; sumY += ys[i]; sumXY += xs[i] * ys[i]; sumX2 += xs[i] * xs[i]; }
const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
const slopeKBPerRequest = (slope / (10 * BATCH_SIZE)) / 1024;

const half = Math.floor(n / 2);
const firstHalfAvg = ys.slice(0, half).reduce((a, b) => a + b, 0) / half;
const secondHalfAvg = ys.slice(half).reduce((a, b) => a + b, 0) / (n - half);

console.log(`\nHeap trend (linear): ${slopeKBPerRequest.toFixed(2)} KB/request`);
console.log(`1st half avg: ${mb(firstHalfAvg)} MB | 2nd half avg: ${mb(secondHalfAvg)} MB (${((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100).toFixed(1)}%)`);

console.log('\n========== Verdict ==========');
if (leakPerRequestKB > 5 || afterGcDetached > baselineDetached + 2 || afterGcCtx > baselineCtx + 5) {
  console.log('❌ MEMORY LEAK DETECTED');
  if (leakPerRequestKB > 5) console.log(`  - Heap grows ${leakPerRequestKB.toFixed(2)} KB/request even after GC`);
  if (afterGcDetached > baselineDetached) console.log(`  - Detached V8 contexts: ${baselineDetached} → ${afterGcDetached}`);
  if (afterGcCtx > baselineCtx + 5) console.log(`  - Native contexts: ${baselineCtx} → ${afterGcCtx}`);
  console.log(`\nHeap snapshots saved:`);
  console.log(`  Before: ${snapshot1.file}`);
  console.log(`  After:  ${snapshot2.file}`);
  console.log('Open Chrome DevTools → Memory → Load both → Compare view');
} else if (leakPerRequestKB > 1) {
  console.log('⚠️  SUSPICIOUS: Possible slow leak');
  console.log(`  Heap grows ${leakPerRequestKB.toFixed(2)} KB/request after GC`);
} else {
  console.log('✅ No significant memory leak detected');
}
