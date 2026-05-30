import type { IPassport } from 'vona-module-a-user';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('authOauth.test.ts', () => {
  it('action:authOauth', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        // login
        const jwt = await app.bean.auth.authenticate('auth-oauth:oauth', {
          // state: { redirect: 'xxxxx' },
          clientName: 'github',
          clientOptions: {
            mockUsername: 'mock-user',
          },
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
          return await app.bean.executor.performAction(
            'get',
            '/test/auth/passport/isAuthenticated',
            { authToken: jwt?.accessToken },
          );
        });
        assert.equal(isAuthenticated, true);
        // current
        const current: IPassport = await app.bean.executor.newCtxIsolate(async () => {
          return await app.bean.executor.performAction('get', '/test/auth/passport/current', {
            authToken: jwt?.accessToken,
          });
        });
        assert.equal(current.user?.locale, 'zh-cn');
        assert.equal(current.user?.tz, 'America/New_York');
      },
      {
        locale: 'zh-cn',
        tz: 'America/New_York',
      },
    );
  });
});
