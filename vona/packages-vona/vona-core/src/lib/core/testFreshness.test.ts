import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import type { VonaApplication } from './application.ts';
import type { TestFreshnessDependencies } from './testFreshness.ts';

import { buildTestClaimResourceInventory } from './testClaim.ts';
import {
  assertFreshTestResources,
  assertFreshTestResourcesReady,
  createFreshnessDependencies,
  hasFreshnessDatabase,
  hasFreshnessRedis,
  requiresFreshTestResources,
  TEST_REQUIRE_FRESH_RESOURCES_ENV,
} from './testFreshness.ts';
import { resolveVonaLocalPaths } from './testIsolation.ts';

function fixture() {
  const root = mkdtempSync(path.join(realpathSync(tmpdir()), 'vona-freshness-'));
  const runId = '20261019010203-a1b2c3d4';
  const projectPath = path.join(root, 'vona');
  const paths = resolveVonaLocalPaths(projectPath, 'test', runId);
  for (const directory of [paths.dataRoot, paths.generatedRoot]) {
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, '.vona-test-owner'), `${runId}\n`);
  }
  const fixtureApp = {
    projectPath,
    name: `cabtest${runId}`,
    meta: { env: { META_MODE: 'test', VONA_TEST_RUN_ID: runId, SERVER_LISTEN_PORT: '41234' } },
    config: {
      server: {
        publicDir: paths.publicRoot,
        workers: 1,
        listen: { hostname: '127.0.0.1', port: 41234 },
        serve: { protocol: 'http', host: '127.0.0.1:41234' },
      },
      logger: { baseDir: paths.logsRoot },
      database: {
        testDatabase: true,
        base: {},
        defaultClient: 'main',
        clients: {
          main: {
            client: 'pg',
            connection: { host: '127.0.0.1', port: 5432, database: 'postgres', user: 'synthetic' },
          },
          isolated: {
            client: 'pg',
            connection: { host: '127.0.0.1', port: 5433, database: 'postgres', user: 'synthetic' },
          },
        },
      },
      instance: { instances: { isolated: { id: 2, isolate: true, isolateClient: 'isolated' } } },
      redis: {
        base: {},
        clients: {
          worker: { keyPrefix: true },
          queue: {},
          broadcast: {},
          redlock: {},
          redlock2: { db: 2 },
        },
      },
    },
  };
  const app = fixtureApp as unknown as VonaApplication & { config: typeof fixtureApp.config };
  const events: string[] = [];
  const readers: TestFreshnessDependencies = {
    databaseExists: async plan => {
      events.push(`db:${plan.scope}`);
      return false;
    },
    redisExists: async resource => {
      events.push(`redis:${resource.clientName}`);
      return false;
    },
  };
  return { root, paths, app, readers, events };
}

async function strict(fn: () => Promise<void>) {
  const previous = process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
  process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'true';
  try {
    await fn();
  } finally {
    if (previous === undefined) delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
    else process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = previous;
  }
}

test(
  'strict freshness covers all targets before marking proof, without writes or resource identifiers',
  { concurrency: false },
  async () => {
    await strict(async () => {
      const f = fixture();
      try {
        assert.throws(() => assertFreshTestResourcesReady(f.app), /not established/);
        mkdirSync(f.paths.publicRoot); // Config may already have created this empty directory.
        await assertFreshTestResources(f.app, f.readers);
        assert.deepEqual(f.events, [
          'db:share',
          'db:isolate-isolated',
          'redis:worker',
          'redis:queue',
          'redis:redlock',
          'redis:redlock2',
        ]);
        assert.doesNotThrow(() => assertFreshTestResourcesReady(f.app));
        await assert.rejects(assertFreshTestResources(f.app, f.readers), /new isolated startup/);
      } finally {
        rmSync(f.root, { recursive: true, force: true });
      }
    });
  },
);

