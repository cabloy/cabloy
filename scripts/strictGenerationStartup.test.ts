import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { after, test } from 'node:test';
import ts from 'typescript';

const root = new URL('../vona/src/suite-vendor/a-vona/modules/', import.meta.url);
const databaseUrl = new URL('a-version/src/service/database.ts', root).href;
const startupUrl = new URL('a-startup/src/service/startup.ts', root).href;
const helperUrl = new URL('a-version/src/lib/databaseTestName.ts', root).href;
const isolationUrl = new URL(
  '../vona/packages-vona/vona-core/src/lib/core/testIsolation.ts',
  import.meta.url,
).href;
let strict = true;
let ready = true;
const mocks = {
  'vona': `
    export class BeanBase {}
    export function assertFreshTestResourcesReady() { globalThis.__strictGenerationTest.ready(); }
    export function requiresFreshTestResources() { return globalThis.__strictGenerationTest.strict(); }
    export function assertIsolatedTestConfig() {}
    export function assertIsolatedTestPath() {}
    export function assertTestRunOwner() {}
    export function resolveVonaLocalPaths() { return { dataRoot: '/synthetic' }; }
    export async function withIsolatedTestDatabaseDiscovery(_app, _name, _client, fn) { return await fn(); }
    export function cast(value) { return value; }
    export function getRuntimePathPhysicalRoot() { throw new Error('must not get mutating runtime path'); }
    export { createDatabaseTestName, getDatabaseTestPrefix } from ${JSON.stringify(helperUrl)};
    export { assertDisposableDatabaseName } from ${JSON.stringify(isolationUrl)};
  `,
  'vona-module-a-bean': 'export function Service() { return value => value; }',
  'fs-extra':
    'export default { async remove() { throw new Error("must not remove directory"); } };',
};

// Execute the real service bodies; replace only framework collaborators. No app or drivers.
const previous = Object.getOwnPropertyDescriptor(globalThis, '__strictGenerationTest');
Object.defineProperty(globalThis, '__strictGenerationTest', {
  configurable: true,
  value: {
    strict: () => strict,
    ready: () => {
      if (!ready) throw new Error('freshness missing');
    },
  },
});
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if ([databaseUrl, startupUrl].includes(context.parentURL ?? '') && mocks[specifier]) {
      return {
        url: `data:text/javascript,${encodeURIComponent(mocks[specifier])}`,
        shortCircuit: true,
      };
    }
    if (context.parentURL === helperUrl && specifier === 'vona') {
      return { url: isolationUrl, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if ([databaseUrl, startupUrl].includes(url)) {
      const source = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
        compilerOptions: {
          experimentalDecorators: true,
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
        },
      }).outputText;
      return { format: 'module', source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
let ServiceDatabase: any;
let ServiceStartup: any;
try {
  ({ ServiceDatabase } = await import(databaseUrl));
  ({ ServiceStartup } = await import(startupUrl));
} finally {
  hooks.deregister();
}

function databaseFixture(existing: string[] = []) {
  let current = 'postgres';
  const calls: string[] = [];
  const app = { name: 'synthetic', meta: { isTest: true, isDev: false, isProd: false, env: {} } };
  const client = {
    clientName: 'main',
    db: { dialectName: 'pg' },
    getDatabaseName: () => current,
    connection: {
      schema: {
        fetchDatabases: async () => {
          calls.push('discover');
          return existing.map(name => ({ name }));
        },
        createDatabase: async (name: string) => {
          calls.push('create');
          existing.push(name);
          return name;
        },
        dropDatabase: async () => {
          throw new Error('must not drop');
        },
      },
    },
    changeConfigConnectionAndReloadWorker: async (name: string) => {
      calls.push('reload');
      current = name;
    },
  };
  const service = Object.create(ServiceDatabase.prototype);
  Object.defineProperties(service, {
    app: { value: app },
    bean: { value: { database: { current: { client } } } },
    $logger: { value: { silly() {} } },
  });
  return {
    service,
    calls,
    setCurrent: (name: string) => {
      current = name;
    },
  };
}

// This file owns the collaborator sentinel for its entire isolated node:test process.
// Restore it after every test has settled, including assertions that fail.
after(() => {
  if (previous) Object.defineProperty(globalThis, '__strictGenerationTest', previous);
  else Reflect.deleteProperty(globalThis, '__strictGenerationTest');
});

test('strict database startup refuses preexisting matches and unowned selected targets without deletion', async () => {
  strict = true;
  ready = true;
  const f = databaseFixture(['vona-test-synthetic-s-20261019-010203']);
  await assert.rejects(f.service.__prepareDatabaseInner(), /no longer fresh/);
  assert.deepEqual(f.calls, ['discover']);
  f.setCurrent('vona-test-synthetic-s-20261019-010203');
  await assert.rejects(f.service.__prepareDatabaseInner(), /unowned database/);
  assert.deepEqual(f.calls, ['discover']);
});

test('strict database startup creates once and reuses only its successful own creation', async () => {
  strict = true;
  ready = true;
  const f = databaseFixture();
  await f.service.__prepareDatabaseInner();
  await f.service.__prepareDatabaseInner();
  assert.deepEqual(f.calls, ['discover', 'create', 'reload']);
  f.setCurrent('vona-test-synthetic-s-20261019-010203');
  await assert.rejects(f.service.__prepareDatabaseInner(), /unowned database/);
  ready = false;
  await assert.rejects(f.service.__prepareDatabaseInner(), /freshness missing/);
  ready = true;
});

test('strict startup bypasses clearing only with established proof and does not bypass later startups', async () => {
  strict = true;
  ready = true;
  const calls: string[] = [];
  const service = Object.create(ServiceStartup.prototype);
  Object.defineProperties(service, {
    app: { value: { meta: { isTest: true, isDev: false, env: {} } } },
    $scope: {
      value: {
        redis: {
          service: {
            redis: {
              clearAllData: async () => {
                throw new Error('must not clear Redis');
              },
            },
          },
        },
      },
    },
    bean: {
      value: {
        onion: {
          startup: {
            getOnionsEnabledCached: () => [{ name: 'synthetic', beanOptions: { options: {} } }],
          },
        },
      },
    },
    runStartup: {
      value: async () => {
        calls.push('startup');
      },
    },
  });
  await service.appStart();
  assert.deepEqual(calls, ['startup']);
  ready = false;
  await assert.rejects(service.appStart(), /freshness missing/);
  assert.deepEqual(calls, ['startup']);
  ready = true;
});

test('ordinary test database selected-target behavior remains unchanged without strict flag', async () => {
  strict = false;
  ready = false;
  const f = databaseFixture();
  f.setCurrent('vona-test-synthetic-s-20261019-010203');
  await f.service.__prepareDatabaseInner();
  assert.deepEqual(f.calls, []);
  strict = true;
  ready = true;
});
