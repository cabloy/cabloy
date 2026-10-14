import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ServiceDatabase } from '../src/service/database.ts';

const databaseName = 'vona-test-preparation-s-20261014-120000';
const isolateName = 'vona-test-preparation-i-isolateTest-20261014-120000';

function fixture(existing: string[] = [], isolate?: string[]) {
  const calls: string[] = [];
  const app = {
    name: 'preparation',
    meta: { isDev: true, isTest: false, env: { META_MODE: 'dev' } },
    config: {
      database: { testDatabase: true, defaultClient: 'main', clients: { main: {}, isolated: {} } },
      instance: {
        instances: isolate
          ? { isolateTest: { id: 2, isolate: true, isolateClient: 'isolated' } }
          : {},
      },
    },
  };
  const names = { main: existing, isolated: isolate ?? [] };
  const clients = Object.fromEntries(
    Object.entries(names).map(([key, databases]) => [
      key,
      {
        db: { dialectName: 'pg' },
        getDatabaseName: (): string => 'postgres',
        connection: {
          schema: {
            fetchDatabases: async () => databases.map(name => ({ name })),
            dropDatabase: async (name: string) => {
              calls.push(`drop:${name}`);
              databases.splice(databases.indexOf(name), 1);
            },
            createDatabase: async (name: string) => {
              calls.push(`create:${key}`);
              databases.push(name);
              return name;
            },
          },
        },
        changeConfigConnectionAndReloadWorker: async (name: string) => calls.push(`reload:${name}`),
      },
    ]),
  );
  const database = {
    current: { client: clients.main },
    switchDb: async (fn: () => Promise<unknown>, clientName: string) => {
      const previous = database.current;
      database.current = { client: clients[clientName === 'default' ? 'main' : clientName] };
      try {
        return await fn();
      } finally {
        database.current = previous;
      }
    },
  };
  const service = Object.create(ServiceDatabase.prototype) as ServiceDatabase;
  Object.defineProperties(service, {
    app: { value: app },
    bean: { value: { database, worker: { setAlive: async () => calls.push('alive') } } },
    $scope: {
      value: {
        orm: {
          service: {
            database: {
              prepareClientNameReal: (name: string) => (name === 'default' ? 'main' : name),
            },
          },
        },
        redis: { service: { redis: { clearAllData: async () => calls.push('clear') } } },
        version: { service: { version: { __start: async () => calls.push('migrate') } } },
      },
    },
    scope: { value: { service: { version: { __start: async () => calls.push('migrate') } } } },
    $logger: { value: { silly() {} } },
  });
  return { service, app, calls, clients };
}

