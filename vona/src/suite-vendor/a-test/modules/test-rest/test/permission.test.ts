import type { VonaContext } from 'vona';
import type { IRbacPolicyDecision } from 'vona-module-a-rbac';
import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { appResource, beanFullNameFromOnionName } from 'vona';
import { app } from 'vona-mock';
import { BeanPermission } from 'vona-module-a-permission';
import { getRbacDecision, setRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';
import { getCacheControllerRoutes, recordResourceNameToRoutePath } from 'vona-module-a-web';

const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
const GuardResource = 'test-rest:product';

async function withGuardPermission(
  guard: (ctx: VonaContext) => Promise<boolean | void>,
  callback: (fixture: {
    permission: BeanPermission;
    ctx: VonaContext;
    passport: { isAuthenticated: boolean; isAccountActive: boolean; isActivated: boolean };
    action: IRbacPolicyDecision['action'];
  }) => Promise<void>,
  rbac = false,
) {
  await app.bean.executor.mockCtx(async () => {
    const resource = recordResourceNameToRoutePath[GuardResource];
    assert.ok(resource, `${GuardResource} fixture must be registered`);
    const controller = resource.controller;
    const controllerBeanFullName = appResource.getBean(controller)!.beanFullName;
    const route = {
      controller,
      controllerBeanFullName,
      action: 'create',
      route: { meta: rbac ? { [BeanFullNameGuardRbac]: {} } : {} },
    } as ContextRoute;
    const action: IRbacPolicyDecision['action'] = {
      actionKey: `${controllerBeanFullName}#create`,
      actionInheritKey: `${controllerBeanFullName}#update`,
      controllerBeanFullName,
      action: 'create',
      route,
      options: {},
    };
    const unexpected = () =>
      assert.fail('guard-only checks must not use permission retrieval or scope projection');
    const fixtureApp = {
      meta: {},
      bean: { onion: { guard: { compose: () => guard } } },
    };
    getCacheControllerRoutes(fixtureApp as never)[controllerBeanFullName] = [route];
    const passport = { isAuthenticated: true, isAccountActive: true, isActivated: true };
    const permission = Object.create(BeanPermission.prototype) as BeanPermission;
    Object.defineProperties(permission, {
      app: { value: fixtureApp },
      ctx: { value: app.ctx },
      bean: {
        value: {
          passport,
          rbacCatalog: { getAction: () => action },
          rbacScope: { current: unexpected },
        },
      },
      scope: { value: { event: { retrievePermissionAction: { emit: unexpected } } } },
      retrievePermissionAction: { value: unexpected },
      retrievePermissionActionByRoles: { value: unexpected },
      retrievePermissionActionByUser: { value: unexpected },
    });
    await callback({ permission, ctx: app.ctx, passport, action });
  });
}

describe('permission.test.ts', { concurrency: false }, () => {
  it('action:permission:anonymous', async () => {
    await app.bean.executor.mockCtx(async () => {
      const permissions = await app.bean.permission.getPermissionsDefault('test-rest:product');
      assert.equal(permissions?.actions?.create, false);
    });
  });
  it('action:permission:admin', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      const permissions = await app.bean.permission.getPermissionsDefault('test-rest:product');
      assert.equal(permissions?.actions?.create, true);
    });
  });

  it('checks current guards without permission events, result caches, or projection', async () => {
    let allowed = true;
    let calls = 0;
    await withGuardPermission(
      async () => {
        calls++;
        return allowed;
      },
      async ({ permission }) => {
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), true);
        allowed = false;
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), false);
        assert.equal(calls, 2);
      },
    );
  });

  it('fails closed before guards for unknown routes and Passport admission failures', async () => {
    await withGuardPermission(
      async () => assert.fail('guards must not run before admission'),
      async ({ permission, passport }) => {
        assert.equal(
          await permission.checkPermissionActionGuards('test:missing' as never, 'create'),
          false,
        );
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'missing'), false);
        passport.isAuthenticated = false;
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), false);
      },
    );
  });

  it('converts guard authorization errors to false and propagates unexpected errors', async () => {
    let failure: Error;
    await withGuardPermission(
      async () => {
        throw failure;
      },
      async ({ permission }) => {
        for (const code of [401, 403]) {
          failure = Object.assign(new Error('authorization failure'), { code });
          assert.equal(
            await permission.checkPermissionActionGuards(GuardResource, 'create'),
            false,
          );
        }
        failure = new Error('unexpected guard failure');
        await assert.rejects(
          () => permission.checkPermissionActionGuards(GuardResource, 'create'),
          failure,
        );
      },
    );
  });

  it('requires a fresh allowed RBAC decision matching the full catalog action identity', async () => {
    let decision: IRbacPolicyDecision | undefined;
    await withGuardPermission(
      async ctx => {
        assert.equal(getRbacDecision(ctx), undefined);
        if (decision) setRbacDecision(ctx, decision);
        return true;
      },
      async ({ permission, ctx, action }) => {
        const valid: IRbacPolicyDecision = {
          allowed: true,
          actionKey: action.actionKey,
          action: { ...action },
          terms: [{ dataScope: 'all' }],
        };
        setRbacDecision(ctx, valid);
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), false);
        assert.equal(getRbacDecision(ctx), valid);
        for (const invalid of [
          { ...valid, allowed: false },
          { ...valid, actionKey: 'other#action' },
          ...[
            { actionKey: 'other#action' },
            { actionInheritKey: undefined },
            { controllerBeanFullName: 'other.controller' },
            { action: 'other' },
          ].map(mismatch => ({ ...valid, action: { ...action, ...mismatch } })),
        ]) {
          decision = invalid;
          assert.equal(
            await permission.checkPermissionActionGuards(GuardResource, 'create'),
            false,
          );
          assert.equal(getRbacDecision(ctx), valid);
        }
        decision = valid;
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), true);
        assert.equal(getRbacDecision(ctx), valid);
        delete ctx[SymbolRbacDecision];
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), true);
        assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), false);
      },
      true,
    );
  });

  it('restores property descriptors and inherited innerAccess after success and failure', async () => {
    let failure: Error | undefined;
    await withGuardPermission(
      async ctx => {
        assert.equal(ctx.route.action, 'create');
        assert.equal(ctx.innerAccess, false);
        assert.equal(getRbacDecision(ctx), undefined);
        if (failure) throw failure;
        return true;
      },
      async ({ permission, ctx, action }) => {
        assert.equal(Object.hasOwn(ctx, 'innerAccess'), false);
        ctx.innerAccess = true;
        Object.defineProperty(ctx, 'route', {
          value: { action: 'previous' },
          writable: true,
          configurable: true,
          enumerable: false,
        });
        Object.defineProperty(ctx, SymbolRbacDecision, {
          value: {
            allowed: true,
            actionKey: action.actionKey,
            action,
            terms: [{ dataScope: 'all' }],
          },
          writable: true,
          configurable: true,
          enumerable: false,
        });
        const descriptors = Object.getOwnPropertyDescriptors(ctx);
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), true);
        assert.deepEqual(Object.getOwnPropertyDescriptors(ctx), descriptors);
        assert.equal(ctx.innerAccess, true);
        failure = new Error('guard failure');
        await assert.rejects(
          () => permission.checkPermissionActionGuards(GuardResource, 'create'),
          failure,
        );
        assert.deepEqual(Object.getOwnPropertyDescriptors(ctx), descriptors);
        assert.equal(ctx.innerAccess, true);

        delete (ctx as any).route;
        delete ctx[SymbolRbacDecision];
        const absentDescriptors = Object.getOwnPropertyDescriptors(ctx);
        failure = undefined;
        assert.equal(await permission.checkPermissionActionGuards(GuardResource, 'create'), true);
        assert.deepEqual(Object.getOwnPropertyDescriptors(ctx), absentDescriptors);
      },
    );
  });
});
