import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('passport.test.ts', () => {
  it('action:passport:simple', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      assert.equal(app.bean.passport.isAuthenticated, true);
      assert.equal(app.bean.passport.current, app.ctx.passport);
      assert.equal(app.bean.passport.currentUser, app.ctx.user);
      await app.bean.executor.performAction('get', '/test/vona/passport/echo/:name', {
        params: { name: 'admin' },
      });
      await app.bean.passport.signout();
      assert.equal(app.bean.passport.isAuthenticated, false);
    });
  });

  it('action:passport:full', async () => {
    await app.bean.executor.mockCtx(async () => {
      // login
      const jwt = await app.bean.executor.performAction('post', '/test/vona/passport/login', {
        body: {
          name: 'admin',
        },
      });
      assert.equal(!!jwt?.accessToken, true);
      // isAuthenticated
      let isAuthenticated = await app.bean.executor.performAction(
        'get',
        '/test/vona/passport/isAuthenticated',
      );
      assert.equal(isAuthenticated, true);
      // isAuthenticated: isolate
      const [isAuthenticated2, _err] = await catchError(async () => {
        return await app.bean.executor.newCtxIsolate(async () => {
          return await app.bean.executor.performAction(
            'get',
            '/test/vona/passport/isAuthenticated',
          );
        });
      });
      assert.equal(isAuthenticated2, undefined);
      // isAuthenticated: isolate + header
      isAuthenticated = await app.bean.executor.newCtxIsolate(async () => {
        return await app.bean.executor.performAction('get', '/test/vona/passport/isAuthenticated', {
          authToken: jwt.accessToken,
        });
      });
      assert.equal(isAuthenticated, true);
      // refresh
      const jwtNew = await app.bean.executor.performAction('post', '/test/vona/passport/refresh', {
        body: {
          refreshToken: jwt.refreshToken,
        },
      });
      assert.equal(!!jwtNew.accessToken, true);
      // logout
      await app.bean.executor.performAction('post', '/test/vona/passport/logout');
      // isAuthenticated: isolate + header
      const [isAuthenticated3] = await catchError(async () => {
        return await app.bean.executor.performAction('get', '/test/vona/passport/isAuthenticated');
      });
      assert.equal(isAuthenticated3, undefined);
    });
  });
});
