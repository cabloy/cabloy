import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { after, test } from 'node:test';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { runInNewContext } from 'node:vm';

const tools = new URL('../src/lib/bean/toolsBin/', import.meta.url);
const metaUrl = new URL('generateVonaMeta.ts', tools).href;
const entryUrl = new URL('generateEntryFiles.ts', tools).href;
const configUrl = new URL('configUtils.ts', tools).href;
const validationUrl = new URL('validateGenerationPaths.ts', tools).href;
const devUrl = new URL('../src/lib/bean/cli.bin.dev.ts', import.meta.url).href;
const core = new URL('../../../packages-vona/vona-core/src/lib/core/', import.meta.url);
const isolationUrl = new URL('testIsolation.ts', core).href;
const strictUrl = new URL('testStrictMode.ts', core).href;
const sourceUrls = [metaUrl, entryUrl, configUrl, validationUrl, devUrl, isolationUrl, strictUrl];
const runId = '20261020010203-a1b2c3d4';
const project = '/synthetic-project';
const generatedDir = `.vona-test-${runId}`;
const generatedRoot = path.join(project, generatedDir);
const dataRoot = path.join(project, `.app-test-${runId}`);
const secret = 'SYNTHETIC_ENV_VALUE_NEVER_PERSIST';
const escapedKey = 'selected"\\\nkey';
const ordinaryEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  META_FLAVOR: 'normal',
  META_MODE: 'test',
};
const fakeProcess = Object.assign(new EventEmitter(), {
  env: ordinaryEnv,
  execPath: '/synthetic-node',
  exit() {
    throw new Error('Unexpected process exit');
  },
});
let writes: Array<[string, string]> = [];
let actions: string[] = [];
let envLoads = 0;
let failTemplate = false;
let owners: Set<string>;
let spawned: { executable: string; args: string[]; options: any; child: any } | undefined;
let removed: string[] = [];
const nodemonEvents = new EventEmitter();
let nodemonOptions: any;
let resets = 0;
const nodemon = Object.assign(
  (options: unknown) => {
    nodemonOptions = options;
  },
  {
    on(event: string, handler: (...args: any[]) => void) {
      nodemonEvents.on(event, handler);
      return nodemon;
    },
    emit(event: string, ...args: any[]) {
      nodemonEvents.emit(event, ...args);
      return nodemon;
    },
    reset(done: () => void) {
      resets++;
      nodemonEvents.removeAllListeners();
      done();
    },
  },
);
const capture = (file: string, content = '') => {
  actions.push('write');
  writes.push([file, content]);
};
const fs = {
  existsSync: () => true,
  lstatSync: (file: string) => ({
    isFile: () => owners.has(file),
    isSymbolicLink: () => false,
  }),
  readFileSync: (file: string) => {
    actions.push('owner');
    assert.ok(owners.has(file));
    return `${runId}\n`;
  },
  ensureFileSync: (file: string) => capture(file),
  ensureDir: async (file: string) => capture(file),
  writeFileSync: (file: string, content: string) => capture(file, content),
};
const fixture = {
  process: fakeProcess,
  fs,
  nodemon,
  loadEnvs() {
    actions.push('env');
    envLoads++;
    return {
      PRIVATE_SETTING: secret,
      [escapedKey]: `${secret}-escaped`,
      OMITTED: undefined,
      EMPTY: '',
      APP_NAME: `${secret}-dotenv-app`,
      SERVER_LISTEN_PORT: '7102',
      SERVER_LISTEN_HOSTNAME: `${secret}-dotenv-host`,
      SERVER_WORKERS: '19',
      META_MODE: 'prod',
    };
  },
  async copyTemplateFile(_source: string, dest: string, vars: unknown) {
    capture(dest, JSON.stringify(vars));
    if (failTemplate && dest.endsWith('bootstrap.ts'))
      throw new Error('Synthetic template failure');
  },
  spawn(executable: string, args: string[], options: any) {
    const child = Object.assign(new EventEmitter(), {
      signals: [] as string[],
      kill(signal: string) {
        this.signals.push(signal);
        return true;
      },
    });
    spawned = { executable, args, options, child };
    return child;
  },
  async rimraf(root: string) {
    removed.push(root);
  },
};
const previous = Object.getOwnPropertyDescriptor(globalThis, '__strictCliPrivacy');
Object.defineProperty(globalThis, '__strictCliPrivacy', { configurable: true, value: fixture });
const access = 'globalThis.__strictCliPrivacy';
const mocks: Record<string, string> = {
  'vona-core': `export * from ${JSON.stringify(isolationUrl)}; export * from ${JSON.stringify(strictUrl)};`,
  '@cabloy/cli': 'export class BeanCliBase {}',
  'fs-extra': `export default ${access}.fs;`,
  'node:fs': `export const lstatSync = ${access}.fs.lstatSync;`,
  '@cabloy/dotenv': `export const loadEnvs = ${access}.loadEnvs; export function getEnvFiles() { return []; }`,
  '@cabloy/module-glob':
    'export async function glob() { return { modules: {}, modulesArray: [] }; }',
  'node:os': 'export default { cpus() { throw new Error("Unexpected host CPU lookup"); } };',
  'chalk': 'export default { red: value => value };',
  'node:child_process': `export const spawn = ${access}.spawn;`,
  'nodemon': `export default ${access}.nodemon;`,
  'rimraf': `export const rimraf = ${access}.rimraf;`,
  '../../../utils.ts': 'export function resolveTemplatePath(value) { return value; }',
  '../../utils.ts': `
    export const copyTemplateFile = ${access}.copyTemplateFile;
    export function getEnvMeta(meta) { return { ...meta, local: 'local' }; }
    export function getNodeEnv(mode) { return mode === 'test' ? 'test' : mode === 'dev' ? 'development' : 'production'; }
  `,
  '../utils.ts':
    'export function getImportEsm(dir = ".vona") { return "--import=./" + dir + "/register.js"; }',
};
// Only these real modules receive the synthetic process and virtual collaborators.
// There are no child processes, application/env files, listeners, drivers or cleanup on disk.
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (sourceUrls.includes(context.parentURL ?? '') && mocks[specifier]) {
      return {
        url: `data:text/javascript,${encodeURIComponent(mocks[specifier])}`,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    const loaded = nextLoad(url, context);
    if (!sourceUrls.includes(url)) return loaded;
    return { ...loaded, source: `const process = ${access}.process;\n${loaded.source}` };
  },
});
let generateVonaMeta: any;
let generateEntryFiles: any;
let CliBinDev: any;
try {
  ({ generateVonaMeta } = await import(metaUrl));
  ({ generateEntryFiles } = await import(entryUrl));
  ({ CliBinDev } = await import(devUrl));
} finally {
  hooks.deregister();
}
after(() => {
  if (previous) Object.defineProperty(globalThis, '__strictCliPrivacy', previous);
  else Reflect.deleteProperty(globalThis, '__strictCliPrivacy');
});

