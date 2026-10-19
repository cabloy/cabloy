import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const workerUrl = new URL('./processWorker.ts', import.meta.url).href;

for (const scenario of ['clean', 'reject', 'timeout', 'signal'] as const) {
  test(`worker cooperative close reuses guarded cleanup: ${scenario}`, () => {
    const source = `
      import assert from 'node:assert/strict';
      import { registerHooks } from 'node:module';
      const scenario = process.argv[1];
      let closes = 0;
      let finished = false;
      globalThis.closeMock = async () => {
        closes++;
        if (scenario === 'timeout') return new Promise(() => {});
        await new Promise(resolve => setTimeout(resolve, 30));
        if (scenario === 'reject') throw new Error('close failed');
        finished = true;
      };
      registerHooks({ resolve(specifier, context, nextResolve) {
        if (context.parentURL === ${JSON.stringify(workerUrl)}) {
          const source = {
            '@cabloy/utils': 'export async function catchError(fn) { try { return [await fn()]; } catch (error) { return [undefined, error]; } } export function catchErrorSync(fn) { try { return [fn()]; } catch (error) { return [undefined, error]; } }',
            './useApp.ts': 'export const closeApp = globalThis.closeMock; export function useApp() {}',
          }[specifier];
          if (source) return { url: 'data:text/javascript,' + encodeURIComponent(source), shortCircuit: true };
        }
        return nextResolve(specifier, context);
      } });
      process.on('exit', code => {
        assert.equal(closes, 1);
        assert.equal(finished, scenario === 'clean' || scenario === 'signal');
        console.log(JSON.stringify({ code, closes, finished }));
      });
      const { closeProcessWorker, handleProcessWork } = await import(${JSON.stringify(workerUrl)});
      handleProcessWork();
      if (scenario === 'signal') process.emit('SIGTERM');
      else void closeProcessWorker();
      void closeProcessWorker();
      process.emit('SIGINT');
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', source, scenario], {
      encoding: 'utf8',
      timeout: 8000,
    });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(
      result.status,
      scenario === 'reject' || scenario === 'timeout' ? 1 : 0,
      result.stderr,
    );
    assert.match(result.stdout, /"closes":1/);
    if (scenario === 'reject') assert.match(result.stderr, /close failed/);
    if (scenario === 'timeout') assert.match(result.stdout, /Cleanup timed out/);
  });
}
