import compileTemplate from 'lodash/template.js';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const buildUrl = new URL('../src/lib/bean/cli.bin.build.ts', import.meta.url).href;
const rollupUrl = import.meta.resolve('rollup');

// Exercise the real _rollup and Rollup writer, isolating CLI setup and heavyweight plugins.
// Template collaborators are virtual modules: no application, environment files, or listeners.
const source = `
  import assert from 'node:assert/strict';
  import { realpathSync } from 'node:fs';
  import { registerHooks } from 'node:module';
  import { join } from 'node:path';
  import { pathToFileURL } from 'node:url';
  import { rollup as realRollup } from ${JSON.stringify(rollupUrl)};
  const buildUrl = ${JSON.stringify(buildUrl)};
  const projectPath = realpathSync(process.argv[1]);
  const outDir = join(projectPath, 'dist/normal');
  const modules = {
    './env.ts': 'export default { fixture: "env" };',
    './modules-meta.ts': 'export default { fixture: "modulesMeta" };',
    './config.ts': 'export default { fixture: "config" };',
    '../src/backend/config/locales.ts': 'export default { en: { fixture: "locale" } };',
    '../src/backend/config/monkey.ts': 'export class AppMonkey {}',
  };
  globalThis.fixturePlugin = {
    name: 'fixture-collaborators',
    resolveId(id) {
      if (Object.hasOwn(modules, id)) return '\\0fixture:' + id;
    },
    load(id) {
      if (id.startsWith('\\0fixture:')) return modules[id.slice('\\0fixture:'.length)];
    },
  };
  let builds = 0;
  globalThis.rollupMock = async options => {
    builds++;
    assert.deepEqual(options.input, {
      bootstrap: join(projectPath, '.vona/bootstrap.ts'),
      app: join(projectPath, '.vona/app.ts'),
    });
    return realRollup(options);
  };
  const mocks = {
    '@cabloy/cli': 'export class BeanCliBase {}',
    'rollup': 'export const rollup = globalThis.rollupMock;',
    '@rollup/plugin-node-resolve': 'export default () => globalThis.fixturePlugin;',
    '../utils.ts':
      'export function generateConfigDefine() { return {}; }' +
      'export function getAbsolutePathOfModule(id) { return id; }' +
      'export function getOutDir() { throw new Error("Unexpected output lookup"); }' +
      'export function getOutReleasesDir() { throw new Error("Unexpected release lookup"); }',
    './toolsBin/generateVonaMeta.ts':
      'export function generateVonaMeta() { throw new Error("Unexpected app generation"); }',
  };
  const calls = globalThis.calls = [];
  const createdApp = globalThis.createdApp = { fixture: 'createdApp' };
  const bootstrapResult = globalThis.bootstrapResult = Promise.resolve({ fixture: 'bootstrap' });
  registerHooks({
    resolve(specifier, context, nextResolve) {
      let mock;
      if (context.parentURL === buildUrl) {
        mock = mocks[specifier];
        if (!mock && specifier.startsWith('@rollup/plugin-')) {
          mock = 'export default () => ({ name: "fixture-noop" });';
        }
      }
      if (specifier === 'vona' && context.parentURL?.startsWith(pathToFileURL(outDir + '/').href)) {
        mock =
          'export async function createApp(options) {' +
          '  globalThis.calls.push(["createApp", options]); return globalThis.createdApp;' +
          '}' +
          'export function bootstrap(options) {' +
          '  globalThis.calls.push(["bootstrap", options]); return globalThis.bootstrapResult;' +
          '}';
      }
      if (mock) return { url: 'data:text/javascript,' + encodeURIComponent(mock), shortCircuit: true };
      return nextResolve(specifier, context);
    },
  });
  const { CliBinBuild } = await import(buildUrl);
  const cli = Object.create(CliBinBuild.prototype);
  await cli._rollup(projectPath, {}, {
    modules: {
      fixture: {
        package: {
          dependencies: { vona: '0.0.0-fixture' },
          vonaModule: { bundle: { externals: ['vona'] } },
        },
      },
    },
  }, outDir);
  assert.equal(builds, 1, 'must run the real _rollup input configuration');
  assert.deepEqual(calls, [], 'building must not execute either entry');

  const app = await import(pathToFileURL(join(outDir, 'app.js')).href);
  assert.equal(typeof app.createSingleApp, 'function');
  assert.deepEqual(calls, [], 'importing app.js must neither create nor bootstrap an app');
  assert.equal(await app.createSingleApp(), createdApp);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'createApp');
  const options = calls[0][1];
  assert.deepEqual(Object.keys(options).sort(), ['AppMonkey', 'config', 'env', 'locales', 'modulesMeta']);
  assert.deepEqual(options.env, { fixture: 'env' });
  assert.equal(options.AppMonkey.name, 'AppMonkey');
  assert.deepEqual((await options.modulesMeta()).default, { fixture: 'modulesMeta' });
  assert.deepEqual((await options.config()).default, { fixture: 'config' });
  assert.deepEqual((await options.locales()).default, { en: { fixture: 'locale' } });

  const bootstrap = await import(pathToFileURL(join(outDir, 'bootstrap.js')).href);
  assert.equal(calls.length, 2, 'importing bootstrap.js must eagerly bootstrap once');
  assert.equal(calls[1][0], 'bootstrap');
  assert.equal(bootstrap.appBootstrap, bootstrapResult);
  const bootstrapOptions = calls[1][1];
  assert.deepEqual(Object.keys(bootstrapOptions).sort(), Object.keys(options).sort());
  assert.equal(bootstrapOptions.env, options.env);
  assert.equal(bootstrapOptions.AppMonkey, options.AppMonkey);
  for (const key of ['modulesMeta', 'config', 'locales']) {
    assert.equal(await bootstrapOptions[key](), await options[key](), key + ' must load the same module');
  }
`;

test('production build emits a lazy app factory alongside the eager bootstrap entry', () => {
  const projectPath = mkdtempSync(join(tmpdir(), 'vona-bin-build-entries-'));
  try {
    mkdirSync(join(projectPath, '.vona'));
    writeFileSync(join(projectPath, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const entry of ['app', 'bootstrap']) {
      const template = readFileSync(
        new URL(`../templates/app/${entry}.ejs`, import.meta.url),
        'utf8',
      );
      writeFileSync(
        join(projectPath, '.vona', `${entry}.ts`),
        compileTemplate(template)({ appMonkey: true }),
      );
    }
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '--eval', source, projectPath],
      {
        cwd: projectPath,
        encoding: 'utf8',
        timeout: 15_000,
        env: { ...process.env, BUILD_MINIFY: 'false', BUILD_SOURCEMAP: 'false' },
      },
    );
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(projectPath, { recursive: true, force: true });
  }
});
