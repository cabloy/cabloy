import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('home.test.ts', () => {
  it('action:home', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const res = await app.bean.executor.performAction('get', '//');
        assert.equal(res, 'Hello Vona!');
      },
      { locale: 'en-us' },
    );
  });
});
