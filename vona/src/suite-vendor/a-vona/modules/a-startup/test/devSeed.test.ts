import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ServiceStartup } from '../src/service/startup.ts';

function fixture(created: string[] = []) {
  const calls: string[] = [];
  const pending = new Set(created);
  const app = {
    meta: { isDev: true, isTest: false, appReadyInstances: {} as Record<string, boolean> },
    config: { server: { listen: { disable: false } } },
  };
  const service = Object.create(ServiceStartup.prototype) as ServiceStartup;
  const startups = [
    { name: 'a-version:instanceInit', beanOptions: { options: { instance: true } } },
    { name: 'a-runtime:runtime', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-queue:loadQueueWorkers', beanOptions: { options: { instance: true, after: true } } },
    { name: 'a-web:listen', beanOptions: { options: { after: true } } },
  ];
  Object.defineProperties(service, {
    app: { value: app },
    _startups: { value: startups },
    bean: { value: { executor: { newCtx: async (fn: () => Promise<unknown>) => fn() } } },
    $scope: {
      value: {
        version: {
          service: {
            database: {
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
                service.runStartupInstance(name as never, options),
            },
          },
        },
      },
    },
    runStartup: {
      value: async (name: string, instance: string) => {
        calls.push(`${name}:${instance}`);
      },
    },
  });
  return { service, app, calls, pending };
}

describe('creation-driven dev seed', { concurrency: false }, () => {
  it('seeds fresh instances before runtime, queues, and listening', async () => {
    const { service, calls, pending, app } = fixture(['', 'isolateTest']);
    await service.appReady();
    assert.equal(pending.size, 0);
    const lastSeed = calls.indexOf('seed:isolateTest');
    assert.ok(lastSeed > calls.indexOf('seed:'));
    for (const call of ['a-runtime:runtime:', 'a-queue:loadQueueWorkers:', 'a-web:listen:null']) {
      assert.ok(calls.indexOf(call) > lastSeed, `${call} must follow all seeds`);
    }
    assert.equal(app.meta.appReadyInstances[''], true);
    assert.equal(app.meta.appReadyInstances.isolateTest, true);
    await service.runStartupInstance('' as never);
    assert.equal(calls.filter(call => call === 'seed:').length, 1);
  });

  it('does not seed existing default when only an isolated database is new', async () => {
    const { service, calls } = fixture(['isolateTest']);
    await service.appReady();
    assert.ok(calls.includes('seed:isolateTest'));
    assert.ok(!calls.includes('seed:'));
  });

  it('does not seed when all databases are reused', async () => {
    const { service, calls } = fixture();
    await service.appReady();
    assert.ok(!calls.some(call => call.startsWith('seed:')));
  });

  it('fails before after-startups and readiness if seeding fails', async () => {
    const { service, app, calls, pending } = fixture(['']);
    (service as any).$scope.version.service.version.__instanceSeed = async () => {
      throw new Error('seed failed');
    };
    await assert.rejects(service.appReady(), /seed failed/);
    assert.ok(pending.has(''));
    assert.deepEqual(app.meta.appReadyInstances, {});
    assert.ok(
      !calls.some(
        call =>
          call.includes('runtime') || call.includes('listen') || call.includes('loadQueueWorkers'),
      ),
    );
  });
});
