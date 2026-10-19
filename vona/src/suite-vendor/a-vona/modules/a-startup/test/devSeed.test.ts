import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { ServiceInstance } from '../../a-instance/src/service/instance.ts';
import { ServiceStartup } from '../src/service/startup.ts';

function fixture(created: string[] = []) {
  const calls: string[] = [];
  const optionsSeen: { name: string; instance: string | null; force?: boolean }[] = [];
  const pending = new Set(created);
  const app = {
    meta: {
      isDev: true,
      isTest: false,
      appReady: true,
      appReadyInstances: {} as Record<string, boolean>,
      env: {},
    },
    config: { server: { listen: { disable: false } } },
  };
  const service = Object.create(ServiceStartup.prototype) as ServiceStartup;
  const startups = [
    { name: 'a-version:databaseInit', beanOptions: { options: {} } },
    { name: 'a-version:databaseName', beanOptions: { options: {} } },
    { name: 'a-version:instanceInit', beanOptions: { options: { instance: true } } },
    { name: 'a-schedule:loadSchedules', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-runtime:runtime', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-printtip:printTip', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-queue:loadQueueWorkers', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-web:listen', beanOptions: { options: { after: true } } },
  ];
  function instanceService(instanceName: string) {
    const instance = Object.create(ServiceInstance.prototype) as ServiceInstance;
    Object.defineProperties(instance, {
      app: { value: app },
      ctx: { value: { app, instanceName } },
      $scope: { value: { startup: { service: { startup: service } } } },
      getConfigInstanceBase: { value: () => ({}) },
      _cacheInstanceConfig: { value: async () => {} },
    });
    return instance;
  }
  Object.defineProperties(service, {
    app: { value: app },
    _startups: { value: startups },
    bean: { value: { executor: { newCtx: async (fn: () => Promise<unknown>) => fn() } } },
    $scope: {
      value: {
        version: {
          service: {
            database: {
              prepareDevDatabases: async () => {
                calls.push('prepareDevDatabases');
              },
              get createdInstanceNames() {
                return [...pending];
              },
              consumeCreatedInstance: (name: string) => pending.delete(name),
            },
            version: {
              __instanceSeed: async (name: string) => {
                calls.push(`seed:${name}`);
              },
            },
          },
        },
        instance: {
          service: {
            instance: {
              instanceStartupIsolate: async (name: string, options: any) =>
                instanceService(name).instanceStartup(name as never, options),
            },
          },
        },
      },
    },
  });
  service.runStartup = async (name, instance, options) => {
    calls.push(`${name}:${instance}`);
    optionsSeen.push({ name, instance: instance as string | null, force: options?.force });
    if (
      startups.find(startup => startup.name === name)?.beanOptions.options.after === true &&
      instance !== null
    ) {
      assert.equal(app.meta.appReadyInstances[instance as string], true);
    }
  };
  return { service, app, calls, pending, instanceService, optionsSeen, startups };
}

const defaultCalls = [
  'a-version:instanceInit:',
  'seed:',
  'a-schedule:loadSchedules:',
  'a-runtime:runtime:',
  'a-printtip:printTip:',
  'a-queue:loadQueueWorkers:',
];
const isolateCalls = [
  'a-version:instanceInit:isolateTest',
  'a-schedule:loadSchedules:isolateTest',
  'a-runtime:runtime:isolateTest',
  'a-printtip:printTip:isolateTest',
  'a-queue:loadQueueWorkers:isolateTest',
];