describe('dev database preparation', { concurrency: false }, () => {
  it('clears all resources before reset creation and records only actual creations', async () => {
    const { service, calls } = fixture();
    await service.prepareDevDatabases(true);
    assert.deepEqual(calls.slice(0, 3), ['clear', 'alive', 'create:main']);
    assert.deepEqual(service.createdInstanceNames, ['']);
    await service.prepareDevDatabases();
    await service.databaseInitStartup();
    assert.equal(calls.filter(call => call === 'clear').length, 1);
    assert.equal(calls.filter(call => call === 'create:main').length, 1);
    assert.equal(calls.at(-1), 'migrate');
    service.consumeCreatedInstance('');
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('reuses an existing database without clearing or requesting seeds', async () => {
    const { service, calls } = fixture([databaseName]);
    await service.prepareDevDatabases();
    assert.deepEqual(calls, [`reload:${databaseName}`]);
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('rejects a missing isolate before reloading or changing the existing shared database', async () => {
    const { service, calls } = fixture([databaseName], []);
    await assert.rejects(service.prepareDevDatabases(false), /isolateTest.*npm run db:reset/);
    assert.deepEqual(calls, []);
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('rejects a missing shared database without any preparation side effects', async () => {
    const { service, calls } = fixture();
    await assert.rejects(service.prepareDevDatabases(false), /default.*npm run db:reset/);
    assert.deepEqual(calls, []);
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('prints a prominent reset command and destructive-data warning before rejecting', async t => {
    const { service, calls } = fixture();
    const output: string[] = [];
    t.mock.method(console, 'error', (message: string) => output.push(message));
    await assert.rejects(service.prepareDevDatabases(false), /default.*npm run db:reset/);
    assert.equal(output.length, 1);
    assert.match(output[0], /DEVELOPMENT DATABASE MISSING/);
    assert.match(output[0], /Instance: default/);
    assert.match(output[0], /npm run db:reset/);
    assert.match(output[0], /deletes managed development data/);
    assert.match(output[0], /Stop processes using the same database and Redis namespace first/);
    assert.deepEqual(calls, []);
  });

  it('rejects missing targets through legacy startup entrypoints before migration', async () => {
    for (const versionStart of [false, true]) {
      const { service, calls } = fixture();
      await assert.rejects(
        service.prepareDatabase('main' as never, versionStart),
        /npm run db:reset/,
      );
      assert.deepEqual(calls, []);
    }
  });

  it('preflights every target before any deletion', async () => {
    const { service, calls } = fixture([databaseName], ['unowned-database']);
    await assert.rejects(service.prepareDevDatabases());
    assert.deepEqual(calls, []);
  });

  it('stops if full resource cleanup fails', async () => {
    const { service, calls } = fixture();
    (service as any).$scope.redis.service.redis.clearAllData = async () => {
      throw new Error('cleanup failed');
    };
    await assert.rejects(service.prepareDevDatabases(true), /cleanup failed/);
    assert.deepEqual(calls, []);
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('clears once and recreates all reset targets before migration', async () => {
    const { service, calls } = fixture([databaseName], [isolateName]);
    await service.prepareDevDatabases(true);
    assert.equal(calls.filter(call => call === 'clear').length, 1);
    assert.ok(calls.indexOf('clear') < calls.indexOf(`drop:${databaseName}`));
    assert.ok(calls.includes(`drop:${isolateName}`));
    assert.deepEqual(service.createdInstanceNames, ['', 'isolateTest']);
    await service.databaseInitStartup();
    assert.equal(calls.filter(call => call.startsWith('drop:')).length, 2);
    assert.equal(calls.filter(call => call.startsWith('create:')).length, 2);
    assert.equal(calls.filter(call => call === 'migrate').length, 2);
  });

  it('rejects non-disposable reset without clearing anything', async () => {
    const { service, app, calls } = fixture([databaseName]);
    app.config.database.testDatabase = false;
    await assert.rejects(service.prepareDevDatabases(true), /testDatabase=true/);
    assert.deepEqual(calls, []);
    await service.prepareDevDatabases(false);
    assert.deepEqual(calls, []);
  });

  it('refuses to reset through a connection inside the target namespace', async () => {
    const { service, clients, calls } = fixture([databaseName]);
    clients.main.getDatabaseName = () => databaseName;
    await assert.rejects(service.prepareDevDatabases(true), /connection outside/);
    assert.deepEqual(calls, []);
  });

  it('checks actual existence even if the configured name belongs to the managed namespace', async () => {
    const { service, clients, calls } = fixture();
    clients.main.getDatabaseName = () => databaseName;
    await assert.rejects(service.prepareDevDatabases(false), /npm run db:reset/);
    assert.deepEqual(calls, []);
  });

  it('propagates discovery failures without treating them as missing databases', async () => {
    const { service, clients, calls } = fixture([databaseName]);
    clients.main.connection.schema.fetchDatabases = async () => {
      throw new Error('discovery failed');
    };
    await assert.rejects(service.prepareDevDatabases(false), /discovery failed/);
    assert.deepEqual(calls, []);
  });

  it('propagates reset creation failure without migrating or requesting seeds', async () => {
    const { service, clients, calls } = fixture([databaseName]);
    clients.main.connection.schema.createDatabase = async () => {
      throw new Error('creation failed');
    };
    await assert.rejects(service.prepareDevDatabases(true), /creation failed/);
    assert.deepEqual(calls, ['clear', 'alive', `drop:${databaseName}`]);
    assert.deepEqual(service.createdInstanceNames, []);
  });

  it('preserves both existing targets on reuse', async () => {
    const { service, calls } = fixture([databaseName], [isolateName]);
    await service.prepareDevDatabases();
    assert.deepEqual(calls, [`reload:${databaseName}`, `reload:${isolateName}`]);
    assert.deepEqual(service.createdInstanceNames, []);
  });
});
