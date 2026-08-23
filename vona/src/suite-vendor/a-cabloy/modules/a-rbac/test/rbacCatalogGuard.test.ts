import type { VonaContext } from 'vona';
import type { ContextRoute } from 'vona-module-a-web';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { appMetadata, beanFullNameFromOnionName } from 'vona';
import { SymbolUseOnionOptions } from 'vona-module-a-onion';
import { Passport } from 'vona-module-a-user';
import { getCacheControllerRoutes } from 'vona-module-a-web';

import type {
  IRbacActionDescriptor,
  IRbacPolicyDecision,
  IRbacPolicyRequest,
} from '../src/types/rbac.ts';

import { BeanRbacCatalog } from '../src/bean/bean.rbacCatalog.ts';
import { BeanRbacScope } from '../src/bean/bean.rbacScope.ts';
import { GuardRbac } from '../src/bean/guard.rbac.ts';
import {
  createRbacCapability,
  getRbacDecision,
  isRbacCapability,
  rbacActionKey,
  setRbacDecision,
} from '../src/lib/rbac.ts';

const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');

interface ITestApp {
  meta: object;
}

function createApp(routes: ContextRoute[]): ITestApp {
  const app: ITestApp = { meta: {} };
  const routesByController = getCacheControllerRoutes(app as never);
  for (const route of routes) {
    (routesByController[route.controllerBeanFullName] ??= []).push(route);
  }
  return app;
}

function createCatalog(routes: ContextRoute[]): BeanRbacCatalog {
  const catalog = Object.create(BeanRbacCatalog.prototype) as BeanRbacCatalog;
  Object.defineProperty(catalog, 'app', { value: createApp(routes) });
  return catalog;
}

function createRoute(
  controllerBeanFullName: string,
  action: string,
  options?: Record<string, unknown>,
): ContextRoute {
  return {
    controller: class {},
    controllerBeanFullName,
    action,
    actionDescriptor: {},
    route: {
      meta: options ? { [BeanFullNameGuardRbac]: options } : {},
    },
    routeMethod: 'get',
    routePath: `/${controllerBeanFullName}/${action}`,
    routePathRaw: `/${controllerBeanFullName}/${action}`,
    routePathOriginal: action,
  } as ContextRoute;
}

function createDescriptor(action = 'select', actionInheritKey?: string): IRbacActionDescriptor {
  const controllerBeanFullName = 'test:controller';
  return {
    actionKey: rbacActionKey(controllerBeanFullName, action),
    controllerBeanFullName,
    action,
    actionInheritKey,
    route: createRoute(controllerBeanFullName, action, {}),
    options: {},
  };
}

function createScopedGuard(
  action: IRbacActionDescriptor,
  ctx: VonaContext,
): { current: () => Promise<void> } {
  const scope = Object.create(BeanRbacScope.prototype) as { current: () => Promise<void> };
  Object.defineProperties(scope, {
    app: {
      value: {
        throw(status: number): never {
          const error = new Error(`status ${status}`) as Error & { code?: number };
          error.code = status;
          throw error;
        },
      },
    },
    bean: { value: { rbacCatalog: { getCatalog: () => new Map([[action.actionKey, action]]) } } },
    ctx: { value: ctx },
  });
  return scope;
}

function createGuard(
  action: IRbacActionDescriptor,
  decision: IRbacPolicyDecision | undefined,
  unrestricted = false,
  catalogAction: IRbacActionDescriptor | null = action,
  resolverReject?: Error,
): { guard: GuardRbac; request: () => IRbacPolicyRequest | undefined; ctx: VonaContext } {
  let policyRequest: IRbacPolicyRequest | undefined;
  const ctx = { route: action.route } as VonaContext;
  const guard = Object.create(GuardRbac.prototype) as GuardRbac;
  Object.defineProperties(guard, {
    app: {
      value: {
        throw(status: number): never {
          const error = new Error(`status ${status}`) as Error & { code?: number };
          error.code = status;
          throw error;
        },
      },
    },
    bean: {
      value: {
        rbacCatalog: { getAction: () => catalogAction ?? undefined },
        rbacScope: { isUnrestricted: async () => unrestricted },
      },
    },
    ctx: { value: ctx },
    scope: {
      value: {
        event: {
          resolvePolicy: {
            emit: async (request: IRbacPolicyRequest) => {
              policyRequest = request;
              if (resolverReject) throw resolverReject;
              return decision;
            },
          },
        },
      },
    },
  });
  return { guard, request: () => policyRequest, ctx };
}