function reset(strict = true) {
  fakeProcess.removeAllListeners();
  fakeProcess.env = {
    ...ordinaryEnv,
    ...(strict ? { VONA_TEST_REQUIRE_FRESH_RESOURCES: 'true', VONA_TEST_RUN_ID: runId } : {}),
    SERVER_LISTEN_PORT: '43123',
    SERVER_LISTEN_HOSTNAME: 'inherited-host',
    SERVER_WORKERS: '23',
    APP_NAME: 'inherited-app',
    PRIVATE_SETTING: 'inherited-value',
    UNRELATED_OS_KEY: 'not-selected',
    VONA_TEST_SERVER_ORIGIN: 'true',
    VONA_TEST_READY_FILE: '/synthetic-ready',
    VONA_TEST_CLAIM_TOKEN: 'synthetic-claim-control',
  };
  owners = new Set([dataRoot, generatedRoot].map(root => path.join(root, '.vona-test-owner')));
  writes = [];
  actions = [];
  envLoads = 0;
  failTemplate = false;
  spawned = undefined;
  removed = [];
  nodemonEvents.removeAllListeners();
  nodemonOptions = undefined;
  resets = 0;
}
const meta = { flavor: 'normal', mode: 'test' };
const options = { appDir: project, runtimeDir: generatedDir, workers: 1 };
function cli(mode = 'test') {
  const instance = Object.create(CliBinDev.prototype);
  Object.defineProperty(instance, 'context', { value: { argv: { mode } } });
  return instance;
}
function envSource() {
  return writes.find(([file, content]) => file.endsWith('/env.ts') && content)?.[1] ?? '';
}
function assertPrivateWrites() {
  assert.ok(writes.length > 0);
  assert.ok(!JSON.stringify(writes).includes(secret), 'no resolved sentinel in any fake write');
}
function projectEnv(source: string, env: NodeJS.ProcessEnv) {
  const js = source
    .replace('export default ', 'globalThis.result = ')
    .replace(' as NodeJS.ProcessEnv', '');
  const context = { process: { env }, result: undefined as any };
  runInNewContext(js, context);
  return JSON.parse(JSON.stringify(context.result));
}