describe('creation-driven dev seed', { concurrency: false }, () => {
  let previousReset: string | undefined;
  beforeEach(() => {
    previousReset = process.env.VONA_DB_RESET;
    delete process.env.VONA_DB_RESET;
  });
  afterEach(() => {
    if (previousReset === undefined) delete process.env.VONA_DB_RESET;
    else process.env.VONA_DB_RESET = previousReset;
  });

  it('skips all after-startups during reset while completing data preparation', async () => {
    process.env.VONA_DB_RESET = 'true';
    const { service, app, calls, pending, optionsSeen, startups } = fixture(['', 'isolateTest']);
    startups.push(
      { name: 'test:prepareApp', beanOptions: { options: { after: false } } },
      { name: 'test:prepareInstance', beanOptions: { options: { instance: true, after: false } } },
      { name: 'test:afterApp', beanOptions: { options: { after: true } } },
      { name: 'test:afterInstance', beanOptions: { options: { instance: true, after: true } } },
    );
    await service.appStart();
    await service.appReady();
    assert.deepEqual(calls, [
      'prepareDevDatabases',
      'a-version:databaseInit:null',
      'a-version:databaseName:null',
      'test:prepareApp:null',
      'a-version:instanceInit:',
      'test:prepareInstance:',
      'seed:',
      'a-version:instanceInit:isolateTest',
      'test:prepareInstance:isolateTest',
    ]);
    assert.equal(app.config.server.listen.disable, true);
    assert.equal(pending.size, 0);
    assert.deepEqual(app.meta.appReadyInstances, { '': true, 'isolateTest': true });
    assert.equal(optionsSeen.find(call => call.name === 'a-version:databaseInit')?.force, true);
    assert.ok(
      optionsSeen.filter(call => call.instance !== null).every(call => call.force === true),
    );
  });

  it('retains after-startups when the reset flag is false', async () => {
    process.env.VONA_DB_RESET = 'false';
    const { service, calls } = fixture(['', 'isolateTest']);
    await service.appReady();
    assert.deepEqual(calls, [...defaultCalls, ...isolateCalls, 'a-web:listen:null']);
  });

  it('seeds only default and completes each instance before application after-startups', async () => {
    const { service, calls, pending, app, optionsSeen, instanceService } = fixture([
      '',
      'isolateTest',
    ]);
    await service.appReady();
    assert.equal(pending.size, 0);
    assert.deepEqual(calls, [...defaultCalls, ...isolateCalls, 'a-web:listen:null']);
    assert.equal(app.meta.appReadyInstances[''], true);
    assert.equal(app.meta.appReadyInstances.isolateTest, true);
    assert.ok(
      optionsSeen.filter(call => call.instance !== null).every(call => call.force === true),
    );
    await instanceService('').instanceStartup('' as never, { force: true });
    assert.equal(calls.filter(call => call === 'seed:').length, 1);
  });

  it('does not seed either instance when only an isolated database is new', async () => {
    const { service, calls, pending, app } = fixture(['isolateTest']);
    await service.appReady();
    assert.ok(!calls.some(call => call.startsWith('seed:')));
    assert.ok(calls.includes('a-version:instanceInit:isolateTest'));
    assert.equal(pending.size, 0);
    assert.equal(app.meta.appReadyInstances.isolateTest, true);
  });

  it('does not seed when all databases are reused', async () => {
    const { service, calls } = fixture();
    await service.appReady();
    assert.ok(!calls.some(call => call.startsWith('seed:')));
  });

  it('retains default-only test seeding through its existing lifecycle even with the reset flag', async () => {
    process.env.VONA_DB_RESET = 'true';
    const { service, app, calls } = fixture();
    app.meta.isDev = false;
    app.meta.isTest = true;
    await service.appReady();
    assert.deepEqual(calls, [
      'a-web:listen:null',
      'a-version:instanceInit:',
      'a-schedule:loadSchedules:',
      'a-runtime:runtime:',
      'a-printtip:printTip:',
      'a-queue:loadQueueWorkers:',
      'seed:',
    ]);
  });

  it('fails before after-startups and readiness if default seeding fails', async () => {
    const { service, app, calls, pending } = fixture(['', 'isolateTest']);
    (service as any).$scope.version.service.version.__instanceSeed = async () => {
      throw new Error('seed failed');
    };
    await assert.rejects(service.appReady(), /seed failed/);
    assert.deepEqual([...pending], ['', 'isolateTest']);
    assert.deepEqual(app.meta.appReadyInstances, {});
    assert.deepEqual(calls, ['a-version:instanceInit:']);
  });

  it('retains completed default readiness if later isolate initialization fails', async () => {
    const { service, app, calls, pending } = fixture(['', 'isolateTest']);
    const runStartup = service.runStartup.bind(service);
    service.runStartup = async (name, instance, options) => {
      if (name === 'a-version:instanceInit' && String(instance) === 'isolateTest') {
        throw new Error('isolate init failed');
      }
      await runStartup(name, instance, options);
    };
    await assert.rejects(service.appReady(), /isolate init failed/);
    assert.deepEqual([...pending], ['isolateTest']);
    assert.deepEqual(app.meta.appReadyInstances, { '': true });
    assert.deepEqual(calls, defaultCalls);
  });

  for (const failure of ['seed', 'isolate init']) {
    it(`preserves reset failure state when ${failure} fails`, async () => {
      process.env.VONA_DB_RESET = 'true';
      const { service, app, calls, pending } = fixture(['', 'isolateTest']);
      if (failure === 'seed') {
        (service as any).$scope.version.service.version.__instanceSeed = async () => {
          throw new Error('seed failed');
        };
      } else {
        const runStartup = service.runStartup.bind(service);
        service.runStartup = async (name, instance, options) => {
          if (name === 'a-version:instanceInit' && String(instance) === 'isolateTest') {
            throw new Error('isolate init failed');
          }
          await runStartup(name, instance, options);
        };
      }
      await assert.rejects(service.appReady(), new RegExp(`${failure} failed`));
      assert.deepEqual([...pending], failure === 'seed' ? ['', 'isolateTest'] : ['isolateTest']);
      assert.deepEqual(app.meta.appReadyInstances, failure === 'seed' ? {} : { '': true });
      assert.deepEqual(
        calls,
        failure === 'seed' ? ['a-version:instanceInit:'] : ['a-version:instanceInit:', 'seed:'],
      );
    });
  }

  for (const [phase, reset] of [
    ['init', false],
    ['seed', false],
    ['init', true],
    ['seed', true],
  ] as const) {
    it(`skips queued broadcast-style startup requests received during ${phase} (reset=${reset})`, async () => {
      if (reset) process.env.VONA_DB_RESET = 'true';
      const { service, calls, instanceService, app, pending } = fixture(['']);
      const entered = Promise.withResolvers<void>();
      const release = Promise.withResolvers<void>();
      const enqueued = Promise.withResolvers<void>();
      if (phase === 'init') {
        const runStartup = service.runStartup.bind(service);
        service.runStartup = async (name, instance, options) => {
          await runStartup(name, instance, options);
          if (name === 'a-version:instanceInit') {
            entered.resolve();
            await release.promise;
          }
        };
      } else {
        (service as any).$scope.version.service.version.__instanceSeed = async () => {
          calls.push('seed:');
          entered.resolve();
          await release.promise;
        };
      }
      const startup = service.appReady();
      await entered.promise;
      const competitor = instanceService('');
      const queue = competitor.__queueInstanceStartup[''];
      const push = queue.push.bind(queue);
      queue.push = (...args: unknown[]) => {
        const result = push(...args);
        enqueued.resolve();
        return result;
      };
      let delivered = false;
      const delivery = competitor.checkAppReadyInstance(true).then(() => {
        delivered = true;
      });
      try {
        await enqueued.promise;
        assert.equal(delivered, false);
      } finally {
        release.resolve();
        await Promise.all([startup, delivery]);
      }
      assert.equal(delivered, true);
      assert.equal(app.meta.appReadyInstances[''], true);
      assert.equal(pending.size, 0);
      assert.deepEqual(
        calls,
        reset ? ['a-version:instanceInit:', 'seed:'] : [...defaultCalls, 'a-web:listen:null'],
      );
    });
  }

  it('preserves forced after-startup debounce semantics', async t => {
    const service = Object.create(ServiceStartup.prototype) as ServiceStartup;
    const getset = t.mock.fn(async () => true);
    const execute = t.mock.fn(async () => {});
    Object.defineProperties(service, {
      app: { value: { meta: { isTest: false } } },
      ctx: { value: { instance: { id: 1 } } },
      scope: {
        value: {
          config: { startup: { debounce: 1000 } },
          cacheRedis: { startupDebounce: { getset } },
        },
      },
      _runStartupInner: { value: execute },
    });
    const startup = {
      name: 'a-runtime:runtime',
      beanOptions: { options: { instance: true, after: true, debounce: true } },
    };
    await service._runStartupLock(startup as never, '' as never, { force: true });
    assert.equal(getset.mock.callCount(), 0);
    assert.equal(execute.mock.callCount(), 1);
    await service._runStartupLock(startup as never, '' as never, { force: false });
    assert.equal(getset.mock.callCount(), 1);
    assert.equal(execute.mock.callCount(), 1);
  });

  it('allows readiness checks during after-startups without reentering its queue', async () => {
    const { service, calls, instanceService } = fixture(['']);
    const runStartup = service.runStartup.bind(service);
    service.runStartup = async (name, instance, options) => {
      await runStartup(name, instance, options);
      if (name === 'a-runtime:runtime') {
        assert.equal(await instanceService('').checkAppReadyInstance(true), true);
      }
    };
    await service.appReady();
    assert.deepEqual(calls, [...defaultCalls, 'a-web:listen:null']);
  });
});
