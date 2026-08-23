import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const ResourceGuardPassport = 'test-vona:guardPassport';

describe('guardPassport.test.ts', () => {
  it('action:guardPassport:roleName', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const res = await app.bean.executor.performAction(
          'get',
          '/test/vona/guardPassport/testRoleName',
          {
            innerAccess: false,
          },
        );
        assert.equal(res, undefined);
        const [_, err] = await catchError(() => {
          return app.bean.executor.performAction(
            'get',
            '/test/vona/guardPassport/testRoleNameFail',
            {
              innerAccess: false,
            },
          );
        });
        assert.equal(err?.code, 403);
        const permissions = await app.bean.permission.getPermissionsDefault(ResourceGuardPassport);
        assert.equal(permissions?.actions?.testRoleName, true);
        assert.equal(permissions?.actions?.testRoleNameFail, false);
        assert.equal(permissions?.actions?.testRoleNameControllerShouldNotExecute, true);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('action:guardPassport:public', async () => {
    await app.bean.executor.mockCtx(async () => {
      const permissions = await app.bean.permission.getPermissionsDefault(ResourceGuardPassport);
      assert.equal(permissions?.actions?.testPublic, true);
    });
  });

  it('action:guardPassport:activatedFalse', async () => {
    await app.bean.executor.mockCtx(async () => {
      const user = await app.bean.user.register({
        name: `guard-passport-${crypto.randomUUID()}`,
        activated: false,
      });
      try {
        await app.bean.passport.signinSystem('mock', -10001 as any, user.name);
        const res = await app.bean.executor.performAction(
          'get',
          '/test/vona/guardPassport/testActivatedFalse',
          {
            innerAccess: false,
          },
        );
        assert.equal(res, undefined);
        const permissions = await app.bean.permission.getPermissionsDefault(ResourceGuardPassport);
        assert.equal(permissions?.actions?.testActivatedFalse, true);
        assert.equal(permissions?.actions?.testRoleName, false);
      } finally {
        await app.bean.passport.signout();
        await app.bean.user.removeById(user.id);
      }
    });
  });

  it('action:guardPassport:retrievePermissionActionEvent', async () => {
    await app.bean.executor.mockCtx(async () => {
      let invoked = 0;
      const ctx = app.ctx;
      const off = app.bean.event.on('a-permission:retrievePermissionAction', async (data, next) => {
        if (app.ctx !== ctx || data.resource !== ResourceGuardPassport) return await next();
        invoked++;
        if (data.actionKey === 'testRoleNameFail') return true;
        return await next();
      });
      try {
        const permissionAnonymous = await app.bean.permission.retrievePermissionAction(
          ResourceGuardPassport,
          'testRoleName',
        );
        assert.equal(permissionAnonymous, false);
        assert.equal(invoked, 0);

        await app.bean.passport.signinMock();
        const permissionDefault = await app.bean.permission.retrievePermissionAction(
          ResourceGuardPassport,
          'testRoleName',
        );
        const permissionCustom = await app.bean.permission.retrievePermissionAction(
          ResourceGuardPassport,
          'testRoleNameFail',
        );
        assert.equal(permissionDefault, true);
        assert.equal(permissionCustom, true);
        assert.equal(invoked, 2);
      } finally {
        off();
        await app.bean.passport.signout();
      }
    });
  });

  it('action:guardPassport:cacheKeyByRoleIds', async () => {
    await app.bean.executor.mockCtx(async () => {
      const cacheKeyAnonymous = (
        app.bean.permission as any
      ).retrievePermissionActionByRolesCacheKey({
        args: [ResourceGuardPassport, 'testRoleName'],
      });
      assert.equal(cacheKeyAnonymous, 'action:test-vona:guardPassport:testRoleName:roles:none');

      await app.bean.passport.signinMock('admin');
      try {
        assert.ok(app.bean.passport.current);
        app.bean.passport.current!.roles = [
          { id: '2', name: 'role2' },
          { id: '1', name: 'role1' },
          { id: '2', name: 'role2' },
        ] as any;
        const cacheKeyAdmin = (app.bean.permission as any).retrievePermissionActionByRolesCacheKey({
          args: [ResourceGuardPassport, 'testRoleName'],
        });
        assert.equal(cacheKeyAdmin, 'action:test-vona:guardPassport:testRoleName:roles:1,2');
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
