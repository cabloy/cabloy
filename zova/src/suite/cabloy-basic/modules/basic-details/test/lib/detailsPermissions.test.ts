import type { IPermissionHintGeneral, TypeOpenapiPermissions } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDetailsPermissionChecker,
  filterDetailsBulkActions,
  filterDetailsRowActions,
} from '../../src/lib/detailsPermissions.js';

test('details permission checker lazily reads the current enclosing Resource projection', () => {
  let permissions: TypeOpenapiPermissions | undefined = true;
  let currentData: Record<string, unknown> = { departmentId: 7 };
  const calls: unknown[][] = [];
  const checkPermission = createDetailsPermissionChecker(
    () => permissions,
    () => currentData,
    (...args) => {
      calls.push(args);
      return true;
    },
  );
  const permissionHint: IPermissionHintGeneral = { actionInherit: 'view' };

  const firstPermissions = permissions;
  const firstCurrentData = currentData;
  assert.equal(checkPermission('grantSystemAdmin', permissionHint), true);
  permissions = false;
  currentData = { departmentId: 8 };
  assert.equal(checkPermission('grantSystemAdmin', permissionHint), true);

  assert.equal(calls.length, 2);
  assert.strictEqual(calls[0][0], firstPermissions);
  assert.strictEqual(calls[1][0], permissions);
  assert.strictEqual(calls[0][3], firstCurrentData);
  assert.strictEqual(calls[1][3], currentData);
  assert.deepEqual(
    calls.map(call => call.slice(1, 3)),
    [
      ['grantSystemAdmin', permissionHint],
      ['grantSystemAdmin', permissionHint],
    ],
  );
  assert.equal(
    calls.every(call => call.length === 4),
    true,
  );
});

test('bulk details actions apply form-scene filtering before the enclosing Resource checker', () => {
  const calls: Array<[string | undefined, IPermissionHintGeneral | undefined]> = [];
  const grantHint = { actionInherit: 'view', formScene: ['view'] };
  const actions = [
    {
      name: 'hiddenInView',
      render: 'test:hiddenInView',
      options: { permission: { formScene: ['edit'] } },
    },
    {
      name: 'denied',
      render: 'test:denied',
      options: { permission: { formScene: ['view'] } },
    },
    {
      name: 'grantSystemAdmin',
      render: 'test:grantSystemAdmin',
      options: { permission: grantHint },
    },
  ];

  const allowed = filterDetailsBulkActions(
    'view',
    (actionName, permissionHint) => {
      calls.push([actionName, permissionHint]);
      return actionName === 'grantSystemAdmin';
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['grantSystemAdmin'],
  );
  assert.deepEqual(
    calls.map(([actionName]) => actionName),
    ['denied', 'grantSystemAdmin'],
  );
  assert.strictEqual(calls[1][1], grantHint);
});

test('row details actions use the same enclosing Resource checker and form-scene gate', () => {
  const calls: string[] = [];
  const actions = [
    {
      name: 'hiddenInView',
      render: 'test:hiddenInView',
      options: { permission: { formScene: ['edit'] } },
    },
    {
      name: 'allowed',
      render: 'test:allowed',
      options: { permission: { public: true } },
    },
    {
      name: 'denied',
      render: 'test:denied',
    },
  ];

  const allowed = filterDetailsRowActions(
    'view',
    actionName => {
      calls.push(actionName!);
      return actionName === 'allowed';
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['allowed'],
  );
  assert.deepEqual(calls, ['allowed', 'denied']);
});
