import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app, mockUrl } from 'vona-mock';

describe('performAction.test.ts', () => {
  it('action:performAction', async () => {
    const result: { id: number; url: string } = await app.bean.executor.mockCtx(async () => {
      return await app.bean.executor.performAction('post', '/test/vona/performAction/echo', {
        body: {
          id: 123,
        },
      });
    });
    assert.equal(result.id, 123);
    assert.equal(result.url, mockUrl('performAction/echo'));
  });
  it('action:performAction:onionsDynamic', async () => {
    const result: { id: number; url: string } = await app.bean.executor.mockCtx(async () => {
      return await app.bean.executor.performAction('post', '/test/vona/performAction/echo', {
        onions: {
          pipe: { 'a-web:valid': { enable: false } },
        },
      });
    });
    assert.equal(result.id, undefined);
    assert.equal(result.url, mockUrl('performAction/echo'));
  });
});
