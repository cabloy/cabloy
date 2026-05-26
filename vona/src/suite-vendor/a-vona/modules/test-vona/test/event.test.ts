import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('event.test.ts', () => {
  it('action:event', async () => {
    await app.bean.executor.mockCtx(async () => {
      // scope
      const scopeTest = app.scope('test-vona');
      const result = await scopeTest.event.helloEcho.emit({ text: 'hello' }, 'world');
      assert.equal(result, 'hello world');
    });
  });
});
