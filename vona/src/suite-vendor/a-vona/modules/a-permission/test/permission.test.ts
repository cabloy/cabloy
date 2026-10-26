import type { VonaContext } from 'vona';
import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type { IRbacPolicyDecision } from 'vona-module-a-rbac';
import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { appResource, beanFullNameFromOnionName } from 'vona';
import { app } from 'vona-mock';
import { getRbacDecision, setRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';
import { getCacheControllerRoutes, recordResourceNameToRoutePath } from 'vona-module-a-web';

import { BeanPermission } from '../src/bean/bean.permission.ts';

function createPermission(options: { userId?: string; roleIds?: Array<string | number> }) {
  const permission = Object.create(BeanPermission.prototype) as BeanPermission;
  Object.defineProperties(permission, {
    ctx: {
      value: {
        passport: { user: options.userId ? { id: options.userId } : undefined },
      },
    },
    bean: {
      value: {
        passport: {
          currentRoles: (options.roleIds ?? []).map(id => ({ id })),
        },
      },
    },
  });
  return permission;
}

function cacheInfo(...args: unknown[]): ICachingActionKeyInfo {
  return { args } as ICachingActionKeyInfo;
}

function createCachePermission(clearedCacheNames: string[]) {
  const permission = Object.create(BeanPermission.prototype) as BeanPermission;
  Object.defineProperties(permission, {
    bean: {
      value: {
        summer: {
          cache(cacheName: string) {
            return {
              clear: async () => {
                clearedCacheNames.push(cacheName);
              },
            };
          },
        },
      },
    },
  });
  return permission;
}

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
    const controller = recordResourceNameToRoutePath[GuardResource].controller;
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
  it('normalizes role cache keys by role identity', () => {
    const first = createPermission({
      userId: 'user-1',
      roleIds: ['role-b', 'role-a', 'role-a'],
    });
    const sameRolesDifferentOrder = createPermission({
      userId: 'user-2',
      roleIds: ['role-a', 'role-b'],
    });

    const info = cacheInfo('test:resource', 'select');
    assert.equal(
      (first as any).retrievePermissionActionByRolesCacheKey(info),
      'action:test:resource:select:roles:role-a,role-b',
    );
    assert.equal(
      (first as any).retrievePermissionActionByRolesCacheKey(info),
      (sameRolesDifferentOrder as any).retrievePermissionActionByRolesCacheKey(info),
    );
  });

  it('keeps role and user action cache identities distinct', () => {
    const permission = createPermission({
      userId: 'user-1',
      roleIds: ['role-a'],
    });
    const info = cacheInfo('test:resource', 'select');

    assert.notEqual(
      (permission as any).retrievePermissionActionByRolesCacheKey(info),
      (permission as any).retrievePermissionActionByUserCacheKey(info),
    );
  });

  it('isolates RBAC action cache keys by user and roles', () => {
    const first = createPermission({
      userId: 'user-1',
      roleIds: ['role-a'],
    });
    const otherUser = createPermission({
      userId: 'user-2',
      roleIds: ['role-a'],
    });
    const changedRoles = createPermission({
      userId: 'user-1',
      roleIds: ['role-b'],
    });

    const info = cacheInfo('test:resource', 'select');
    assert.equal(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      'action:test:resource:select:user:user-1:roles:role-a',
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      (otherUser as any).retrievePermissionActionByUserCacheKey(info),
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      (changedRoles as any).retrievePermissionActionByUserCacheKey(info),
    );
  });

  it('selects the user cache only for RBAC-decorated actions', async () => {
    const permission = Object.create(BeanPermission.prototype) as BeanPermission;
    const calls: string[] = [];
    const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
    const routes = {
      ordinary: { route: { meta: {} } },
      rbac: { route: { meta: { [BeanFullNameGuardRbac]: {} } } },
    };
    Object.defineProperties(permission, {
      _getControllerActionRoute: {
        value: (_resource: unknown, actionKey: keyof typeof routes) => routes[actionKey],
      },
      _matchPassportMeta: { value: () => true },
      retrievePermissionActionByRoles: {
        value: async () => {
          calls.push('roles');
          return false;
        },
      },
      retrievePermissionActionByUser: {
        value: async () => {
          calls.push('user');
          return true;
        },
      },
      scope: {
        value: {
          event: {
            retrievePermissionAction: {
              emit: async (_data: unknown, next: () => Promise<unknown>) => await next(),
            },
          },
        },
      },
    });

    assert.equal(
      await permission.retrievePermissionAction('test:resource' as never, 'ordinary'),
      false,
    );
    assert.equal(await permission.retrievePermissionAction('test:resource' as never, 'rbac'), true);
    assert.deepEqual(calls, ['roles', 'user']);
  });

  it('isolates resource permission snapshots by user', () => {
    const first = createPermission({ userId: 'user-1' });
    const otherUser = createPermission({ userId: 'user-2' });
    const info = cacheInfo('test:resource');

    assert.equal(
      (first as any).retrievePermissionsCacheKey(info),
      'user:test:resource:user:user-1',
    );
    assert.notEqual(
      (first as any).retrievePermissionsCacheKey(info),
      (otherUser as any).retrievePermissionsCacheKey(info),
    );
  });

  it('clears the aggregate, role, and user permission cache layers', async () => {
    const clearedCacheNames: string[] = [];
    const permission = createCachePermission(clearedCacheNames);

    await permission.clearAllCaches();

    assert.deepEqual(clearedCacheNames, [
      beanFullNameFromOnionName('a-permission:permissionUser', 'summerCache'),
      beanFullNameFromOnionName('a-permission:permissionActionByRoles', 'summerCache'),
      beanFullNameFromOnionName('a-permission:permissionActionByUser', 'summerCache'),
    ]);
  });

  it('isolates RBAC decisions when a decorated guard is skipped', async () => {
    const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
    const route = {
      controllerBeanFullName: 'test:controller',
      action: 'select',
      route: { meta: { [BeanFullNameGuardRbac]: {} } },
    } as any;
    const ctx = { route: { action: 'previous' }, innerAccess: true } as any;
    const observedDecisions: Array<IRbacPolicyDecision | undefined> = [];
    const permission = Object.create(BeanPermission.prototype) as BeanPermission;
    Object.defineProperties(permission, {
      app: {
        value: {
          meta: {},
          bean: {
            onion: {
              guard: {
                compose: () => async () => true,
              },
            },
          },
        },
      },
      bean: {
        value: {
          rbacScope: {
            current: async () => {
              observedDecisions.push(getRbacDecision(ctx));
              const error = new Error('forbidden') as Error & { code: number };
              error.code = 403;
              throw error;
            },
          },
        },
      },
      ctx: { value: ctx },
    });
    const previousDecision = {
      allowed: true,
      actionKey: 'previous:controller#select',
      action: {
        actionKey: 'previous:controller#select',
        controllerBeanFullName: 'previous:controller',
        action: 'select',
      },
      terms: [{ dataScope: 'all' }],
    } as IRbacPolicyDecision;

    assert.equal(await (permission as any)._evaluatePermissionAction(route), false);
    assert.deepEqual(observedDecisions, [undefined]);
    assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), false);
    assert.deepEqual(ctx, { route: { action: 'previous' }, innerAccess: true });

    ctx[SymbolRbacDecision] = undefined;
    assert.equal(await (permission as any)._evaluatePermissionAction(route), false);
    assert.deepEqual(observedDecisions, [undefined, undefined]);
    assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), true);
    assert.equal(ctx[SymbolRbacDecision], undefined);
    assert.deepEqual(ctx.route, { action: 'previous' });
    assert.equal(ctx.innerAccess, true);

    setRbacDecision(ctx, previousDecision);
    assert.equal(await (permission as any)._evaluatePermissionAction(route), false);
    assert.deepEqual(observedDecisions, [undefined, undefined, undefined]);
    assert.equal(getRbacDecision(ctx), previousDecision);
    assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), true);
    assert.deepEqual(ctx.route, { action: 'previous' });
    assert.equal(ctx.innerAccess, true);
  });

  it('restores RBAC decisions when guard composition throws', async () => {
    const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
    const route = {
      controllerBeanFullName: 'test:controller',
      action: 'select',
      route: { meta: { [BeanFullNameGuardRbac]: {} } },
    } as any;
    const ctx = { route: { action: 'previous' }, innerAccess: true } as any;
    const previousDecision = {
      allowed: true,
      actionKey: 'previous:controller#select',
      action: {
        actionKey: 'previous:controller#select',
        controllerBeanFullName: 'previous:controller',
        action: 'select',
      },
      terms: [{ dataScope: 'all' }],
    } as IRbacPolicyDecision;
    setRbacDecision(ctx, previousDecision);
    const failure = new Error('guard failure');
    const permission = Object.create(BeanPermission.prototype) as BeanPermission;
    Object.defineProperties(permission, {
      app: {
        value: {
          meta: {},
          bean: {
            onion: {
              guard: {
                compose: () => async () => {
                  assert.equal(getRbacDecision(ctx), undefined);
                  throw failure;
                },
              },
            },
          },
        },
      },
      ctx: { value: ctx },
    });

    await assert.rejects(() => (permission as any)._evaluatePermissionAction(route), failure);
    assert.equal(getRbacDecision(ctx), previousDecision);
    assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), true);
    assert.deepEqual(ctx.route, { action: 'previous' });
    assert.equal(ctx.innerAccess, true);
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

  it('reduces an RBAC action projection to its final boolean result', async () => {
    const allowed = createPermission({});
    const denied = createPermission({});
    const legacy = createPermission({});
    Object.defineProperties(allowed, {
      retrievePermissionAction: {
        value: async () => ({
          key: 'test:controller#select',
          allowed: true,
          matcher: { mode: 'all' },
        }),
      },
    });
    Object.defineProperties(denied, {
      retrievePermissionAction: {
        value: async () => ({
          key: 'test:controller#select',
          allowed: false,
          matcher: { mode: 'all' },
        }),
      },
    });
    Object.defineProperties(legacy, {
      retrievePermissionAction: { value: async () => true },
    });

    assert.equal(await allowed.checkPermissionAction('test:resource' as never, 'select'), true);
    assert.equal(await denied.checkPermissionAction('test:resource' as never, 'select'), false);
    assert.equal(await legacy.checkPermissionAction('test:resource' as never, 'select'), true);
  });
});
