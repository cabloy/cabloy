import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type { IRbacPolicyDecision } from 'vona-module-a-rbac';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { beanFullNameFromOnionName } from 'vona';
import { getRbacDecision, setRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';

import { BeanPermission } from '../src/bean/bean.permission.ts';

function createPermission(options: {
  instanceName?: string;
  userId?: string;
  roleIds?: Array<string | number>;
}) {
  const permission = Object.create(BeanPermission.prototype) as BeanPermission;
  Object.defineProperties(permission, {
    ctx: {
      value: {
        instanceName: options.instanceName,
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

describe('permission.test.ts', { concurrency: false }, () => {
  it('normalizes role cache keys and isolates them by instance', () => {
    const first = createPermission({
      instanceName: 'instance-a',
      userId: 'user-1',
      roleIds: ['role-b', 'role-a', 'role-a'],
    });
    const sameRolesDifferentOrder = createPermission({
      instanceName: 'instance-a',
      userId: 'user-2',
      roleIds: ['role-a', 'role-b'],
    });
    const otherInstance = createPermission({
      instanceName: 'instance-b',
      userId: 'user-1',
      roleIds: ['role-a', 'role-b'],
    });

    const info = cacheInfo('training-student:student', 'select');
    assert.equal(
      (first as any).retrievePermissionActionByRolesCacheKey(info),
      'action:training-student:student:select:instance:instance-a:roles:role-a,role-b',
    );
    assert.equal(
      (first as any).retrievePermissionActionByRolesCacheKey(info),
      (sameRolesDifferentOrder as any).retrievePermissionActionByRolesCacheKey(info),
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByRolesCacheKey(info),
      (otherInstance as any).retrievePermissionActionByRolesCacheKey(info),
    );
  });

  it('keeps role and user action cache identities distinct', () => {
    const permission = createPermission({
      instanceName: 'instance-a',
      userId: 'user-1',
      roleIds: ['role-a'],
    });
    const info = cacheInfo('training-student:student', 'select');

    assert.notEqual(
      (permission as any).retrievePermissionActionByRolesCacheKey(info),
      (permission as any).retrievePermissionActionByUserCacheKey(info),
    );
  });

  it('isolates RBAC action cache keys by user, roles, and instance', () => {
    const first = createPermission({
      instanceName: 'instance-a',
      userId: 'user-1',
      roleIds: ['role-a'],
    });
    const otherUser = createPermission({
      instanceName: 'instance-a',
      userId: 'user-2',
      roleIds: ['role-a'],
    });
    const changedRoles = createPermission({
      instanceName: 'instance-a',
      userId: 'user-1',
      roleIds: ['role-b'],
    });
    const otherInstance = createPermission({
      instanceName: 'instance-b',
      userId: 'user-1',
      roleIds: ['role-a'],
    });

    const info = cacheInfo('training-student:student', 'select');
    assert.equal(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      'action:training-student:student:select:instance:instance-a:user:user-1:roles:role-a',
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      (otherUser as any).retrievePermissionActionByUserCacheKey(info),
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      (changedRoles as any).retrievePermissionActionByUserCacheKey(info),
    );
    assert.notEqual(
      (first as any).retrievePermissionActionByUserCacheKey(info),
      (otherInstance as any).retrievePermissionActionByUserCacheKey(info),
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
      await permission.retrievePermissionAction('training-student:student', 'ordinary'),
      false,
    );
    assert.equal(
      await permission.retrievePermissionAction('training-student:student', 'rbac'),
      true,
    );
    assert.deepEqual(calls, ['roles', 'user']);
  });

  it('isolates resource permission snapshots by user and instance', () => {
    const first = createPermission({ instanceName: 'instance-a', userId: 'user-1' });
    const otherUser = createPermission({ instanceName: 'instance-a', userId: 'user-2' });
    const otherInstance = createPermission({ instanceName: 'instance-b', userId: 'user-1' });
    const info = cacheInfo('training-student:student');

    assert.equal(
      (first as any).retrievePermissionsCacheKey(info),
      'user:training-student:student:instance:instance-a:user:user-1',
    );
    assert.notEqual(
      (first as any).retrievePermissionsCacheKey(info),
      (otherUser as any).retrievePermissionsCacheKey(info),
    );
    assert.notEqual(
      (first as any).retrievePermissionsCacheKey(info),
      (otherInstance as any).retrievePermissionsCacheKey(info),
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

    assert.equal(await allowed.checkPermissionAction('training-student:student', 'select'), true);
    assert.equal(await denied.checkPermissionAction('training-student:student', 'select'), false);
    assert.equal(await legacy.checkPermissionAction('training-student:student', 'select'), true);
  });
});
