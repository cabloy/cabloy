import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const activateCurrentPath = '/home/user/passportTest/activateCurrent';
const removeCurrentFixturePath = '/home/user/passportTest/removeCurrentFixture';
const fixtureUserNamePrefix = 'e2e-fixture-';

describe('passportTest.test.ts', { concurrency: false }, () => {
  it('action:passportTest:removeCurrentFixture removes only the authenticated marked fixture', async () => {
    let fixtureUserId: string | undefined;
    let fixtureAuthId: string | undefined;
    let fixtureAuthSimpleId: string | undefined;
    let ordinaryUserId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const fixtureUser = await app.bean.user.register({
          name: `${fixtureUserNamePrefix}${crypto.randomUUID()}`,
        });
        fixtureUserId = String(fixtureUser.id);
        await app.bean.user.activate(fixtureUser);
        await app
          .scope('auth-simple')
          .service.authSimple.createForUser(fixtureUser.id, 'fixture-password');
        const authProvider = await app.bean.authProvider.get({
          providerName: 'auth-simple:simple',
          clientName: 'default',
        });
        const fixtureAuth = await app.scope('a-auth').model.auth.get({
          userId: fixtureUser.id,
          authProviderId: authProvider!.id,
        });
        fixtureAuthId = String(fixtureAuth!.id);
        fixtureAuthSimpleId = fixtureAuth!.profileId;
        const ordinaryUser = await app.bean.user.register({
          name: `passport-test-${crypto.randomUUID()}`,
        });
        ordinaryUserId = String(ordinaryUser.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const [_, error] = await catchError(() =>
          app.bean.executor.performAction('delete', removeCurrentFixturePath, {
            innerAccess: false,
          }),
        );
        assert.equal(error?.code, 401);
      });

      await app.bean.executor.mockCtx(async () => {
        const ordinaryUser = await app.bean.user.findOneById(ordinaryUserId!);
        await app.bean.passport.signinSystem('mock', -10001 as any, ordinaryUser!.name);
        try {
          const [_, error] = await catchError(() =>
            app.bean.executor.performAction('delete', removeCurrentFixturePath, {
              innerAccess: false,
            }),
          );
          assert.equal(error?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const fixtureUser = await app.bean.user.findOneById(fixtureUserId!);
        await app.bean.passport.signinSystem('mock', -10002 as any, fixtureUser!.name);
        try {
          assert.equal(
            await app.bean.executor.performAction('delete', removeCurrentFixturePath, {
              innerAccess: false,
            }),
            null,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        assert.equal(await app.bean.user.findOneById(fixtureUserId!), undefined);
        assert.equal(await app.scope('a-auth').model.auth.getById(fixtureAuthId!), undefined);
        assert.equal(
          await app.scope('auth-simple').model.authSimple.getById(fixtureAuthSimpleId!),
          undefined,
        );
      });
      fixtureUserId = undefined;
      fixtureAuthId = undefined;
      fixtureAuthSimpleId = undefined;
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (fixtureAuthId) await app.scope('a-auth').model.auth.deleteById(fixtureAuthId);
        if (fixtureAuthSimpleId) {
          await app.scope('auth-simple').model.authSimple.deleteById(fixtureAuthSimpleId);
        }
        if (fixtureUserId) {
          await app.scope('home-user').model.roleUser.delete({ userId: fixtureUserId });
          await app.bean.user.removeById(fixtureUserId);
        }
        if (ordinaryUserId) await app.bean.user.removeById(ordinaryUserId);
      });
    }
  });

  it('removes a registered fixture before activation', async () => {
    let userId: string | undefined;
    let authId: string | undefined;
    let authSimpleId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `${fixtureUserNamePrefix}${crypto.randomUUID()}`,
        });
        userId = String(user.id);
        assert.equal(user.activated, false);
        const authSimple = await app
          .scope('auth-simple')
          .service.authSimple.createForUser(user.id, 'fixture-password');
        authSimpleId = String(authSimple!.id);
        const provider = await app.bean.authProvider.get({
          providerName: 'auth-simple:simple',
          clientName: 'default',
        });
        const auth = await app.scope('a-auth').model.auth.get({
          userId: user.id,
          authProviderId: provider!.id,
        });
        authId = String(auth!.id);
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        assert.equal(user?.activated, false);
        await app.bean.passport.signinSystem('mock', -10003 as any, user!.name);
        try {
          assert.equal(
            await app.bean.executor.performAction('delete', removeCurrentFixturePath, {
              innerAccess: false,
            }),
            null,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        assert.equal(await app.bean.user.findOneById(userId!), undefined);
        assert.equal(await app.scope('a-auth').model.auth.getById(authId!), undefined);
        assert.equal(
          await app.scope('auth-simple').model.authSimple.getById(authSimpleId!),
          undefined,
        );
      });
      userId = undefined;
      authId = undefined;
      authSimpleId = undefined;
    } finally {
      await app.bean.executor.mockCtx(async () => {
        if (authId) await app.scope('a-auth').model.auth.deleteById(authId);
        if (authSimpleId) await app.scope('auth-simple').model.authSimple.deleteById(authSimpleId);
        if (userId) {
          await app.scope('home-user').model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId);
        }
      });
    }
  });

  it('action:passportTest:activateCurrent', async () => {
    let userId: string | undefined;
    try {
      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.register({
          name: `passport-test-${crypto.randomUUID()}`,
        });
        userId = user.id as string;
        assert.equal(user.activated, false);
        assert.equal(user.accountStatus, 'active');

        const [_, error] = await catchError(() => {
          return app.bean.executor.performAction('post', activateCurrentPath, {
            innerAccess: false,
          });
        });
        assert.equal(error?.code, 401);
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        assert.equal(user?.activated, false);
        await app.bean.passport.signinSystem('mock', -10001 as any, user!.name);
        try {
          const result = await app.bean.executor.performAction('post', activateCurrentPath, {
            innerAccess: false,
          });
          assert.equal(result, undefined);
        } finally {
          await app.bean.passport.signout();
        }
      });

      await app.bean.executor.mockCtx(async () => {
        const scope = app.scope('home-user');
        const user = await app.bean.user.findOneById(userId!);
        assert.equal(user?.activated, true);
        const registeredUser = await scope.model.role.getByName('registeredUser');
        const roleUser = await scope.model.roleUser.get({
          roleId: registeredUser!.id,
          userId: userId!,
        });
        assert.ok(roleUser);
      });

      await app.bean.executor.mockCtx(async () => {
        const user = await app.bean.user.findOneById(userId!);
        await app.bean.passport.signinSystem('mock', -10001 as any, user!.name);
        try {
          const [_, error] = await catchError(() => {
            return app.bean.executor.performAction('post', activateCurrentPath, {
              innerAccess: false,
            });
          });
          assert.equal(error?.code, 403);
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      if (userId) {
        await app.bean.executor.mockCtx(async () => {
          const scope = app.scope('home-user');
          await scope.model.roleUser.delete({ userId });
          await app.bean.user.removeById(userId!);
        });
      }
    }
  });
});
