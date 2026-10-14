import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const devUrl = new URL('../src/lib/bean/cli.bin.dev.ts', import.meta.url).href;
const source = `
  import assert from 'node:assert/strict';
  import { EventEmitter } from 'node:events';
  import { registerHooks } from 'node:module';
  import { setImmediate as nextTurn } from 'node:timers/promises';
  const devUrl = ${JSON.stringify(devUrl)};
  const events = new EventEmitter();
  let options;
  let resetCount = 0;
  let watchersActive = true;
  const nodemon = globalThis.nodemonMock = opts => { options = opts; };
  nodemon.reset = done => {
    resetCount++;
    watchersActive = false;
    events.removeAllListeners();
    done();
  };
  nodemon.on = (event, handler) => { events.on(event, handler); return nodemon; };
  nodemon.emit = (event, ...args) => { events.emit(event, ...args); return nodemon; };
  const mocks = {
    '@cabloy/cli': 'export class BeanCliBase {}',
    'nodemon': 'export default globalThis.nodemonMock;',
    'rimraf': 'export function rimraf() { throw new Error("Unexpected cleanup"); }',
    'vona-core': 'export function resolveVonaLocalPaths() { throw new Error("Unexpected app access"); }',
    '../utils.ts': 'export function getImportEsm() { return "--import=./.vona/register.js"; }',
    './toolsBin/generateVonaMeta.ts': 'export function generateVonaMeta() { throw new Error("Unexpected generation"); }',
  };
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL === devUrl && mocks[specifier]) {
        return { url: 'data:text/javascript,' + encodeURIComponent(mocks[specifier]), shortCircuit: true };
      }
      return nextResolve(specifier, context);
    },
  });
  const { CliBinDev } = await import(devUrl);
  const cli = Object.create(CliBinDev.prototype);
  let settled = false;
  const result = cli._run('/mock-project', {});
  result.then(() => { settled = true; }, () => {
    assert.equal(watchersActive, false, 'close watchers before propagating failure');
    settled = true;
  });
  assert.equal(options.cwd, '/mock-project');
  assert.equal(options.script, '.vona/bootstrap.ts');
  // Leave nodemon's default stdout/stderr forwarding intact, including the original failure log.
  assert.equal(options.stdout, undefined);
  assert.equal(options.stderr, undefined);
  const scenario = process.argv[1];
  let quits = 0;
  events.on('quit', () => { quits++; });
  if (scenario === 'crash') {
    console.error('Database cabloy_dev is missing. Create the disposable database first.');
    nodemon.emit('crash'); // nodemon provides no crash payload
    // Duplicate crashes must not request duplicate shutdowns.
    nodemon.emit('crash');
    await assert.rejects(result, /Development server crashed; see the startup error above/);
    await nextTurn();
    assert.equal(quits, 1);
    assert.equal(settled, true);
    assert.equal(resetCount, 1);
    assert.equal(watchersActive, false);
  } else {
    nodemon.emit('start');
    nodemon.emit('restart', ['src/example.ts']);
    nodemon.emit('exit');
    await nextTurn();
    assert.equal(settled, false, 'ordinary restart/clean exit must keep supervision running');
    assert.equal(quits, 0);
    assert.equal(resetCount, 0);
    assert.equal(watchersActive, true);
    nodemon.emit('quit');
    assert.equal(await result, undefined);
    assert.equal(quits, 1);
  }
  console.log('verified');
`;

for (const scenario of ['crash', 'restart-and-quit']) {
  test(`dev nodemon lifecycle: ${scenario}`, () => {
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '--eval', source, scenario],
      {
        encoding: 'utf8',
        timeout: 3_000,
      },
    );
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /verified/);
    if (scenario === 'crash') assert.match(result.stderr, /Database cabloy_dev is missing/);
  });
}
