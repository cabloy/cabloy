import type { VonaApplication } from 'vona';

import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { registerHooks } from 'node:module';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { getRedisClientKeyPrefix } from '../src/lib/redis.ts';

// Only bypass bean registration; exercise the real service and prefix helpers
// with object mocks, without loading an app or connecting to Redis.
const serviceUrl = new URL('../src/service/redis.ts', import.meta.url).href;
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === serviceUrl && specifier === 'vona-module-a-bean') {
      return {
        url: 'data:text/javascript,export function Service() { return () => {}; }',
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});
const { ServiceRedis } = await import('../src/service/redis.ts');
hooks.deregister();

const runId = '20261014010203-a1b2c3d4';
const prefixedClients = ['default', 'cache', 'io', 'summer', 'model', 'worker', 'limiter'];
const clientNames = ['queue', 'broadcast', 'redlock', 'redlockPeer', ...prefixedClients];

type ClientConfig = {
  keyPrefix?: string | true;
  sentinels?: unknown[];
  nodes?: unknown[];
};

function createFixture(mode = 'dev', isolated = false) {
  const name = isolated ? `cabtest${runId}` : 'cleanup-app';
  const config = {
    meta: { mode },
    redis: {
      base: {} as { keyPrefix?: string },
      clients: Object.fromEntries(
        clientNames.map(clientName => [
          clientName,
          prefixedClients.includes(clientName) ? { keyPrefix: true } : {},
        ]),
      ) as Record<string, ClientConfig>,
    },
  };
  const calls: { clientName: string; command: string; keys: string[] }[] = [];
  const store = new Set<string>();
  const clients: Record<
    string,
    {
      options: { keyPrefix?: string };
      keys: (pattern: string) => Promise<string[]>;
      del: (keys: string[]) => Promise<number>;
    }
  > = {};
  const app = {
    name,
    meta: { env: { META_MODE: mode, VONA_TEST_RUN_ID: isolated ? runId : undefined } },
    config,
    bean: {
      redis: {
        get(clientName: string) {
          if (clientName === 'broadcast') {
            throw new Error('Cleanup must not access the subscribed broadcast client');
          }
          return clients[clientName];
        },
      },
    },
  } as unknown as VonaApplication;
  const prefix = (clientName: string) => getRedisClientKeyPrefix(clientName, app);
  for (const clientName of clientNames) {
    const keyPrefix = prefixedClients.includes(clientName) ? prefix(clientName) : undefined;
    const client = {
      options: { keyPrefix },
      async keys(pattern: string) {
        calls.push({ clientName, command: 'keys', keys: [pattern] });
        assert.equal(pattern.endsWith('*'), true);
        assert.equal(/[?[\]\\*]/.test(pattern.slice(0, -1)), false);
        return [...store].filter(key => key.startsWith(pattern.slice(0, -1)));
      },
      async del(keys: string[]) {
        calls.push({ clientName, command: 'del', keys });
        for (const key of keys) store.delete(`${client.options.keyPrefix ?? ''}${key}`);
        return keys.length;
      },
    };
    clients[clientName] = client;
  }
  const service = Object.create(ServiceRedis.prototype) as InstanceType<typeof ServiceRedis>;
  Object.defineProperty(service, 'app', { value: app });
  return { app, service, config, clients, store, calls, prefix };
}

function addOwnedKeys(fixture: ReturnType<typeof createFixture>) {
  for (const category of ['bull', 'redlock', ...prefixedClients]) {
    fixture.store.add(`${fixture.prefix(category)}record`);
  }
}

async function assertNoDeletion(
  fixture: ReturnType<typeof createFixture>,
  error: RegExp,
  noLookup = true,
) {
  const before = [...fixture.store];
  await assert.rejects(fixture.service.clearAllData(), error);
  assert.deepEqual([...fixture.store], before);
  assert.equal(
    fixture.calls.some(call => call.command === 'del'),
    false,
  );
  if (noLookup) assert.deepEqual(fixture.calls, []);
}

