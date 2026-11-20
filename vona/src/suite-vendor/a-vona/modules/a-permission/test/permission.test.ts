import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type { IRbacActionDescriptor, IRbacPolicyDecision } from 'vona-module-a-rbac';
import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { beanFullNameFromOnionName } from 'vona';
import { getRbacDecision, setRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';

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
const BeanFullNameGuardRoleName = beanFullNameFromOnionName('a-user:roleName', 'guard');

function createQueryScopePermission(
  options: {
    roleName?: string;
    roleAllowed?: boolean;
    dataScope?: boolean;
    guard?: (ctx: any, action: IRbacActionDescriptor) => boolean | Promise<boolean>;
  } = {},
) {
  const effectiveOptions: Record<string, unknown> = options.roleName
    ? { name: options.roleName }
    : { dataScope: options.dataScope ?? true };
  const route = {
    controllerBeanFullName: 'test:controller',
    action: 'select',
    routePathRaw: '/test/controller/select',
    route: {
      meta: {
        [options.roleName ? BeanFullNameGuardRoleName : BeanFullNameGuardRbac]: {
          ...effectiveOptions,
        },
      },
    },
  } as unknown as ContextRoute;
  const action: IRbacActionDescriptor = {
    actionKey: 'test:controller#select',
    actionInheritKey: 'test:controller#read',
    controllerBeanFullName: route.controllerBeanFullName,
    action: route.action,
    route,
    options: { dataScope: options.dataScope ?? true },
  };
  const ctx = { route: { action: 'parent' }, innerAccess: true } as any;
  const calls: string[] = [];
  const where = { departmentId: { _in_: ['department-1'] } };
  const bean = {
    onion: {
      guard: {
        getOnionOptionsDynamic: (name: string) => {
          assert.equal(name, options.roleName ? 'a-user:roleName' : 'a-rbac:rbac');
          assert.equal(ctx.route, route);
          return effectiveOptions;
        },
        compose: () => async () => {
          calls.push('guards');
          assert.equal(ctx.route, route);
          assert.equal(ctx.innerAccess, false);
          assert.equal(Object.hasOwn(ctx, SymbolRbacDecision), false);
          if (options.guard) return await options.guard(ctx, action);
          if (!options.roleName) {
            setRbacDecision(ctx, {
              allowed: true,
              actionKey: action.actionKey,
              action,
              terms: [{ dataScope: 'ownDepartment', departmentIds: ['department-1'] }],
            });
          }
          return true;
        },
      },
      checkOnionOptionsEnabled: (effective: Record<string, unknown>, selector: string) => {
        assert.equal(effective, effectiveOptions);
        assert.equal(selector, route.routePathRaw);
        return effective.enable !== false;
      },
    },
    passport: {
      isAuthenticated: true,
      isAccountActive: true,
      isActivated: true,
      checkRoleName: (name: string) => {
        calls.push(`role:${name}`);
        return options.roleAllowed ?? true;
      },
    },
    rbacCatalog: { getAction: () => action },
    rbacScope: {
      current: async (actionKey: string) => {
        calls.push(`current:${actionKey}`);
        assert.equal(actionKey, action.actionKey);
        assert.equal(getRbacDecision(ctx)?.action, action);
        return {
          where: () => {
            calls.push('where');
            return where;
          },
        };
      },
    },
  };
  const permission = Object.create(BeanPermission.prototype) as BeanPermission;
  const app = {
    meta: {},
    bean: { ...bean, permission },
    throw: (code: number): never => {
      throw Object.assign(new Error('forbidden'), { code });
    },
  };
  Object.defineProperties(permission, {
    app: { value: app },
    bean: { value: bean },
    ctx: { value: ctx },
  });
  return { permission, ctx, route, action, effectiveOptions, calls, where };
}

describe('permission.test.ts', { concurrency: false }, () => {
  it('authorizes only distinct referenced relation bindings and preserves unrestricted own entries', async () => {
    const permission = createPermission({});
    const calls: unknown[] = [];
    const where = { userIdOwner: 'owner-1' };
    Object.defineProperties(permission, {
      authorizeControllerActionQueryScope: {
        value: async (controller: string, action: string) => {
          calls.push([controller, action]);
          return controller === 'test:records' ? where : undefined;
        },
      },
      $logger: { value: { debug: () => {} } },
    });
    const bindings = {
      records: { controller: 'test:records', action: 'select' },
      other: { controller: 'test:other', action: 'list' },
    };
    Object.defineProperty(bindings, 'unused', {
      get: () => {
        throw new Error('Unused bindings must not be inspected');
      },
    });
    assert.equal(await permission.authorizeQueryRelations(undefined, bindings), undefined);
    assert.equal(
      await permission.authorizeQueryRelations({ field: 'name', op: 'eq', value: 'A' }, bindings),
      undefined,
    );
    assert.deepEqual(calls, []);
    const scopes = await permission.authorizeQueryRelations(
      {
        and: [
          { relation: 'records', op: 'exists' },
          {
            or: [
              { not: { relation: 'other', op: 'notExists' } },
              { relation: 'records', op: 'notExists' },
            ],
          },
        ],
      },
      bindings,
    );
    assert.deepEqual(calls, [
      ['test:records', 'select'],
      ['test:other', 'list'],
    ]);
    assert.deepEqual(scopes, { records: where, other: undefined });
    assert.equal(Object.hasOwn(scopes!, 'other'), true);
    assert.equal(scopes!.records, where);
  });

  it('rejects absent, inherited or malformed relation bindings before authorization', async () => {
    const permission = createPermission({});
    const calls: unknown[] = [];
    Object.defineProperty(permission, 'authorizeControllerActionQueryScope', {
      value: async (...args: unknown[]) => {
        calls.push(args);
      },
    });
    const binding = { controller: 'test:controller', action: 'select' };
    for (const bindings of [
      {},
      Object.create({ missing: binding }),
      { missing: undefined },
      { missing: {} },
      { missing: { controller: '', action: 'select' } },
      { missing: { controller: 'test:controller', action: '' } },
    ]) {
      await assert.rejects(
        () =>
          permission.authorizeQueryRelations(
            {
              and: [
                { relation: 'valid', op: 'exists' },
                { relation: 'missing', op: 'notExists' },
              ],
            },
            Object.assign(bindings, { valid: binding }),
          ),
        { name: 'TypeError', message: /missing.*explicit action binding/ },
      );
    }
    assert.deepEqual(calls, []);
  });

  it('propagates relation authorization denial without substituting an empty scope', async () => {
    const permission = createPermission({});
    const denied = Object.assign(new Error('forbidden'), { code: 403 });
    Object.defineProperty(permission, 'authorizeControllerActionQueryScope', {
      value: async () => {
        throw denied;
      },
    });
    await assert.rejects(
      () =>
        permission.authorizeQueryRelations(
          { not: { relation: 'records', op: 'notExists' } },
          { records: { controller: 'test:records', action: 'select' } },
        ),
      error => error === denied,
    );
  });

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

  it('authorizes systemAdmin query scopes and rejects denied or short-circuited role checks', async () => {
    const allowed = createQueryScopePermission({ roleName: 'systemAdmin' });
    assert.deepEqual(
      await (allowed.permission as any)._evaluatePermissionAction(allowed.route, 'queryScope'),
      { where: undefined },
    );
    assert.deepEqual(allowed.calls, ['guards', 'role:systemAdmin']);

    const denied = createQueryScopePermission({
      roleName: 'systemAdmin',
      guard: () => false,
    });
    await assert.rejects(
      () => (denied.permission as any)._evaluatePermissionAction(denied.route, 'queryScope'),
      { code: 403 },
    );
    assert.deepEqual(denied.calls, ['guards']);

    // A preceding guard may return true without ever executing the role guard.
    const bypassed = createQueryScopePermission({ roleName: 'systemAdmin', roleAllowed: false });
    await assert.rejects(
      () => (bypassed.permission as any)._evaluatePermissionAction(bypassed.route, 'queryScope'),
      { code: 403 },
    );
    assert.deepEqual(bypassed.calls, ['guards', 'role:systemAdmin']);
  });

  it('returns only the trusted RBAC scope where for a fresh matching decision', async () => {
    const fixture = createQueryScopePermission({});
    const result = await (fixture.permission as any)._evaluatePermissionAction(
      fixture.route,
      'queryScope',
    );

    assert.deepEqual(result, { where: fixture.where });
    assert.equal(result.where, fixture.where);
    assert.deepEqual(fixture.calls, ['guards', `current:${fixture.action.actionKey}`, 'where']);
    assert.equal(Object.hasOwn(fixture.ctx, SymbolRbacDecision), false);
  });

  it('allows admission-only RBAC without terms or scope materialization', async () => {
    const fixture = createQueryScopePermission({
      dataScope: false,
      guard: (ctx, action) => {
        setRbacDecision(ctx, { allowed: true, actionKey: action.actionKey, action });
        return true;
      },
    });

    assert.deepEqual(
      await (fixture.permission as any)._evaluatePermissionAction(fixture.route, 'queryScope'),
      { where: undefined },
    );
    assert.deepEqual(fixture.calls, ['guards']);
  });

  it('rejects missing, denied, or mismatched RBAC decisions before reading scope', async () => {
    const decisions: Array<(action: IRbacActionDescriptor) => IRbacPolicyDecision | undefined> = [
      () => undefined,
      action => ({ allowed: false, actionKey: action.actionKey, action }),
      action => ({ allowed: true, actionKey: 'other:controller#select', action }),
      action => ({
        allowed: true,
        actionKey: action.actionKey,
        action: { ...action, actionInheritKey: 'other:controller#read' },
      }),
      action => ({
        allowed: true,
        actionKey: action.actionKey,
        action: { ...action, controllerBeanFullName: 'other:controller' },
      }),
    ];
    for (const makeDecision of decisions) {
      const fixture = createQueryScopePermission({
        guard: (ctx, action) => {
          const decision = makeDecision(action);
          if (decision) setRbacDecision(ctx, decision);
          return true;
        },
      });
      // Even a matching parent decision must not authorize a skipped guard.
      const parentDecision: IRbacPolicyDecision = {
        allowed: true,
        actionKey: fixture.action.actionKey,
        action: fixture.action,
        terms: [{ dataScope: 'all' }],
      };
      setRbacDecision(fixture.ctx, parentDecision);

      await assert.rejects(
        () => (fixture.permission as any)._evaluatePermissionAction(fixture.route, 'queryScope'),
        { code: 403 },
      );
      assert.deepEqual(fixture.calls, ['guards']);
      assert.equal(getRbacDecision(fixture.ctx), parentDecision);
    }
  });

  it('restores exact parent context descriptors after query-scope success or failure', async () => {
    const failure = new Error('guard failure');
    for (const outcome of ['allowed', 'denied', 'throws'] as const) {
      const fixture = createQueryScopePermission({
        guard: (ctx, action) => {
          setRbacDecision(ctx, { allowed: true, actionKey: action.actionKey, action });
          if (outcome === 'throws') throw failure;
          return outcome === 'allowed';
        },
      });
      const parentDecision: IRbacPolicyDecision = {
        allowed: true,
        actionKey: 'parent:controller#select',
        action: { ...fixture.action, actionKey: 'parent:controller#select' },
        terms: [{ dataScope: 'all' }],
      };
      Object.defineProperty(fixture.ctx, SymbolRbacDecision, {
        value: parentDecision,
        configurable: true,
        enumerable: false,
        writable: false,
      });
      Object.defineProperty(fixture.ctx, 'route', { enumerable: false });
      Object.defineProperty(fixture.ctx, 'innerAccess', { enumerable: false });
      const descriptors = Object.getOwnPropertyDescriptors(fixture.ctx);
      const evaluate = () =>
        (fixture.permission as any)._evaluatePermissionAction(fixture.route, 'queryScope');

      if (outcome === 'allowed') {
        assert.equal((await evaluate()).where, fixture.where);
      } else {
        await assert.rejects(evaluate, outcome === 'throws' ? failure : { code: 403 });
      }
      assert.deepEqual(Object.getOwnPropertyDescriptors(fixture.ctx), descriptors);
      assert.equal(getRbacDecision(fixture.ctx), parentDecision);
    }
  });

  it('fails query scopes closed for unsupported, mixed, or disabled authorization', async () => {
    const unsupported = createQueryScopePermission({});
    unsupported.route.route.meta = {};
    const mixed = createQueryScopePermission({});
    mixed.route.route.meta![BeanFullNameGuardRoleName] = { name: 'systemAdmin' };
    const wrongRole = createQueryScopePermission({ roleName: 'authenticated' });
    const disabled = createQueryScopePermission({});
    disabled.effectiveOptions.enable = false;
    const nonRejecting = createQueryScopePermission({});
    nonRejecting.effectiveOptions.rejectWhenDismatched = false;

    for (const fixture of [unsupported, mixed, wrongRole, disabled, nonRejecting]) {
      await assert.rejects(
        () => (fixture.permission as any)._evaluatePermissionAction(fixture.route, 'queryScope'),
        { code: 403 },
      );
      assert.deepEqual(fixture.calls, []);
      assert.deepEqual(fixture.ctx, { route: { action: 'parent' }, innerAccess: true });
    }
  });

  it('rejects effective RBAC options that conflict with catalog scope or inheritance', async () => {
    for (const override of [
      { dataScope: false },
      { dataScopeField: 'otherDepartmentId' },
      { dataScopeMineField: 'otherOwnerId' },
      { actionInherit: 'other' },
    ]) {
      const fixture = createQueryScopePermission({});
      Object.assign(fixture.effectiveOptions, override);

      await assert.rejects(
        () => (fixture.permission as any)._evaluatePermissionAction(fixture.route, 'queryScope'),
        { code: 403 },
      );
      assert.deepEqual(fixture.calls, []);
    }
  });

  it('rejects missing routes and failed admission through the public query-scope helper', async () => {
    const missing = createQueryScopePermission({});
    await assert.rejects(
      () => missing.permission.authorizeControllerActionQueryScope('test:unregistered', 'select'),
      { code: 403 },
    );
    assert.deepEqual(missing.calls, []);

    for (const authenticated of [false, true]) {
      const fixture = createQueryScopePermission({ guard: () => false });
      Object.defineProperty(fixture.permission, '_getRegisteredControllerActionRoute', {
        value: (controller: string, actionKey: string) => {
          assert.equal(controller, 'test:controller');
          assert.equal(actionKey, 'select');
          return fixture.route;
        },
      });
      const bean = (fixture.permission as any).bean;
      bean.passport.isAuthenticated = authenticated;
      bean.executor = {
        // Only exercise helper delegation here; real newCtx/guard coverage lives with Student.
        newCtx: async (next: () => Promise<unknown>, options: unknown) => {
          assert.deepEqual(options, { innerAccess: false });
          return await next();
        },
      };
      await assert.rejects(
        () => fixture.permission.authorizeControllerActionQueryScope('test:controller', 'select'),
        { code: 403 },
      );
      assert.deepEqual(fixture.calls, authenticated ? ['guards'] : []);
      assert.deepEqual(fixture.ctx, { route: { action: 'parent' }, innerAccess: true });
    }
  });

  it('keeps guardsOnly boolean evaluation separate from RBAC scope projection', async () => {
    const fixture = createQueryScopePermission({});
    assert.equal(
      await (fixture.permission as any)._evaluatePermissionAction(fixture.route, true),
      true,
    );
    assert.deepEqual(fixture.calls, ['guards']);
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
