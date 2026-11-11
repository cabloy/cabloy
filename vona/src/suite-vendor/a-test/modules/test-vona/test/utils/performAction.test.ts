import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app, mockUrl } from 'vona-mock';

describe('performAction.test.ts', { concurrency: false }, () => {
  it('preserves results and errors without generic executor logs', async () => {
    await app.bean.executor.mockCtx(async () => {
      const context = app.ctx;
      const logger = app.bean.logger.default;
      const messages: string[] = [];
      const observe = (info: { message: string | (() => string) }) => {
        if (app.ctx !== context) return;
        const message = typeof info.message === 'function' ? info.message() : info.message;
        if (message.includes('#performActionInner')) messages.push(message);
      };
      logger.on('data', observe);
      try {
        const secret = 'executor-diagnostic-private-canary';
        const result = await app.bean.executor.performAction(
          'post',
          '/test/vona/performAction/echo',
          { body: { id: 123, privateValue: secret }, headers: { 'x-test-private': secret } },
        );
        assert.deepEqual(result, { id: 123, url: mockUrl('performAction/echo') });
        await assert.rejects(
          // Intentionally bypass the generated path type to exercise a missing route.
          app.bean.executor.performAction('post', '/test/vona/performAction/missing' as never),
          { code: 404, status: 404 },
        );
        assert.deepEqual(messages, []);
      } finally {
        logger.off('data', observe);
      }
    });
  });
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
