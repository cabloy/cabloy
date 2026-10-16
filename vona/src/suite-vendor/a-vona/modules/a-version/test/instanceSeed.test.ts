import chalk from 'chalk';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ServiceVersion } from '../src/service/version.ts';

function fixture(check: ServiceVersion['__check']) {
  const messages: string[] = [];
  const service = Object.create(ServiceVersion.prototype) as ServiceVersion;
  Object.defineProperties(service, {
    __check: { value: check },
    $logger: { value: { silly: (message: string) => messages.push(message) } },
  });
  return { service, messages };
}

describe('instance seed completion', () => {
  it('logs default completion only after seeding succeeds', async () => {
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const { service, messages } = fixture(async options => {
      assert.equal(options.scene, 'seed');
      assert.equal(options.instanceName, '');
      entered.resolve();
      await release.promise;
      return {};
    });
    const seeding = service.__instanceSeed('');
    try {
      await entered.promise;
      assert.deepEqual(messages, []);
    } finally {
      release.resolve();
      await seeding;
    }
    assert.deepEqual(messages, [chalk.cyan('The instance is seeded successfully: default')]);
  });

  it('propagates seed failure without logging success', async () => {
    const error = new Error('seed failed');
    const { service, messages } = fixture(async () => {
      throw error;
    });
    await assert.rejects(service.__instanceSeed(''), error);
    assert.deepEqual(messages, []);
  });
});
