import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('authSimple.test.ts', () => {
  it('action:passwordHash', async () => {
    const scope = app.scope('auth-simple');
    const password = '12344##1xxaasDFQ,.$';
    const hash = await scope.service.authSimple.calcPasswordHash(password);
    let verified = await scope.service.authSimple.verifyPasswordHash(password, hash);
    assert.equal(verified, true);
    verified = await scope.service.authSimple.verifyPasswordHash(`${password}failed`, hash);
    assert.equal(verified, false);
  });

  it('action:authSimple', async () => {
    await app.bean.executor.mockCtx(async () => {
      const password = app.scope('home-user').config.passwordDefault.admin;
      // login
      const jwt = await app.bean.auth.authenticate('auth-simple:simple', {
        clientName: 'default',
        clientOptions: { username: 'admin', password },
      });
      assert.equal(!!jwt?.accessToken, true);
      // isAuthenticated: isolate
      const [isAuthenticated2, _err] = await catchError(async () => {
        return await app.bean.executor.newCtxIsolate(async () => {
          return await app.bean.executor.performAction(
            'get',
            '/test/auth/passport/isAuthenticated',
          );
        });
      });
      assert.equal(isAuthenticated2, undefined);
      // isAuthenticated: isolate + header
      const isAuthenticated = await app.bean.executor.newCtxIsolate(async () => {
        return await app.bean.executor.performAction('get', '/test/auth/passport/isAuthenticated', {
          authToken: jwt?.accessToken,
        });
      });
      assert.equal(isAuthenticated, true);
      // login again
      const jwt2 = await app.bean.auth.authenticate('auth-simple:simple', {
        clientOptions: { username: 'admin', password },
        state: { intention: 'login' },
        clientName: 'default',
      });
      assert.equal(!!jwt2?.accessToken, true);
    });
  });
});