describe('rbacCatalogGuard.test.ts', { concurrency: false }, () => {
  it('includes explicitly decorated Resource and non-Resource routes only', () => {
    const resource = createRoute('test:resource', 'select', {});
    const nonResource = createRoute('test:command', 'run', {});
    const undecorated = createRoute('test:resource', 'legacy');
    const catalog = createCatalog([resource, nonResource, undecorated]);

    assert.deepEqual(
      [...catalog.getCatalog().keys()],
      ['test:resource#select', 'test:command#run'],
    );
    assert.equal(catalog.getAction(undecorated), undefined);
    assert.equal(catalog.getAction(resource)?.route.routePath, '/test:resource/select');
    assert.equal(rbacActionKey('test:resource', 'select'), 'test:resource#select');
  });

  it('treats an explicit no-options decorator as an action opt-in', () => {
    class Controller {}
    const descriptor = Object.getOwnPropertyDescriptor(Controller.prototype, 'select') ?? {
      value: () => undefined,
      configurable: true,
      writable: true,
    };
    Passport.rbac()(Controller.prototype, 'select', descriptor);
    const metadata = appMetadata.getOwnMetadata<Record<string, unknown>>(
      SymbolUseOnionOptions,
      Controller.prototype,
      'select',
    );
    const route = createRoute('test:decorated', 'select');
    route.controller = Controller;
    route.route.meta = metadata ?? {};

    const catalog = createCatalog([route]);
    assert.deepEqual(catalog.getCatalog().get('test:decorated#select')?.options, {});
  });

  it('rejects class-level RBAC decoration', () => {
    class Controller {}
    assert.throws(() => Passport.rbac()(Controller), /must decorate an action/);
  });

  it('resolves aliases to the terminal same-controller grant identity', () => {
    const controller = 'test:controller';
    const catalog = createCatalog([
      createRoute(controller, 'create', { actionInherit: 'update' }),
      createRoute(controller, 'update', { actionInherit: 'legacy' }),
      createRoute(controller, 'legacy'),
    ]);

    assert.equal(
      catalog.getAction(createRoute(controller, 'create'))?.actionInheritKey,
      `${controller}#legacy`,
    );
    assert.equal(
      catalog.getAction(createRoute(controller, 'update'))?.actionInheritKey,
      `${controller}#legacy`,
    );
    assert.equal(catalog.getAction(createRoute(controller, 'legacy')), undefined);
  });

  it('fails closed for invalid aliases', () => {
    const controller = 'test:controller';
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'missing' }),
        ]).getCatalog(),
      /target not found/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'create' }),
        ]).getCatalog(),
      /cannot reference itself/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'update' }),
          createRoute(controller, 'update', { actionInherit: 'create' }),
        ]).getCatalog(),
      /cycle/,
    );
    assert.throws(
      () =>
        createCatalog([
          createRoute(controller, 'create', { actionInherit: 'update' }),
          createRoute('test:otherController', 'update'),
        ]).getCatalog(),
      /target not found/,
    );
  });

  it('uses terminal aliases for grant lookup and stores only valid decisions', async () => {
    const action = createDescriptor('create', 'test:controller#update');
    const decision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'mine', ownerId: '1' }],
    };
    const { guard, request, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(request()?.policyActionKey, 'test:controller#update');
    assert.deepEqual(getRbacDecision(ctx), decision);
  });

  it('denies malformed policy decisions without storing them', async () => {
    const action = createDescriptor();
    const cases: Array<IRbacPolicyDecision | undefined> = [
      undefined,
      { allowed: true, actionKey: 'test:controller#other', action },
      { allowed: 1 as never, actionKey: action.actionKey, action },
      { allowed: true, actionKey: action.actionKey, action, revision: 1 as never },
      {
        allowed: true,
        actionKey: action.actionKey,
        action: { ...action, actionInheritKey: 'test:controller#other' },
      },
      { allowed: true, actionKey: action.actionKey, action, terms: [] },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'mine' } as never],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'customDepartments' } as never],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'ownDepartment', departmentIds: [] }],
      },
      {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms: [{ dataScope: 'invalid' as never }],
      },
    ];
    for (const decision of cases) {
      const { guard, ctx } = createGuard(action, decision);
      assert.equal(await guard.check({}), false);
      assert.equal(getRbacDecision(ctx), undefined);
    }
  });

  it('stores a canonical action instead of resolver-supplied route details', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action: { ...action, route: undefined as never, options: undefined as never },
    };
    const { guard, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), true);
    assert.equal(getRbacDecision(ctx)?.action.route, action.route);
    assert.deepEqual(getRbacDecision(ctx)?.action.options, action.options);
  });

  it('returns valid deny decisions to GuardBase without retaining authorization state', async () => {
    const action = createDescriptor();
    const decision: IRbacPolicyDecision = { allowed: false, actionKey: action.actionKey, action };
    const { guard, ctx } = createGuard(action, decision);

    assert.equal(await guard.check({}), false);
    assert.equal(getRbacDecision(ctx), undefined);
  });

  it('stores an all-scope decision without resolving policy for unrestricted access', async () => {
    const action = createDescriptor();
    const { guard, request, ctx } = createGuard(action, undefined, true);

    assert.equal(await guard.check({}), true);
    assert.equal(request(), undefined);
    assert.deepEqual(getRbacDecision(ctx), {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'all' }],
    });
  });

  it('clears a prior decision before catalog misses, resolver rejection, invalid results, and deny', async () => {
    const action = createDescriptor();
    const priorDecision: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'all' }],
    };
    const denied = createGuard(action, { ...priorDecision, allowed: false });
    setRbacDecision(denied.ctx, priorDecision);
    assert.equal(await denied.guard.check({}), false);
    assert.equal(getRbacDecision(denied.ctx), undefined);

    const invalid = createGuard(action, undefined);
    setRbacDecision(invalid.ctx, priorDecision);
    assert.equal(await invalid.guard.check({}), false);
    assert.equal(getRbacDecision(invalid.ctx), undefined);

    const resolverRejected = createGuard(
      action,
      undefined,
      false,
      action,
      new Error('resolver failed'),
    );
    setRbacDecision(resolverRejected.ctx, priorDecision);
    await assert.rejects(() => resolverRejected.guard.check({}), /resolver failed/);
    assert.equal(getRbacDecision(resolverRejected.ctx), undefined);

    const missingCatalog = createGuard(action, undefined, false, null);
    setRbacDecision(missingCatalog.ctx, priorDecision);
    assert.equal(await missingCatalog.guard.check({}), false);
    assert.equal(getRbacDecision(missingCatalog.ctx), undefined);
  });

  it('rejects allowed data-scoped decisions without effective terms', async () => {
    const action = { ...createDescriptor(), options: { dataScope: true } };
    for (const terms of [undefined, []]) {
      const { guard, ctx } = createGuard(action, {
        allowed: true,
        actionKey: action.actionKey,
        action,
        terms,
      });
      assert.equal(await guard.check({}), false);
      assert.equal(getRbacDecision(ctx), undefined);
    }
  });

  it('keeps capability values opaque and minimal', () => {
    const capability = createRbacCapability('student.update', true);
    assert.deepEqual(capability, { key: 'student.update', allowed: true });
    assert.equal(isRbacCapability(capability), true);
    assert.equal(isRbacCapability({ key: 'student.update', allowed: true, predicate: {} }), false);
    assert.equal(
      isRbacCapability({ key: 'student.update', allowed: true, departmentIds: ['1'] }),
      false,
    );
    assert.equal(isRbacCapability({ key: '', allowed: true }), false);
    assert.equal(isRbacCapability({ key: 'student.update', allowed: 'yes' }), false);
  });

  it('preserves GuardBase pass and reject options without stale scope state', async () => {
    const action = createDescriptor();
    const allowed: IRbacPolicyDecision = {
      allowed: true,
      actionKey: action.actionKey,
      action,
      terms: [{ dataScope: 'all' }],
    };
    const matched = createGuard(action, allowed);
    let nextCount = 0;
    assert.equal(await matched.guard.execute({}, async () => ++nextCount > 0), true);
    assert.equal(nextCount, 0);

    const matchedFallThrough = createGuard(action, allowed);
    assert.equal(
      await matchedFallThrough.guard.execute(
        { passWhenMatched: false },
        async () => ++nextCount > 0,
      ),
      true,
    );
    assert.equal(nextCount, 1);

    const unmatchedFallThrough = createGuard(action, undefined);
    setRbacDecision(unmatchedFallThrough.ctx, allowed);
    assert.equal(
      await unmatchedFallThrough.guard.execute(
        { rejectWhenDismatched: false },
        async () => ++nextCount > 0,
      ),
      true,
    );
    assert.equal(nextCount, 2);
    assert.equal(getRbacDecision(unmatchedFallThrough.ctx), undefined);
    await assert.rejects(
      () => createScopedGuard(action, unmatchedFallThrough.ctx).current(),
      error => (error as { code?: number }).code === 403,
    );

    const rejected = createGuard(action, undefined);
    await assert.rejects(
      () => rejected.guard.execute({}, async () => true),
      error => (error as { code?: number }).code === 403,
    );
  });
});
