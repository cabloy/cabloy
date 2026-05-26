// External RSS Monitoring Script for SSR Memory Leak Detection
// Usage: node external-monitor.mjs
// No code changes needed - monitors process RSS from outside

import { execSync } from 'node:child_process';

// ===== CONFIGURATION =====
const TARGET_URL = 'http://localhost:7102/login';  // URL to test
const WORKER_PIDS = [/* Fill in worker PIDs, e.g. 1418, 1419 */];  // Node.js worker PIDs
const ITERATIONS = 500;   // Total iterations
const BATCH_SIZE = 5;     // Parallel requests per iteration
// =========================

if (WORKER_PIDS.length === 0) {
  console.error('Please set WORKER_PIDs. Find them with:');
  console.error('  ps -eo pid,ppid,command | grep "node.*bootstrap" | grep -v grep');
  process.exit(1);
}

const results = [];

for (let i = 0; i < ITERATIONS; i++) {
  const promises = [];
  for (let j = 0; j < BATCH_SIZE; j++) {
    promises.push(fetch(TARGET_URL).then(r => r.text()).catch(() => null));
  }
  await Promise.all(promises);

  if ((i + 1) % 10 === 0) {
    const readings = {};
    for (const pid of WORKER_PIDS) {
      try {
        const output = execSync(`ps -o rss= -p ${pid}`, { encoding: 'utf-8' }).trim();
        readings[pid] = parseInt(output); // RSS in KB
      } catch {
        readings[pid] = null;
      }
    }
    const totalRss = Object.values(readings).reduce((s, v) => s + (v || 0), 0);
    results.push({ iteration: i + 1, totalRequests: (i + 1) * BATCH_SIZE, ...readings, totalRss });

    const parts = WORKER_PIDS.map(pid => {
      const v = readings[pid];
      return `W${pid}: ${v ? (v / 1024).toFixed(1) + 'MB' : 'dead'}`;
    });
    console.log(`#${String(i + 1).padStart(3)} | ${parts.join(' | ')} | Total: ${(totalRss / 1024).toFixed(1)}MB`);
  }

  if ((i + 1) % 100 === 0) await new Promise(r => setTimeout(r, 500));
}

// Analysis
console.log('\n========== Memory Leak Analysis ==========\n');

for (const pid of WORKER_PIDS) {
  const values = results.map(r => r[pid]).filter(v => v !== null);
  if (values.length < 2) { console.log(`Worker ${pid}: Insufficient data`); continue; }

  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) { sumX += i; sumY += values[i]; sumXY += i * values[i]; sumX2 += i * i; }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const slopePerRequest = slope / (10 * BATCH_SIZE);

  const first = values[0], last = values[values.length - 1];
  const half = Math.floor(n / 2);
  const firstHalfAvg = values.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const secondHalfAvg = values.slice(half).reduce((a, b) => a + b, 0) / (n - half);

  console.log(`Worker ${pid}:`);
  console.log(`  RSS: ${(first / 1024).toFixed(1)}MB → ${(last / 1024).toFixed(1)}MB (${last > first ? '+' : ''}${((last - first) / 1024).toFixed(1)}MB)`);
  console.log(`  Linear trend: ${slopePerRequest.toFixed(2)} KB/request`);
  console.log(`  1st half avg: ${(firstHalfAvg / 1024).toFixed(1)}MB | 2nd half avg: ${(secondHalfAvg / 1024).toFixed(1)}MB (${((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100).toFixed(1)}%)`);
  console.log();
}

const totalValues = results.map(r => r.totalRss);
const tn = totalValues.length;
let tSumX = 0, tSumY = 0, tSumXY = 0, tSumX2 = 0;
for (let i = 0; i < tn; i++) { tSumX += i; tSumY += totalValues[i]; tSumXY += i * totalValues[i]; tSumX2 += i * i; }
const totalSlopePerRequest = ((tn * tSumXY - tSumX * tSumY) / (tn * tSumX2 - tSumX * tSumX)) / (10 * BATCH_SIZE);

console.log(`Total RSS slope: ${totalSlopePerRequest.toFixed(2)} KB/request\n`);

if (totalSlopePerRequest < 1) {
  console.log('✅ No significant memory leak detected (RSS growth < 1 KB/request)');
} else if (totalSlopePerRequest < 5) {
  console.log('⚠️  SUSPICIOUS: Possible slow memory leak');
  console.log('   Recommend: Run Phase 2 (inline instrumentation) for precise heap measurement.');
} else {
  console.log('❌ MEMORY LEAK DETECTED (RSS growth > 5 KB/request)');
  console.log('   Recommend: Run Phase 2 (inline instrumentation) and Phase 3 (heap snapshot comparison).');
}