describe('Redis clearAllData ownership', () => {
  // resolveTestRunId defaults an undefined fixture ID to the process ID. Under
  // the isolated app runner, execute ordinary-app fixtures in their own pure
  // process rather than mutating the runner's process-global environment.
  if (process.env.VONA_TEST_RUN_ID !== undefined) {
    it('runs ordinary-app ownership cases without inheriting the isolated runner ID', async () => {
      const loader = import.meta.resolve('ts-node-maintained/esm');
      const projectRoot = new URL('../../../../../../', import.meta.url);
      const registerSource = `import { register } from 'node:module'; register(${JSON.stringify(loader)}, ${JSON.stringify(projectRoot.href)});`;
      const env = Object.fromEntries(Object.entries(process.env)) as NodeJS.ProcessEnv;
      delete env.VONA_TEST_RUN_ID;
      delete env.NODE_TEST_CONTEXT;
      env.TS_NODE_PROJECT = fileURLToPath(new URL('tsconfig.json', projectRoot));
      const { stdout } = await promisify(execFile)(
        process.execPath,
        [
          '--import',
          `data:text/javascript,${encodeURIComponent(registerSource)}`,
          '--test',
          '--test-reporter=tap',
          '--test-name-pattern=Redis clearAllData ownership',
          fileURLToPath(import.meta.url),
        ],
        { env, timeout: 30_000 },
      );
      assert.match(stdout, /# fail 0\b/);
      assert.match(stdout, /# pass 35\b/);
    });
    return;
  }

  for (const mode of ['dev', 'test', 'prod']) {
    it(`cleans every category without touching other apps or broadcast in ${mode}`, async () => {
      const fixture = createFixture(mode);
      addOwnedKeys(fixture);
      const preserved = [
        `${fixture.prefix('broadcast')}subscription`,
        'unprefixed-global-key',
        ...['bull', 'redlock', ...prefixedClients].flatMap(category => [
          `${category}_other-app${mode === 'prod' ? '' : '_local'}:record`,
          `${category}_cleanup-app-sibling${mode === 'prod' ? '' : '_local'}:record`,
          `${category}_cleanup-app${mode === 'prod' ? '_local' : ''}:record`,
        ]),
      ];
      for (const key of preserved) fixture.store.add(key);

      await fixture.service.clearAllData();

      assert.deepEqual([...fixture.store].toSorted(), preserved.toSorted());
      assert.deepEqual(
        fixture.calls.filter(call => call.command === 'keys').map(call => call.clientName),
        clientNames.filter(clientName => clientName !== 'broadcast'),
      );
      const firstDelete = fixture.calls.findIndex(call => call.command === 'del');
      assert.equal(firstDelete, clientNames.length - 1);
      for (const clientName of prefixedClients) {
        assert.deepEqual(
          fixture.calls.find(call => call.clientName === clientName && call.command === 'del')
            ?.keys,
          ['record'],
        );
      }
      assert.deepEqual(
        fixture.calls.find(call => call.clientName === 'queue' && call.command === 'del')?.keys,
        [`${fixture.prefix('bull')}record`],
      );
      assert.deepEqual(
        fixture.calls.find(call => call.clientName === 'redlock' && call.command === 'del')?.keys,
        [`${fixture.prefix('redlock')}record`],
      );
    });
  }

  it('allows only bounded custom nesting and strips the complete client prefix for DEL', async () => {
    const fixture = createFixture();
    const prefix = `${fixture.prefix('cache')}nested:deeper:`;
    fixture.config.redis.clients.cache.keyPrefix = prefix;
    fixture.clients.cache.options.keyPrefix = prefix;
    fixture.store.add(`${prefix}record`);
    fixture.store.add(`${fixture.prefix('cache')}outside-custom-namespace`);
    fixture.store.add(`${fixture.prefix('cache')}nested:deeper-sibling:record`);

    await fixture.service.clearAllData();

    assert.deepEqual(
      fixture.calls.filter(call => call.command === 'del'),
      [{ clientName: 'cache', command: 'del', keys: ['record'] }],
    );
    assert.deepEqual(
      [...fixture.store],
      [
        `${fixture.prefix('cache')}outside-custom-namespace`,
        `${fixture.prefix('cache')}nested:deeper-sibling:record`,
      ],
    );
  });

  it('does not DEL when all owned lookups are empty', async () => {
    const fixture = createFixture();
    fixture.store.add('cache_other-app_local:record');
    await fixture.service.clearAllData();
    assert.equal(
      fixture.calls.some(call => call.command === 'del'),
      false,
    );
    assert.deepEqual([...fixture.store], ['cache_other-app_local:record']);
  });

  for (const keyPrefix of [
    undefined,
    '',
    '*',
    'undefined',
    'worker_other-app_local:',
    'worker_cleanup-app_local',
    'worker_cleanup-app_local-sibling:',
    'worker_cleanup-app_local:unbounded',
    'worker_cleanup-app_local:*:',
    'worker_cleanup-app_local:?:',
    'worker_cleanup-app_local:[ab]:',
    'worker_cleanup-app_local:back\\slash:',
    'worker_cleanup-app_local:\n:',
  ]) {
    it(`rejects unsafe later configured prefixes before any lookup (${JSON.stringify(keyPrefix)})`, async () => {
      const fixture = createFixture();
      addOwnedKeys(fixture);
      fixture.config.redis.clients.worker.keyPrefix = keyPrefix;
      fixture.clients.worker.options.keyPrefix = keyPrefix;
      await assertNoDeletion(fixture, /prefix does not belong to this app/);
    });
  }

  for (const keyPrefix of [
    undefined,
    '',
    'worker_other-app_local:',
    'worker_cleanup-app_local:nested:',
  ]) {
    it(`rejects config/actual-client prefix drift before any lookup (${JSON.stringify(keyPrefix)})`, async () => {
      const fixture = createFixture();
      addOwnedKeys(fixture);
      fixture.clients.worker.options.keyPrefix = keyPrefix;
      await assertNoDeletion(fixture, /unexpected client prefix/);
    });
  }

  it('rejects a configured custom prefix when the actual client still uses the framework prefix', async () => {
    const fixture = createFixture();
    addOwnedKeys(fixture);
    fixture.config.redis.clients.worker.keyPrefix = `${fixture.prefix('worker')}nested:`;
    await assertNoDeletion(fixture, /unexpected client prefix/);
  });

  for (const clientName of ['queue', 'redlock', 'redlockPeer']) {
    it(`rejects prefixed special client configuration for ${clientName}`, async () => {
      const fixture = createFixture();
      addOwnedKeys(fixture);
      fixture.config.redis.clients[clientName].keyPrefix = true;
      await assertNoDeletion(fixture, /requires an unprefixed client/);
    });

    it(`rejects an unexpected actual keyPrefix for ${clientName}`, async () => {
      const fixture = createFixture();
      addOwnedKeys(fixture);
      fixture.clients[clientName].options.keyPrefix = 'foreign:';
      await assertNoDeletion(fixture, /unexpected client prefix/);
    });
  }

  it('rejects an unavailable later client without deleting already prepared categories', async () => {
    const fixture = createFixture();
    addOwnedKeys(fixture);
    delete fixture.clients.worker;
    await assertNoDeletion(fixture, /client is unavailable/);
  });

  for (const clientName of ['queue', 'redlockPeer', 'worker']) {
    it(`validates all fetched full keys before DEL when ${clientName} returns a foreign key`, async () => {
      const fixture = createFixture();
      addOwnedKeys(fixture);
      const originalKeys = fixture.clients[clientName].keys;
      fixture.clients[clientName].keys = async pattern => [
        ...(await originalKeys(pattern)),
        'worker_other-app_local:record',
      ];
      await assertNoDeletion(fixture, /key outside the owned prefix/, false);
    });
  }

  it('does not delete earlier fetched keys when a later lookup fails', async () => {
    const fixture = createFixture();
    addOwnedKeys(fixture);
    fixture.clients.worker.keys = async () => {
      throw new Error('mock lookup failure');
    };
    await assertNoDeletion(fixture, /mock lookup failure/, false);
  });

  it('rejects unsafe app identities before looking up any keys', async () => {
    const fixture = createFixture();
    Object.defineProperty(fixture.app, 'name', { value: 'cleanup*app' });
    await assertNoDeletion(fixture, /prefix does not belong to this app/);
  });
});

describe('isolated Redis cleanup', () => {
  it('cleans the full run namespace while preserving sibling runs', async () => {
    const fixture = createFixture('test', true);
    addOwnedKeys(fixture);
    const sibling = 'bull_cabtest20261014010203-d4e5f6a7_local:record';
    fixture.store.add(sibling);
    await fixture.service.clearAllData();
    assert.deepEqual([...fixture.store], [sibling]);
  });

  it('rejects a run/app identity mismatch before cleanup', async () => {
    const fixture = createFixture('test', true);
    addOwnedKeys(fixture);
    Object.defineProperty(fixture.app, 'name', { value: 'cleanup-app' });
    await assertNoDeletion(fixture, /APP_NAME does not match its run ID/);
  });

  it('keeps the strict framework-managed prefix requirement even for bounded custom nesting', async () => {
    const fixture = createFixture('test', true);
    addOwnedKeys(fixture);
    const prefix = `${fixture.prefix('worker')}nested:`;
    fixture.config.redis.clients.worker.keyPrefix = prefix;
    fixture.clients.worker.options.keyPrefix = prefix;
    await assertNoDeletion(fixture, /requires a framework-managed Redis prefix/);
  });

  it('rejects inherited base prefixes before cleanup', async () => {
    const fixture = createFixture('test', true);
    addOwnedKeys(fixture);
    fixture.config.redis.base.keyPrefix = 'foreign:';
    await assertNoDeletion(fixture, /cannot inherit a Redis base keyPrefix/);
  });

  for (const clientName of ['queue', 'redlockPeer']) {
    it(`retains the isolated undefined configured prefix rule for ${clientName}`, async () => {
      const fixture = createFixture('test', true);
      addOwnedKeys(fixture);
      fixture.config.redis.clients[clientName].keyPrefix = '';
      await assertNoDeletion(fixture, /requires a framework-managed Redis prefix/);
    });
  }

  for (const property of ['sentinels', 'nodes'] as const) {
    it(`rejects isolated ${property} clients before cleanup`, async () => {
      const fixture = createFixture('test', true);
      addOwnedKeys(fixture);
      fixture.config.redis.clients.worker[property] = [];
      await assertNoDeletion(fixture, /cannot use a Redis sentinel or cluster client/);
    });
  }
});
