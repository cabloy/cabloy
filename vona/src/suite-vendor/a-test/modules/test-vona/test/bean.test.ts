import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('bean.test.ts', () => {
  it('action:bean', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('get', '/test/vona/bean/test');
    });
  });

  it('action:service', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.executor.performAction('get', '/test/vona/bean/service');
    });
  });

  it('context fetch override', async () => {
    const fetchMock: typeof globalThis.fetch = async () => new Response();
    await app.bean.executor.mockCtx(
      async () => {
        assert.equal(app.bean.core.fetch, fetchMock);
      },
      { extraData: { state: { fetch: fetchMock } } },
    );
    await app.bean.executor.mockCtx(async () => {
      assert.equal(app.bean.core.fetch, globalThis.fetch);
    });
  });
});