test('strict generation and direct writer reject invalid mode/run/directory/owners before env or writes', async () => {
  const cases = [
    'flag',
    'mode',
    'missing',
    'malformed',
    'directory',
    'data-owner',
    'generated-owner',
  ];
  for (const name of cases) {
    for (const direct of [false, true]) {
      reset();
      const configMeta = { ...meta };
      const configOptions = { ...options };
      if (name === 'flag') fakeProcess.env.VONA_TEST_REQUIRE_FRESH_RESOURCES = 'false';
      if (name === 'mode') configMeta.mode = 'dev';
      if (name === 'missing') delete fakeProcess.env.VONA_TEST_RUN_ID;
      if (name === 'malformed') fakeProcess.env.VONA_TEST_RUN_ID = 'not-a-run';
      if (name === 'directory') configOptions.runtimeDir = '.vona';
      if (name === 'data-owner') owners.delete(path.join(dataRoot, '.vona-test-owner'));
      if (name === 'generated-owner') owners.delete(path.join(generatedRoot, '.vona-test-owner'));
      await assert.rejects(
        direct
          ? generateEntryFiles(
              configMeta,
              configOptions,
              { modules: {}, modulesArray: [] },
              { PRIVATE_SETTING: secret },
            )
          : generateVonaMeta(configMeta, configOptions),
      );
      assert.equal(envLoads, 0, name);
      assert.deepEqual(writes, [], name);
    }
  }
});

test('strict generation writes only selected keys, including on later failure; projection reads child env', async () => {
  reset();
  const { env } = await generateVonaMeta(meta, options);
  assert.equal(envLoads, 1);
  assert.ok(actions.indexOf('owner') < actions.indexOf('env'));
  assertPrivateWrites();
  const source = envSource();
  assert.ok(source);
  const childEnv = { ...fakeProcess.env, ...env };
  assert.deepEqual(projectEnv(source, childEnv), JSON.parse(JSON.stringify(env)));
  assert.equal(projectEnv(source, childEnv).UNRELATED_OS_KEY, undefined);
  assert.equal(projectEnv(source, childEnv).OMITTED, undefined);
  assert.equal(
    projectEnv(source, { ...childEnv, PRIVATE_SETTING: 'runtime-value' }).PRIVATE_SETTING,
    'runtime-value',
  );
  assert.equal(
    projectEnv(source, { ...childEnv, PRIVATE_SETTING: undefined }).PRIVATE_SETTING,
    undefined,
  );
  assert.equal(projectEnv(source, childEnv)[escapedKey], `${secret}-escaped`);
  reset();
  failTemplate = true;
  await assert.rejects(generateVonaMeta(meta, options), /Synthetic template failure/);
  assertPrivateWrites();
  assert.ok(envSource(), 'failed generation retains a value-free env entry');
});

async function waitForSpawn() {
  let launch = spawned;
  while (!launch) {
    await nextTurn();
    launch = spawned;
  }
  return launch;
}