test(
  'strict freshness rejects a later isolate conflict or Redis residue without admitting startup',
  { concurrency: false },
  async () => {
    await strict(async () => {
      for (const conflict of ['db:isolate-isolated', 'redis:redlock2', 'read-error']) {
        const f = fixture();
        try {
          f.readers.databaseExists = async plan => {
            f.events.push(`db:${plan.scope}`);
            if (conflict === 'read-error') throw new Error('synthetic-protected-driver-secret');
            return conflict === `db:${plan.scope}`;
          };
          f.readers.redisExists = async resource => {
            f.events.push(`redis:${resource.clientName}`);
            return conflict === `redis:${resource.clientName}`;
          };
          await assert.rejects(assertFreshTestResources(f.app, f.readers), error => {
            assert.equal((error as Error).message, 'Strict test resource freshness check failed');
            assert.equal((error as Error).cause, undefined);
            return true;
          });
          assert.throws(() => assertFreshTestResourcesReady(f.app), /not established/);
          if (conflict.startsWith('db:')) {
            assert.equal(
              f.events.some(value => value.startsWith('redis:')),
              false,
            );
          }
        } finally {
          rmSync(f.root, { recursive: true, force: true });
        }
      }
    });
  },
);

test(
  'strict freshness rejects local residue, symlinks and preselected database targets before driver reads',
  { concurrency: false },
  async () => {
    await strict(async () => {
      for (const kind of ['public', 'runtime', 'sqlite', 'symlink', 'selected', 'unisolated']) {
        const f = fixture();
        try {
          if (kind === 'selected') {
            f.app.config.database.clients.main.connection.database = 'vona-test-preselected';
          } else if (kind === 'unisolated') {
            f.app.meta.env.VONA_TEST_RUN_ID = undefined;
          } else if (kind === 'symlink') {
            symlinkSync(f.paths.generatedRoot, f.paths.publicRoot);
          } else {
            const directory =
              kind === 'public'
                ? f.paths.publicRoot
                : kind === 'runtime'
                  ? f.paths.runtimeRoot
                  : f.paths.sqliteRoot;
            mkdirSync(directory);
            writeFileSync(path.join(directory, 'synthetic-residue'), 'keep');
          }
          await assert.rejects(assertFreshTestResources(f.app, f.readers));
          assert.deepEqual(f.events, []);
        } finally {
          rmSync(f.root, { recursive: true, force: true });
        }
      }
    });
  },
);

test(
  'freshness is explicit and default lanes never invoke readers',
  { concurrency: false },
  async () => {
    const previous = process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
    try {
      delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
      const app = {} as VonaApplication;
      assert.equal(requiresFreshTestResources(), false);
      await assertFreshTestResources(app, {
        databaseExists: async () => {
          throw new Error('must not read');
        },
        redisExists: async () => {
          throw new Error('must not read');
        },
      });
      assert.doesNotThrow(() => assertFreshTestResourcesReady(app));
      process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = 'false';
      assert.throws(() => requiresFreshTestResources(), /Invalid strict/);
    } finally {
      if (previous === undefined) delete process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
      else process.env[TEST_REQUIRE_FRESH_RESOURCES_ENV] = previous;
    }
  },
);

