import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('aopMethod.test.ts', () => {
  it('action:aopMethod', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      let result = scopeTest.service.aopMethod.testSyncBase();
      assert.equal(result, '-+hello+-');
      result = scopeTest.service.aopMethod.testSync();
      assert.equal(result, '-+hello+-');
      result = await scopeTest.service.aopMethod.testAsync();
      assert.equal(result, '-+hello+-');
      scopeTest.service.aopMethod.name = '-+vona+-';
      result = scopeTest.service.aopMethod.name;
      assert.equal(result, '-+vona+-');
    });
  });
});
