// CDP Streaming Heap Snapshot Analysis for SSR Memory Leak Detection
// Connects to Node.js inspector, takes before/after snapshots, and compares by type
// Requires: ws package (npm install ws), inspector enabled on target worker
// Usage: node cdp-heap-analyze.mjs

import { execSync } from 'node:child_process';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, unlink } from 'node:fs/promises';
import { WebSocket } from 'ws';

// ===== CONFIGURATION =====
const TARGET_URL = 'http://localhost:7102/login';  // URL to test
const LOAD_REQUESTS = 200;                         // Number of requests to send
const BATCH_SIZE = 5;                              // Parallel requests per batch
// =========================

function mb(b) { return (b / 1024 / 1024).toFixed(2); }
function kb(b) { return (b / 1024).toFixed(1); }

// V8 node type mapping
const NODE_TYPES = [
  'hidden', 'object', 'array', 'string', 'code', 'closure',
  'regexp', 'number', 'native', 'synthetic', 'concatenated string',
  'sliced string', 'symbol', 'bigint', 'object shape',
];

// ===== Phase 1: Connect to inspector =====
console.log('=== Phase 1: Connect to Node.js inspector ===\n');

const pidOutput = execSync('ps -eo pid,ppid,command | grep "node.*bootstrap" | grep -v grep', { encoding: 'utf-8' });
const pLines = pidOutput.trim().split('\n');
const masterPid = parseInt(pLines[0].trim().split(/\s+/)[0]);
const workers = pLines.map(l => {
  const parts = l.trim().split(/\s+/);
  return { pid: parseInt(parts[0]), ppid: parseInt(parts[1]) };
}).filter(w => w.ppid === masterPid);

const targetPid = workers[0].pid;
console.log(`Target worker: ${targetPid}`);

process.kill(targetPid, 'SIGUSR1');
await new Promise(r => setTimeout(r, 2000));

const http = await import('node:http');
const inspectInfo = await new Promise((resolve, reject) => {
  http.get('http://127.0.0.1:9229/json', (res) => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const wsUrl = inspectInfo[0].webSocketDebuggerUrl;
console.log(`Inspector: ${wsUrl}\n`);

let msgId = 1;
const pending = new Map();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });

function cdpSend(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  }
});

// Take snapshot via CDP, stream to file
async function takeSnapshot(label, filePath) {
  const fileStream = createWriteStream(filePath);

  const handler = (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.method === 'HeapProfiler.addHeapSnapshotChunk') {
      fileStream.write(msg.params.chunk);
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve } = pending.get(msg.id);
      pending.delete(msg.id);
      fileStream.end();
      ws.off('message', handler);
      resolve(msg.result);
    }
  };

  ws.on('message', handler);
  await cdpSend('HeapProfiler.enable');
  await cdpSend('HeapProfiler.collectGarbage');
  console.log(`Taking ${label} snapshot...`);
  await cdpSend('HeapProfiler.takeHeapSnapshot', { reportProgress: false });
  const size = (await stat(filePath)).size;
  console.log(`  Saved: ${filePath} (${(size / 1024 / 1024).toFixed(0)} MB)`);
}

await takeSnapshot('baseline', '/tmp/snap-before.heapsnapshot');

console.log(`\nSending ${LOAD_REQUESTS} requests to ${TARGET_URL}...`);
for (let i = 0; i < LOAD_REQUESTS / BATCH_SIZE; i++) {
  const promises = [];
  for (let j = 0; j < BATCH_SIZE; j++) {
    promises.push(fetch(TARGET_URL).then(r => r.text()).catch(() => null));
  }
  await Promise.all(promises);
}

await takeSnapshot('post-load', '/tmp/snap-after.heapsnapshot');
ws.close();

// ===== Phase 2: Stream-parse snapshots =====
console.log('\n=== Phase 2: Stream-parse snapshots ===\n');

async function extractMeta(filePath) {
  const stream = createReadStream(filePath, { highWaterMark: 8 * 1024 * 1024 });
  return new Promise((resolve, reject) => {
    let nodeFields = null, nodeTypeEnum = null, buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk.toString('utf-8');
      if (!nodeFields) {
        const m = buffer.match(/"node_fields"\s*:\s*(\[[\s\S]*?\])/);
        if (m) nodeFields = JSON.parse(m[1]);
      }
      if (!nodeTypeEnum) {
        const m = buffer.match(/"node_types"\s*:\s*(\[[\s\S]*?\]),\s*"nodes"/);
        if (m) { const t = JSON.parse(m[1]); nodeTypeEnum = t[0]; }
      }
      if (nodeFields && nodeTypeEnum) { stream.destroy(); resolve({ nodeFields, nodeTypeEnum }); }
      if (buffer.length > 500 * 1024 * 1024) { buffer = buffer.slice(-200); }
    });
    stream.on('end', () => resolve({ nodeFields, nodeTypeEnum }));
    stream.on('error', reject);
  });
}

const meta1 = await extractMeta('/tmp/snap-before.heapsnapshot');
const meta2 = await extractMeta('/tmp/snap-after.heapsnapshot');
const nodeFields = meta2.nodeFields || meta1.nodeFields;
const nodeTypeEnum = meta2.nodeTypeEnum || meta1.nodeTypeEnum;

if (!nodeFields) { console.error('Could not extract node_fields'); process.exit(1); }

const fieldCount = nodeFields.length;
const typeIdx = nodeFields.indexOf('type');
const nameIdx = nodeFields.indexOf('name');
const selfSizeIdx = nodeFields.indexOf('self_size');
console.log(`  node_fields: ${nodeFields.join(', ')} (${fieldCount})`);

