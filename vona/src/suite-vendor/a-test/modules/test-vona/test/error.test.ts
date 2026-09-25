import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

describe('error.test.ts', { concurrency: false }, () => {
  const releases: Array<() => void> = [];

  before(async () => {
    releases.push(await acquireTestLock('a-security'));
  });

  after(() => {
    for (const release of releases.reverse()) release();
  });

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
        const error = app.util.createError(body);
        assert.equal(error.code, 'test-vona:1002');
        assert.equal(error.status, 409);
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

  it('context:redirect:trustedExternal', async () => {
    await app.bean.executor.mockCtx(async () => {
      const serve = app.config.server.serve;
      const servePrevious = { ...serve };
      try {
        (serve as any).host = 'canonical.example.test';

        const [_, canonicalError] = await catchError(() => {
          app.ctx.redirect(`https://${app.util.host}/authorize`);
        });
        assert.equal(canonicalError?.code, 302);
        assert.equal(canonicalError?.status, 302);
        assert.equal(canonicalError?.message, 'https://canonical.example.test/authorize');

        const [__, untrustedError] = await catchError(() => {
          app.ctx.redirect(`https://${app.ctx.host}/authorize`);
        });
        assert.equal(untrustedError?.code, 403);
        assert.equal(untrustedError?.status, 403);

        const [___, trustedError] = await catchError(() => {
          app.ctx.redirect('https://provider.example.test/authorize', { trustedExternal: true });
        });
        assert.equal(trustedError?.code, 302);
        assert.equal(trustedError?.status, 302);
        assert.equal(trustedError?.message, 'https://provider.example.test/authorize');

        const [____, legacyError] = await catchError(() => {
          app.ctx.redirect('/legacy', 301);
        });
        assert.equal(legacyError?.code, 301);
        assert.equal(legacyError?.status, 301);
        assert.equal(legacyError?.message, '/legacy');
      } finally {
        Object.assign(serve, servePrevious);
      }
    });
  });
});
