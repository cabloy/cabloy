import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('error.test.ts', () => {
  it('action:error:legacy', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeTest = app.scope('test-vona');
        const body = scopeTest.error.LegacyBusinessError.parseFail();
        assert.deepEqual(body, {
          code: 'test-vona:1001',
          status: 500,
          message: '旧版业务错误',
        });
        assert.throws(
          () => scopeTest.error.LegacyBusinessError.throw(),
          (err: Error) =>
            err.code === 'test-vona:1001' && err.status === 500 && err.message === '旧版业务错误',
        );
      },
      { locale: 'zh-cn' },
    );
  });

  it('action:error:structured', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scopeTest = app.scope('test-vona');
        const body = scopeTest.error.StructuredConflict.parseFail();
        assert.deepEqual(body, {
          code: 'test-vona:1002',
          status: 409,
          message: '结构化冲突',
        });
        assert.throws(
          () => scopeTest.error.StructuredConflict.throw(),
          (err: Error) =>
            err.code === 'test-vona:1002' && err.status === 409 && err.message === '结构化冲突',
        );
      },
      { locale: 'zh-cn' },
    );
  });

  it('action:error:direct', async () => {
    await app.bean.executor.mockCtx(async () => {
      const body = app.parseFail(404);
      assert.equal(body.code, 404);
      assert.equal(body.status, 404);
      assert.throws(
        () => app.throw(404),
        (err: Error) => err.code === 404 && err.status === 404,
      );
    });
  });

  it('action:error:fail', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scopeTest = app.scope('test-vona');
      app.meta.error.fail('test-vona', 'StructuredConflict');
      assert.equal(app.ctx.response.status, 409);
      assert.equal(app.ctx.response.type, 'application/json');
      assert.deepEqual(app.ctx.response.body, {
        code: 'test-vona:1002',
        message: 'Structured conflict',
      });
      assert.equal(scopeTest.error.StructuredConflict.parseFail().status, 409);
    });
  });
});
