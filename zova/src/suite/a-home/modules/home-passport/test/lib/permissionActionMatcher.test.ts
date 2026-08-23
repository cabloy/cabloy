import type { IOpenapiPermissionActionRbac } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { matchPermissionAction } from '../../src/lib/permissionActionMatcher.js';

const action = (
  matcher: IOpenapiPermissionActionRbac['matcher'],
  allowed = true,
): IOpenapiPermissionActionRbac => ({
  key: 'training-student:student#update',
  allowed,
  matcher,
});

test('matches unrestricted actions without row data', () => {
  assert.equal(matchPermissionAction(action({ mode: 'all' })), true);
  assert.equal(matchPermissionAction(action({ mode: 'all' }), undefined), true);
  assert.equal(matchPermissionAction(action({ mode: 'all' }), [{ id: 1 }, { id: 2 }]), true);
});

test('matches mine and department projections against one row', () => {
  const mine = action({
    mode: 'any',
    rules: [{ field: 'userIdOwner', values: ['42'] }],
  });
  const department = action({
    mode: 'any',
    rules: [{ field: 'departmentId', values: ['7', '8'] }],
  });

  assert.equal(matchPermissionAction(mine, { userIdOwner: 42 }), true);
  assert.equal(matchPermissionAction(mine, { userIdOwner: 43 }), false);
  assert.equal(matchPermissionAction(department, { departmentId: '8' }), true);
  assert.equal(matchPermissionAction(department, { departmentId: '9' }), false);
  assert.equal(matchPermissionAction(department, {}), false);
});

test('requires every selected row to match', () => {
  const permission = action({
    mode: 'any',
    rules: [{ field: 'departmentId', values: ['7', '8'] }],
  });

  assert.equal(
    matchPermissionAction(permission, [{ departmentId: 7 }, { departmentId: '8' }]),
    true,
  );
  assert.equal(
    matchPermissionAction(permission, [{ departmentId: 7 }, { departmentId: 9 }]),
    false,
  );
  assert.equal(matchPermissionAction(permission, []), false);
});

test('denies explicit decisions and malformed matchers', () => {
  assert.equal(matchPermissionAction(action({ mode: 'all' }, false)), false);
  assert.equal(
    matchPermissionAction({ key: 'test', allowed: true, matcher: { mode: 'any', rules: [] } }),
    false,
  );
  assert.equal(
    matchPermissionAction({ key: 'test', allowed: true, matcher: { mode: 'any' } } as any, {
      id: 1,
    }),
    false,
  );
  assert.equal(
    matchPermissionAction(
      {
        key: 'test',
        allowed: true,
        matcher: { mode: 'any', rules: [{ field: 'id', values: [7] }] },
      } as any,
      { id: 7 },
    ),
    false,
  );
});