test('strict _dev hands resolved derived values to spawn and preserves inherited control keys', async () => {
  reset();
  const running = cli()._dev(project);
  const { executable, args, options: launch, child } = await waitForSpawn();
  assert.equal(executable, '/synthetic-node');
  assert.deepEqual(args, [
    `--import=./${generatedDir}/register.js`,
    `${generatedDir}/bootstrap.ts`,
  ]);
  assert.equal(launch.cwd, project);
  assert.equal(launch.stdio, 'inherit');
  assert.equal(launch.env.PRIVATE_SETTING, secret);
  assert.equal(launch.env.APP_NAME, `cabtest${runId}`);
  assert.equal(launch.env.SERVER_LISTEN_PORT, '43123');
  assert.equal(launch.env.SERVER_LISTEN_HOSTNAME, '127.0.0.1');
  assert.equal(launch.env.SERVER_SERVE_HOST, '127.0.0.1:43123');
  assert.equal(launch.env.SERVER_SERVE_PROTOCOL, 'http');
  assert.equal(launch.env.SERVER_WORKERS, '1');
  assert.equal(launch.env.META_MODE, 'test');
  for (const key of [
    'VONA_TEST_REQUIRE_FRESH_RESOURCES',
    'VONA_TEST_RUN_ID',
    'VONA_TEST_READY_FILE',
    'VONA_TEST_CLAIM_TOKEN',
  ]) {
    assert.equal(launch.env[key], fakeProcess.env[key]);
  }
  assert.deepEqual(
    projectEnv(envSource(), launch.env),
    JSON.parse(
      JSON.stringify({
        ...fixture.loadEnvs(),
        NODE_ENV: 'test',
        META_FLAVOR: 'normal',
        META_MODE: 'test',
        VONA_TEST_RUN_ID: runId,
        APP_NAME: `cabtest${runId}`,
        SERVER_LISTEN_PORT: '43123',
        SERVER_LISTEN_HOSTNAME: '127.0.0.1',
        SERVER_SERVE_PROTOCOL: 'http',
        SERVER_SERVE_HOST: '127.0.0.1:43123',
        SERVER_WORKERS: '1',
      }),
    ),
  );
  fakeProcess.emit('SIGINT');
  fakeProcess.emit('SIGTERM');
  assert.deepEqual(child.signals, ['SIGINT', 'SIGTERM']);
  child.emit('exit', 0, null);
  await running;
  assert.equal(fakeProcess.listenerCount('SIGINT'), 0);
  assert.equal(fakeProcess.listenerCount('SIGTERM'), 0);
  assert.deepEqual(removed, []);
  assertPrivateWrites();
});

test('test-mode nonzero exits, signals and spawn errors reject and remove forwarding listeners', async () => {
  for (const failure of ['code', 'signal', 'error']) {
    reset();
    const running = cli()._runTest(project, { PRIVATE_SETTING: secret });
    const rejected = assert.rejects(
      running,
      failure === 'code'
        ? /exited: 7/
        : failure === 'signal'
          ? /exited: SIGTERM/
          : /Synthetic spawn failure/,
    );
    if (failure === 'error') {
      spawned!.child.emit('error', new Error('Synthetic spawn failure'));
    } else {
      spawned!.child.emit(
        'exit',
        failure === 'code' ? 7 : null,
        failure === 'signal' ? 'SIGTERM' : null,
      );
    }
    await rejected;
    assert.equal(fakeProcess.listenerCount('SIGINT'), 0);
    assert.equal(fakeProcess.listenerCount('SIGTERM'), 0);
    assert.deepEqual(writes, []);
  }
  reset();
  await assert.rejects(cli()._runTest(project), /resolved environment handoff/);
  assert.equal(spawned, undefined);
});

test('ordinary test generation retains literal env and inherited spawn semantics', async () => {
  reset(false);
  const { env } = await generateVonaMeta(meta, { ...options, runtimeDir: '.vona' });
  assert.equal(
    envSource(),
    `export default ${JSON.stringify(env, null, 2)} as unknown as NodeJS.ProcessEnv;\n`,
  );
  assert.ok(envSource().includes(secret));
  assert.ok(!actions.includes('owner'));
  const running = cli()._dev(project);
  const launch = await waitForSpawn();
  assert.equal(Object.hasOwn(launch.options, 'env'), false);
  assert.equal(launch.args[1], '.vona/bootstrap.ts');
  launch.child.emit('exit', 0, null);
  await running;
  assert.deepEqual(removed, [path.join(project, '.vona')]);
});

test('ordinary nodemon restart/quit and crash lifecycle remains supervised in memory', async () => {
  for (const crash of [false, true]) {
    reset(false);
    const running = cli('dev')._run(project, {});
    assert.equal(nodemonOptions.stdout, undefined);
    assert.equal(nodemonOptions.stderr, undefined);
    if (crash) {
      const rejected = assert.rejects(running, /Development server crashed/);
      nodemon.emit('crash');
      nodemon.emit('crash');
      await rejected;
      assert.equal(resets, 1);
    } else {
      let settled = false;
      running.then(() => {
        settled = true;
      });
      nodemon.emit('start');
      nodemon.emit('exit');
      await nextTurn();
      assert.equal(settled, false);
      nodemon.emit('quit');
      await running;
      assert.equal(resets, 0);
    }
  }
});
