import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('onion.test.ts', () => {
  it('action:onion:nullableQuery', async () => {
    await app.bean.executor.mockCtx(async () => {
      const res = await app.bean.executor.performAction('get', '/test/vona/onion/echo7', {
        query: {
          age: 'null',
          nullableAge: 'null',
        },
      });
      assert.deepEqual(res, {
        age: 'undefined',
        nullableAge: 'null',
      });
    });
  });
});