test('read-only database inspection uses exact prefix bindings and always disposes', async () => {
  const f = fixture();
  try {
    const plan = buildTestClaimResourceInventory(f.app).databases[0];
    for (const dialect of ['pg', 'mysql', 'mysql2'] as const) {
      for (const found of [false, true]) {
        let closed = 0;
        const result = await hasFreshnessDatabase(
          {
            raw: async (sql, bindings) => {
              assert.match(sql, /^select .* limit 1$/);
              assert.deepEqual(bindings, [plan.prefix.length, plan.prefix]);
              const rows = found ? [{}] : [];
              return dialect === 'pg' ? { rows } : [rows];
            },
            destroy: async () => {
              closed++;
            },
          },
          { ...plan, endpoint: { ...plan.endpoint, dialect } },
        );
        assert.equal(result, found);
        assert.equal(closed, 1);
      }
    }
    let closed = 0;
    await assert.rejects(
      hasFreshnessDatabase(
        {
          raw: async () => ({}),
          destroy: async () => {
            closed++;
          },
        },
        plan,
      ),
      /Invalid freshness database response/,
    );
    assert.equal(closed, 1);
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});

test('Redis freshness requires a completed cursor scan and rejects foreign/malformed/limited responses', async () => {
  const prefix = 'synthetic_[*]?:';
  const cursors: string[] = [];
  assert.equal(
    await hasFreshnessRedis(
      {
        scan: async (cursor, _match, pattern) => {
          cursors.push(cursor);
          assert.equal(pattern, 'synthetic_\\[\\*\\]\\?:*');
          return [cursor === '0' ? '7' : '0', []];
        },
      },
      prefix,
    ),
    false,
  );
  assert.deepEqual(cursors, ['0', '7']);
  assert.equal(
    await hasFreshnessRedis({ scan: async () => ['1', [`${prefix}key`]] }, prefix),
    true,
  );
  for (const response of [undefined, ['bad', []], ['0', ['foreign']], ['0', [1]], ['0']]) {
    await assert.rejects(
      hasFreshnessRedis({ scan: async () => response }, prefix),
      /Invalid Redis/,
    );
  }
  await assert.rejects(
    hasFreshnessRedis({ scan: async () => ['1', []] }, prefix, 2),
    /limit exceeded/,
  );
  const failure = new Error('synthetic-ACL-error');
  await assert.rejects(
    hasFreshnessRedis(
      {
        scan: async () => {
          throw failure;
        },
      },
      prefix,
    ),
    value => value === failure,
  );
});

test('direct readers project connection options, widen queue scan and dispose on failure', async () => {
  const f = fixture();
  try {
    const inventory = buildTestClaimResourceInventory(f.app);
    const plan = inventory.databases[0];
    const resource = inventory.redis.find(item => item.clientName === 'queue')!;
    let sqlClosed = 0;
    let redisClosed = 0;
    let fail = false;
    const readers = createFreshnessDependencies(f.app.projectPath, name => {
      if (name === 'knex') {
        return (options: any) => {
          assert.equal(options.connection.database, 'postgres');
          assert.equal(options.connection.user, 'synthetic');
          assert.equal(options.connection.password, 'synthetic-password');
          assert.equal(options.connection.beforeConnect, undefined);
          assert.equal(options.pool.afterCreate, undefined);
          return {
            raw: async () => ({ rows: [] }),
            destroy: async () => {
              sqlClosed++;
            },
          };
        };
      }
      assert.equal(name, 'ioredis');
      return {
        Redis: class {
          constructor(options: any) {
            assert.equal(options.db, 0);
            assert.equal(options.keyPrefix, undefined);
            assert.equal(options.enableOfflineQueue, false);
            assert.equal(options.retryStrategy(), null);
            assert.equal(options.maxRetriesPerRequest, 0);
          }

          on() {}

          async connect() {
            if (fail) throw new Error('synthetic-driver-error');
          }

          async scan(_cursor: string, _match: string, pattern: string) {
            assert.equal(pattern, `${resource.prefix.slice(0, -'queue:'.length)}*`);
            return ['0', []];
          }

          disconnect() {
            redisClosed++;
          }
        },
      };
    });
    assert.equal(
      await readers.databaseExists(plan, {
        connection: { user: 'synthetic', password: 'synthetic-password', beforeConnect() {} },
        pool: { afterCreate() {} },
      }),
      false,
    );
    assert.equal(sqlClosed, 1);
    assert.equal(await readers.redisExists(resource, {}), false);
    fail = true;
    await assert.rejects(readers.redisExists(resource, {}), /synthetic-driver-error/);
    assert.equal(redisClosed, 2);
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});
