import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const masterUrl = new URL('./processMaster.ts', import.meta.url).href;
const clusterUrl = new URL('./cluster.ts', import.meta.url).href;

// Import only the real master handler into a subprocess. Cluster workers and useApp are mocks;
// process.exit and the shutdown timeout remain real, without loading an app or opening listeners.
const masterSource = `
  import assert from 'node:assert/strict';
  import { EventEmitter } from 'node:events';
  import { registerHooks } from 'node:module';
  const masterUrl = ${JSON.stringify(masterUrl)};
  const cluster = globalThis.clusterMock = new EventEmitter();
  cluster.workers = {};
  let forks = 0;
  const kills = [];
  const exited = [];
  function exit(worker, code, signal = null) {
    delete cluster.workers[worker.id];
    exited.push({ id: worker.id, code, signal });
    cluster.emit('exit', worker, code, signal);
  }
  cluster.fork = () => {
    assert.equal(cluster.listenerCount('message'), 1, 'message handler must precede fork');
    assert.equal(cluster.listenerCount('exit'), 1, 'exit handler must precede fork');
    assert.ok(process.listenerCount('SIGINT'));
    assert.ok(process.listenerCount('SIGUSR2'));
    const worker = { id: ++forks, process: { kill(signal) {
      kills.push({ id: worker.id, signal });
      // Synchronous exit also proves reload intent is recorded before kill.
      exit(worker, globalThis.reloadFailure ? 1 : null, globalThis.reloadFailure ? null : signal);
    } } };
    cluster.workers[worker.id] = worker;
    return worker;
  };
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL === masterUrl) {
        const source = {
          'node:cluster': 'export default globalThis.clusterMock;',
          'chalk': 'export default { cyan: message => message };',
          './useApp.ts': 'export function useApp() { return { meta: { env: { LOGGER_DUMMY: "true" } } }; }',
        }[specifier];
        if (source) return { url: 'data:text/javascript,' + encodeURIComponent(source), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
  });
  process.on('exit', code => console.log(JSON.stringify({ code, forks, kills, exited })));
  const { handleProcessMaster } = await import(masterUrl);
  handleProcessMaster(2);
  const [first, second] = Object.values(cluster.workers);
  const scenario = process.argv[1];
  switch (scenario) {
    case 'all-clean':
      exit(first, 0);
      assert.equal(Object.keys(cluster.workers).length, 1);
      exit(second, 0);
      break;
    case 'failure-then-clean':
      exit(first, 7);
      assert.equal(Object.keys(cluster.workers).length, 1);
      exit(second, 0);
      break;
    case 'unexpected-signal':
      exit(first, null, 'SIGTERM');
      exit(second, 0);
      break;
    case 'shutdown-SIGINT':
    case 'shutdown-SIGUSR2': {
      const signal = scenario.slice('shutdown-'.length);
      process.emit(signal);
      exit(first, null, signal);
      exit(second, 0);
      break;
    }
    case 'reload':
    case 'reload-failure': {
      globalThis.reloadFailure = scenario === 'reload-failure';
      cluster.emit('message', first, 'reload-worker');
      assert.equal(forks, 3);
      const replacement = cluster.workers[3];
      assert.ok(replacement);
      exit(second, 0);
      exit(replacement, 0);
      break;
    }
    case 'reload-during-shutdown':
      process.emit('SIGUSR2');
      cluster.emit('message', first, 'reload-worker');
      assert.equal(forks, 2, 'shutdown must not create a replacement');
      exit(second, 0);
      break;
    case 'failure-then-shutdown':
      exit(first, 1);
      process.emit('SIGINT');
      exit(second, null, 'SIGINT');
      break;
    case 'failure-during-shutdown':
      process.emit('SIGINT');
      exit(first, 1);
      exit(second, 0);
      break;
    case 'unexpected-signal-during-shutdown':
      process.emit('SIGINT');
      exit(first, null, 'SIGKILL');
      exit(second, 0);
      break;
    default:
      throw new Error('Unknown scenario: ' + scenario);
  }
  throw new Error('Final worker exit must terminate the master');
`;

test('cluster creates the master app before installing handlers and forking workers', () => {
  const source = `
    import assert from 'node:assert/strict';
    import { registerHooks } from 'node:module';
    const clusterUrl = ${JSON.stringify(clusterUrl)};
    const calls = globalThis.calls = [];
    const mocks = {
      'node:cluster': 'export default { isPrimary: true };',
      './createApp.ts': 'export async function createAppMaster(options) { globalThis.calls.push("create"); await Promise.resolve(); globalThis.masterOptions = options; } export function createApp() { throw new Error("Unexpected worker"); }',
      './processMaster.ts': 'export function handleProcessMaster(workers) { if (!globalThis.masterOptions) throw new Error("Master app not ready"); globalThis.calls.push(["handle", workers]); }',
      './processWorker.ts': 'export function handleProcessWork() { throw new Error("Unexpected worker"); }',
    };
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (context.parentURL === clusterUrl && mocks[specifier]) {
          return { url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]), shortCircuit: true };
        }
        return nextResolve(specifier, context);
      },
    });
    const { startCluster } = await import(clusterUrl);
    const options = {};
    await startCluster(2, options);
    assert.equal(globalThis.masterOptions, options);
    assert.deepEqual(calls, ['create', ['handle', 2]]);
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
    encoding: 'utf8',
    timeout: 3_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stderr);
  assert.equal(result.status, 0, result.stderr);
});

const scenarios = [
  { name: 'all-clean', code: 0 },
  { name: 'failure-then-clean', code: 1 },
  { name: 'unexpected-signal', code: 1 },
  { name: 'shutdown-SIGINT', code: 0 },
  { name: 'shutdown-SIGUSR2', code: 0 },
  { name: 'reload', code: 0, reload: true },
  { name: 'reload-failure', code: 1, reload: true },
  { name: 'reload-during-shutdown', code: 0 },
  { name: 'failure-then-shutdown', code: 1 },
  { name: 'failure-during-shutdown', code: 1 },
  { name: 'unexpected-signal-during-shutdown', code: 1 },
];

for (const scenario of scenarios) {
  test(`process master: ${scenario.name}`, () => {
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '--eval', masterSource, scenario.name],
      { encoding: 'utf8', timeout: 3_000 },
    );
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(result.status, scenario.code, result.stderr);
    const summary = JSON.parse(result.stdout);
    assert.equal(summary.code, scenario.code);
    assert.equal(summary.forks, scenario.reload ? 3 : 2);
    assert.equal(summary.exited.length, summary.forks);
    assert.deepEqual(
      summary.kills,
      scenario.name.startsWith('reload') ? [{ id: 1, signal: 'SIGTERM' }] : [],
    );
  });
}
