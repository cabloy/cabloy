import type { IRbacPolicyDecision } from 'vona-module-a-rbac';
import type { IPassport } from 'vona-module-a-user';

import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import {
  getRbacDecision,
  GuardRbac,
  setRbacDecision,
  SymbolRbacDecision,
} from 'vona-module-a-rbac';

describe('permission.test.ts', { concurrency: false }, () => {
  let release: (() => void) | undefined;
  before(async () => {
    release = await acquireTestLock('mcp-test');
  });
  after(() => release?.());

  it('checks fresh guards without terms, retrieval events or matcher projection', async t => {
    if (!app.meta.modules['training-student']) {
      t.skip('training-student is not active');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      const userId = 'permission-guards-policy-user';
      const context = app.ctx;
      app.ctx.state.passport = {
        user: {
          id: userId,
          name: 'Permission policy fixture',
          activated: true,
          accountStatus: 'active',
        },
        roles: [],
      } as IPassport;
      const permission = app.bean.permission;
      const controller = 'training-student.controller.student';
      const action = app.bean.rbacCatalog.getCatalog().get(`${controller}#lookup`);
      assert.ok(action);
      assert.equal(action.actionInheritKey, `${controller}#select`);
      assert.equal(Boolean(action.options.dataScope), false);
      let allowed = true;
      const policyCalls: string[] = [];
      const off = app.scope('a-rbac').event.resolvePolicy.on((request, next) => {
        if (
          app.ctx !== context ||
          String(app.bean.passport.currentUser?.id) !== userId ||
          request.action.controllerBeanFullName !== controller
        ) {
          return next();
        }
        policyCalls.push(request.policyActionKey);
        return {
          allowed,
          actionKey: request.action.actionKey,
          action: request.action,
        };
      });
      const retrieval = t.mock.method(permission, 'retrievePermissionAction', async () => {
        throw new Error('guard-only checks must not retrieve cached permissions');
      });
      const offRetrieval = app.scope('a-permission').event.retrievePermissionAction.on(() => {
        throw new Error('guard-only checks must not emit permission retrieval events');
      });
      try {
        // Preserve the existing projection contract: a no-terms decision still denies there.
        assert.equal(await (permission as any)._evaluatePermissionAction(action.route), false);
        const projection = t.mock.method(app.bean.rbacScope, 'current', async () => {
          throw new Error('guard-only checks must not project a matcher');
        });
        try {
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            true,
          );
          allowed = false;
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            false,
          );
          allowed = true;
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            true,
          );
          assert.equal(projection.mock.callCount(), 0);
          assert.equal(retrieval.mock.callCount(), 0);
          assert.deepEqual(policyCalls, Array.from({ length: 4 }).fill(`${controller}#select`));
          assert.equal(
            await permission.checkPermissionActionGuards(
              'training-student:student',
              'unregistered',
            ),
            false,
          );
          assert.equal(
            await permission.checkPermissionActionGuards('unknown:resource' as never, 'lookup'),
            false,
          );
          assert.equal(
            await permission.checkPermissionActionGuards('toString' as never, 'lookup'),
            false,
          );
          assert.equal(policyCalls.length, 4);
          app.ctx.state.passport = undefined;
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            false,
          );
          assert.equal(policyCalls.length, 4, 'Passport admission precedes policy evaluation');
        } finally {
          projection.mock.restore();
        }
      } finally {
        off();
        offRetrieval();
        retrieval.mock.restore();
      }
    });
  });

  it('requires a current allow decision bound to the catalog Action even when a guard is skipped', async t => {
    if (!app.meta.modules['training-student']) {
      t.skip('training-student is not active');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      app.ctx.state.passport = {
        user: {
          id: 'permission-guards-binding-user',
          name: 'Permission binding fixture',
          activated: true,
          accountStatus: 'active',
        },
        roles: [],
      } as IPassport;
      const permission = app.bean.permission;
      const action = app.bean.rbacCatalog
        .getCatalog()
        .get('training-student.controller.student#lookup');
      assert.ok(action);
      const decision: IRbacPolicyDecision = { allowed: true, actionKey: action.actionKey, action };
      const guard = app.bean._getBean(GuardRbac);
      let currentDecision: IRbacPolicyDecision | undefined;
      const composedGuard = t.mock.method(guard, 'execute', async () => {
        assert.equal(getRbacDecision(app.ctx), undefined);
        if (currentDecision) setRbacDecision(app.ctx, currentDecision);
        return true;
      });
      try {
        setRbacDecision(app.ctx, decision);
        assert.equal(
          await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
          false,
        );
        assert.equal(
          getRbacDecision(app.ctx),
          decision,
          'a stale outer decision is restored, not reused',
        );
        for (const invalid of [
          { ...decision, allowed: false },
          { ...decision, actionKey: action.actionInheritKey! },
          { ...decision, action: undefined as never },
          { ...decision, action: { ...action, actionKey: action.actionInheritKey! } },
          { ...decision, action: { ...action, controllerBeanFullName: 'other.controller' } },
          { ...decision, action: { ...action, action: 'summary' } },
          { ...decision, action: { ...action, actionInheritKey: undefined } },
        ]) {
          currentDecision = invalid;
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            false,
          );
          assert.equal(getRbacDecision(app.ctx), decision);
        }
        currentDecision = decision;
        assert.equal(
          await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
          true,
        );
        const catalog = t.mock.method(app.bean.rbacCatalog, 'getAction', () => undefined);
        try {
          assert.equal(
            await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
            false,
          );
        } finally {
          catalog.mock.restore();
        }
      } finally {
        composedGuard.mock.restore();
      }
    });
  });

  it('restores exact context own state after guard success, denial and unexpected failures', async t => {
    if (!app.meta.modules['training-student']) {
      t.skip('training-student is not active');
      return;
    }
    await app.bean.executor.mockCtx(async () => {
      app.ctx.state.passport = {
        user: {
          id: 'permission-guards-restore-user',
          name: 'Permission restoration fixture',
          activated: true,
          accountStatus: 'active',
        },
        roles: [],
      } as IPassport;
      const ctx = app.ctx;
      const permission = app.bean.permission;
      const action = app.bean.rbacCatalog
        .getCatalog()
        .get('training-student.controller.student#lookup');
      assert.ok(action);
      const decision: IRbacPolicyDecision = { allowed: true, actionKey: action.actionKey, action };
      const guard = app.bean._getBean(GuardRbac);
      const failure = new Error('unexpected guard failure');
      let outcome: true | false | Error = true;
      const composedGuard = t.mock.method(guard, 'execute', async () => {
        assert.equal(ctx.route, action.route);
        assert.equal(ctx.innerAccess, false);
        assert.equal(getRbacDecision(ctx), undefined);
        setRbacDecision(ctx, decision);
        if (outcome instanceof Error) throw outcome;
        return outcome;
      });
      try {
        for (const state of ['absent', 'undefined', 'value']) {
          delete (ctx as any).route;
          delete ctx[SymbolRbacDecision];
          delete (ctx as any).innerAccess;
          ctx.innerAccess = true; // exercise Vona's inherited accessor as well as own values
          if (state !== 'absent') {
            Object.defineProperty(ctx, 'route', {
              value: state === 'value' ? action.route : undefined,
              configurable: true,
              writable: true,
            });
            Object.defineProperty(ctx, 'innerAccess', {
              value: state === 'value' ? true : undefined,
              configurable: true,
              writable: true,
            });
            Object.defineProperty(ctx, SymbolRbacDecision, {
              value: state === 'value' ? decision : undefined,
              configurable: true,
              writable: true,
            });
          }
          const routePrevious = Object.getOwnPropertyDescriptor(ctx, 'route');
          const innerAccessPrevious = Object.getOwnPropertyDescriptor(ctx, 'innerAccess');
          const decisionPrevious = Object.getOwnPropertyDescriptor(ctx, SymbolRbacDecision);
          const innerAccessValuePrevious = ctx.innerAccess;
          for (const result of [
            true,
            false,
            Object.assign(new Error('unauthorized'), { code: 401 }),
            Object.assign(new Error('forbidden'), { code: 403 }),
            failure,
          ]) {
            outcome = result;
            if (result === failure) {
              await assert.rejects(
                () => permission.checkPermissionActionGuards('training-student:student', 'lookup'),
                error => error === failure,
              );
            } else {
              assert.equal(
                await permission.checkPermissionActionGuards('training-student:student', 'lookup'),
                result === true,
              );
            }
            assert.deepEqual(Object.getOwnPropertyDescriptor(ctx, 'route'), routePrevious);
            assert.deepEqual(
              Object.getOwnPropertyDescriptor(ctx, 'innerAccess'),
              innerAccessPrevious,
            );
            assert.deepEqual(
              Object.getOwnPropertyDescriptor(ctx, SymbolRbacDecision),
              decisionPrevious,
            );
            assert.equal(ctx.innerAccess, innerAccessValuePrevious);
          }
        }
      } finally {
        composedGuard.mock.restore();
      }
    });
  });
});
