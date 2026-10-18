import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const bootstrapUrl = new URL('./bootstrap.ts', import.meta.url).href;

for (const platform of ['win32', 'linux', 'darwin']) {
  test(`bootstrap preserves the server cluster policy on ${platform}`, () => {
    const source = `
      import assert from 'node:assert/strict';
      import { registerHooks } from 'node:module';
      const bootstrapUrl = ${JSON.stringify(bootstrapUrl)};
      Object.defineProperty(process, 'platform', { value: ${JSON.stringify(platform)} });
      const calls = globalThis.calls = [];
      const app = globalThis.app = {};
      const mocks = {
        '../utils/util.ts': 'export function prepareEnv(env) { return env; }',
        './cluster.ts':
          'export async function startCluster(workers, options) { globalThis.calls.push({ kind: "cluster", workers, options }); if (globalThis.failure) throw globalThis.failure; }' +
          'export async function startWorker(options) { globalThis.calls.push({ kind: "worker", options }); if (globalThis.failure) throw globalThis.failure; return globalThis.app; }',
      };
      registerHooks({
        resolve(specifier, context, nextResolve) {
          if (context.parentURL === bootstrapUrl && mocks[specifier]) {
            return { url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]), shortCircuit: true };
          }
          return nextResolve(specifier, context);
        },
      });
      const { bootstrap } = await import(bootstrapUrl);
      for (const mode of ['prod', 'test', 'dev']) {
        for (const workers of [1, 2]) {
          process.env.META_MODE = mode;
          const options = { env: { SERVER_WORKERS: String(workers) } };
          const result = await bootstrap(options);
          const clustered = process.platform === 'win32' || mode === 'dev' || workers > 1;
          assert.equal(calls.length, 1);
          const call = calls.pop();
          assert.equal(call.kind, clustered ? 'cluster' : 'worker', mode + ':' + workers);
          assert.equal(call.options, options);
          if (clustered) {
            assert.equal(call.workers, workers);
            assert.equal(result, undefined);
          } else {
            assert.equal(result, app);
          }
        }
      }
      process.env.META_MODE = 'prod';
      const failure = globalThis.failure = new Error('startup failed');
      await assert.rejects(bootstrap({ env: { SERVER_WORKERS: '1' } }), error => error === failure);
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '--eval', source], {
      encoding: 'utf8',
      timeout: 5_000,
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(result.status, 0, result.stderr);
  });
}