// Stream-count nodes by type
function streamCountNodes(filePath, label) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, { highWaterMark: 4 * 1024 * 1024 });
    const statsByType = {};
    let totalSelfSize = 0, nodeCount = 0;
    let inNodesArray = false, numberBuffer = '', nodeValueIndex = 0, currentNodeData = [];
    let seekBuffer = '';

    stream.on('data', (chunk) => {
      const data = chunk.toString('utf-8');
      if (!inNodesArray) {
        seekBuffer += data;
        const nodesIdx = seekBuffer.indexOf('"nodes":');
        if (nodesIdx !== -1) {
          const bracketIdx = seekBuffer.indexOf('[', nodesIdx);
          if (bracketIdx !== -1) {
            inNodesArray = true;
            processNodeData(seekBuffer.substring(bracketIdx + 1));
            seekBuffer = '';
            return;
          }
        }
        if (seekBuffer.length > 500 * 1024 * 1024) seekBuffer = seekBuffer.slice(-200);
        return;
      }
      processNodeData(data);
    });

    function processNodeData(data) {
      for (let i = 0; i < data.length; i++) {
        const ch = data[i];
        if (ch === '-' || (ch >= '0' && ch <= '9')) { numberBuffer += ch; continue; }
        if (numberBuffer.length > 0) {
          const val = parseInt(numberBuffer, 10);
          numberBuffer = '';
          currentNodeData[nodeValueIndex] = val;
          nodeValueIndex++;
          if (nodeValueIndex === fieldCount) {
            const nt = currentNodeData[typeIdx];
            const ss = currentNodeData[selfSizeIdx];
            const key = NODE_TYPES[nt] || `type_${nt}`;
            if (!statsByType[key]) statsByType[key] = { count: 0, selfSize: 0 };
            statsByType[key].count++;
            statsByType[key].selfSize += ss;
            totalSelfSize += ss;
            nodeCount++;
            if (nodeCount % 2000000 === 0) console.log(`  ${label}: ${nodeCount} nodes...`);
            nodeValueIndex = 0;
            currentNodeData = [];
          }
        }
        if (ch === ']') {
          console.log(`  ${label}: ${nodeCount} nodes, selfSize=${mb(totalSelfSize)} MB`);
          stream.destroy();
          resolve({ statsByType, totalSelfSize, nodeCount });
          return;
        }
      }
    }

    stream.on('end', () => resolve({ statsByType, totalSelfSize, nodeCount }));
    stream.on('error', reject);
  });
}

const result1 = await streamCountNodes('/tmp/snap-before.heapsnapshot', 'Before');
const result2 = await streamCountNodes('/tmp/snap-after.heapsnapshot', 'After');

// ===== Phase 3: Compare =====
console.log('\n========== Heap Comparison ==========\n');

const allTypes = new Set([...Object.keys(result1.statsByType), ...Object.keys(result2.statsByType)]);
const deltas = [];
for (const type of allTypes) {
  const b = result1.statsByType[type] || { count: 0, selfSize: 0 };
  const a = result2.statsByType[type] || { count: 0, selfSize: 0 };
  deltas.push({ type, count1: b.count, count2: a.count, countDelta: a.count - b.count,
    size1: b.selfSize, size2: a.selfSize, sizeDelta: a.selfSize - b.selfSize });
}

deltas.sort((a, b) => b.sizeDelta - a.sizeDelta);

console.log('Top 50 Types by Self-Size Growth:\n');
console.log('  Type'.padEnd(35) + '| Count +/-   | Size +/- (KB)'.padEnd(20) + '| After (MB)');
console.log('  ' + '-'.repeat(85));
for (let i = 0; i < Math.min(50, deltas.length); i++) {
  const d = deltas[i];
  if (d.sizeDelta <= 0 && d.countDelta <= 0) break;
  const countStr = d.countDelta >= 0 ? `+${d.countDelta}` : `${d.countDelta}`;
  const sizeStr = d.sizeDelta >= 0 ? `+${kb(d.sizeDelta)}` : kb(d.sizeDelta);
  console.log(`  ${d.type.padEnd(35)}| ${countStr.padStart(10)}  | ${sizeStr.padStart(14)}  | ${mb(d.size2).padStart(10)}`);
}

deltas.sort((a, b) => b.countDelta - a.countDelta);
console.log('\nTop 50 Types by Count Growth:\n');
console.log('  Type'.padEnd(35) + '| Count +/-   | Size +/- (KB)'.padEnd(20) + '| Count After');
console.log('  ' + '-'.repeat(85));
for (let i = 0; i < Math.min(50, deltas.length); i++) {
  const d = deltas[i];
  if (d.countDelta <= 0) break;
  const countStr = d.countDelta >= 0 ? `+${d.countDelta}` : `${d.countDelta}`;
  const sizeStr = d.sizeDelta >= 0 ? `+${kb(d.sizeDelta)}` : kb(d.sizeDelta);
  console.log(`  ${d.type.padEnd(35)}| ${countStr.padStart(10)}  | ${sizeStr.padStart(14)}  | ${String(d.count2).padStart(11)}`);
}

console.log('\n========== Summary ==========');
console.log(`Baseline: ${result1.nodeCount} nodes, selfSize=${mb(result1.totalSelfSize)} MB`);
console.log(`After:    ${result2.nodeCount} nodes, selfSize=${mb(result2.totalSelfSize)} MB`);
console.log(`Delta:    ${result2.nodeCount - result1.nodeCount} nodes, ${mb(result2.totalSelfSize - result1.totalSelfSize)} MB`);

await unlink('/tmp/snap-before.heapsnapshot').catch(() => {});
await unlink('/tmp/snap-after.heapsnapshot').catch(() => {});
