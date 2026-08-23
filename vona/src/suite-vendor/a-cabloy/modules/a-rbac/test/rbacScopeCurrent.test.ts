import type { VonaContext } from 'vona';
import type { TypeModelWhere } from 'vona-module-a-orm';

import assert from 'node:assert';
import { describe, it } from 'node:test';

import type {
  IRbacActionDescriptor,
  IRbacPolicyDecision,
  IRbacScopeTerm,
} from '../src/types/rbac.ts';
import type { IRbacScopeAdapter } from '../src/types/scope.ts';

import { BeanRbacScope } from '../src/bean/bean.rbacScope.ts';
import { getRbacDecision, setRbacDecision } from '../src/lib/rbac.ts';

function createAction(action = 'select'): IRbacActionDescriptor {
  const controllerBeanFullName = 'test:controller';
  return {
    actionKey: `${controllerBeanFullName}#${action}`,
    controllerBeanFullName,
    action,
    route: { controllerBeanFullName, action } as never,
    options: { dataScope: true },
  };
}

function createDecision(
  action: IRbacActionDescriptor,
  terms: IRbacScopeTerm[],
): IRbacPolicyDecision {
  return { allowed: true, actionKey: action.actionKey, action, terms };
}

function createScope(
  action: IRbacActionDescriptor,
  adapter: IRbacScopeAdapter = {
    isUnrestricted: async () => {
      throw new Error('current() must not recheck unrestricted status');
    },
    ownerValues: async () => ({ departmentId: 'department-1', userIdOwner: 'user-1' }),
  },
): { scope: BeanRbacScope; ctx: VonaContext } {
  const ctx = { route: action.route } as VonaContext;
  const app = {
    throw(status: number, message?: string): never {
      const error = new Error(message ?? `status ${status}`) as Error & { code?: number };
      error.code = status;
      throw error;
    },
  };
  const scope = Object.create(BeanRbacScope.prototype) as BeanRbacScope;
  Object.defineProperties(scope, {
    app: { value: app },
    bean: {
      value: {
        rbacCatalog: {
          getCatalog: () => new Map([[action.actionKey, action]]),
        },
      },
    },
    ctx: { value: ctx },
    _scopeAdapter: { value: adapter, writable: true },
  });
  return { scope, ctx };
}

async function assertForbidden(callback: () => Promise<unknown>): Promise<void> {
  await assert.rejects(callback, error => (error as { code?: number }).code === 403);
}

describe('rbacScopeCurrent.test.ts', { concurrency: false }, () => {
  it('consumes a stored all decision without rechecking the adapter', async () => {
    const action = createAction();
    const { scope, ctx } = createScope(action);
    const decision = createDecision(action, [{ dataScope: 'all' }]);
    setRbacDecision(ctx, decision);

    const access = await scope.current();
    const callerWhere = { name: 'visible' } as TypeModelWhere<any>;
    assert.equal(access.unrestricted, true);
    assert.deepEqual(access.permissionProjection(), {
      key: action.actionKey,
      allowed: true,
      matcher: { mode: 'all' },
    });
    assert.equal(access.decision, decision);
    assert.deepEqual(access.where(callerWhere), callerWhere);
    access.checkEntry({ departmentId: 'other' });
    access.checkEntries([{ departmentId: 'one' }, { departmentId: 'two' }]);
  });

  it('does not expose the decision to a child context sharing caller state', () => {
    const action = createAction();
    const ctx = { route: action.route, state: {} } as VonaContext;
    const childCtx = { route: action.route, state: ctx.state } as VonaContext;
    const decision = createDecision(action, [{ dataScope: 'all' }]);

    setRbacDecision(ctx, decision);

    assert.equal(getRbacDecision(ctx), decision);
    assert.equal(getRbacDecision(childCtx), undefined);
  });

  it('applies restricted terms as predicates and row checks', async () => {
    const action = createAction();
    const { scope, ctx } = createScope(action);
    setRbacDecision(ctx, createDecision(action, [{ dataScope: 'mine', ownerId: 'user-1' }]));

    const access = await scope.current();
    assert.equal(access.unrestricted, false);
    assert.deepEqual(access.permissionProjection(), {
      key: action.actionKey,
      allowed: true,
      matcher: { mode: 'any', rules: [{ field: 'userIdOwner', values: ['user-1'] }] },
    });
    assert.deepEqual(access.where(), { userIdOwner: 'user-1' });
    assert.deepEqual(access.where({ level: 1 } as TypeModelWhere<any>), {
      _and_: { _and_: { level: 1 }, _and_0: { userIdOwner: 'user-1' } },
    });
    access.checkEntry({ userIdOwner: 'user-1' });
    assert.throws(
      () => access.checkEntry({ userIdOwner: 'user-2' }),
      error => {
        return (error as { code?: number }).code === 403;
      },
    );
    assert.throws(
      () => access.checkEntries([{ userIdOwner: 'user-1' }, { userIdOwner: 'user-2' }]),
      error => {
        return (error as { code?: number }).code === 403;
      },
    );
  });

  it('rejects missing, denied, and action-mismatched decisions', async () => {
    const action = createAction();
    const { scope, ctx } = createScope(action);
    await assertForbidden(() => scope.current());

    setRbacDecision(ctx, { ...createDecision(action, [{ dataScope: 'all' }]), allowed: false });
    await assertForbidden(() => scope.current());

    const otherAction = createAction('view');
    setRbacDecision(ctx, createDecision(otherAction, [{ dataScope: 'all' }]));
    await assertForbidden(() => scope.current());
  });

  it('derives create owner values from the configured adapter', async () => {
    const action = createAction('create');
    const adapter: IRbacScopeAdapter = {
      isUnrestricted: async () => false,
      ownerValues: async () => ({ departmentId: 'department-1', userIdOwner: 'user-1' }),
    };
    const { scope, ctx } = createScope(action, adapter);
    setRbacDecision(
      ctx,
      createDecision(action, [{ dataScope: 'ownDepartment', departmentIds: ['department-1'] }]),
    );

    const access = await scope.current();
    assert.deepEqual(access.permissionProjection(), {
      key: action.actionKey,
      allowed: true,
      matcher: { mode: 'any', rules: [{ field: 'departmentId', values: ['department-1'] }] },
    });
    assert.deepEqual(access.ownerValues(), {
      departmentId: 'department-1',
      userIdOwner: 'user-1',
    });
  });
});
