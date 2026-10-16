import type {
  IPermissionHintDetailsAction,
  IPermissionHintGeneral,
  TypeOpenapiPermissions,
} from 'zova-module-a-openapi';

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

test('form-scene CRUD actions do not invoke the enclosing permission checker', () => {
  const calls: string[] = [];
  const actions = ['create', 'update', 'delete'].map(name => ({
    name,
    options: { permission: { mode: 'formScene', formScene: ['create', 'edit'] } },
  }));
  const allowed = filterDetailsRowActions(
    'edit',
    actionName => {
      calls.push(actionName!);
      return false;
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['create', 'update', 'delete'],
  );
  assert.deepEqual(calls, []);
});

test('form-scene CRUD actions are filtered before permission checks in view', () => {
  const calls: string[] = [];
  const action = {
    name: 'update',
    options: { permission: { mode: 'formScene', formScene: ['create', 'edit'] } },
  };

  const allowed = filterDetailsRowActions(
    'view',
    actionName => {
      calls.push(actionName!);
      return true;
    },
    [action] as any,
  );

  assert.deepEqual(allowed, []);
  assert.deepEqual(calls, []);
});

test('action mode uses the literal action name and inherited hint', () => {
  const calls: Array<[string | undefined, IPermissionHintDetailsAction | undefined]> = [];
  const permissionHint = {
    mode: 'action',
    actionInherit: 'approve',
    formScene: ['create', 'edit'],
  };
  const allowed = filterDetailsRowActions(
    'edit',
    (actionName, hint) => {
      calls.push([actionName, hint]);
      return true;
    },
    [{ name: 'approve', options: { permission: permissionHint } }] as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['approve'],
  );
  assert.deepEqual(calls, [['approve', permissionHint]]);
});

test('omitted mode checks custom actions without inferring CRUD permissions', () => {
  const calls: string[] = [];
  const actions = ['create', 'update', 'delete'].map(name => ({ name }));
  const allowed = filterDetailsRowActions(
    'create',
    actionName => {
      calls.push(actionName!);
      return actionName === 'update';
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['update'],
  );
  assert.deepEqual(calls, ['create', 'update', 'delete']);
});

test('form-scene mode with action inheritance still invokes the checker', () => {
  const calls: Array<[string | undefined, IPermissionHintDetailsAction | undefined]> = [];
  const permissionHint = {
    mode: 'formScene',
    actionInherit: 'grant',
    formScene: ['create', 'edit'],
  };
  const allowed = filterDetailsRowActions(
    'create',
    (actionName, hint) => {
      calls.push([actionName, hint]);
      return actionName === 'update';
    },
    [{ name: 'update', options: { permission: permissionHint } }] as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['update'],
  );
  assert.deepEqual(calls, [['update', permissionHint]]);
});

test('view scene hides nested write actions before permission checks', () => {
  const calls: string[] = [];
  const actions = [
    {
      name: 'create',
      options: { permission: { mode: 'formScene', formScene: ['create', 'edit'] } },
    },
    {
      name: 'update',
      options: { permission: { mode: 'formScene', formScene: ['create', 'edit'] } },
    },
    {
      name: 'delete',
      options: { permission: { mode: 'formScene', formScene: ['create', 'edit'] } },
    },
    { name: 'view', options: { permission: { actionInherit: 'view' } } },
  ];

  const allowed = filterDetailsRowActions(
    'view',
    actionName => {
      calls.push(actionName!);
      return actionName === 'view';
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['view'],
  );
  assert.deepEqual(calls, ['view']);
});

test('view scene preserves explicit inherited write actions', () => {
  const calls: string[] = [];
  const actions = [
    { name: 'update', options: { permission: { actionInherit: 'grant', formScene: ['view'] } } },
  ];

  const allowed = filterDetailsRowActions(
    'view',
    (actionName, permissionHint) => {
      calls.push(actionName!);
      return actionName === 'update' && permissionHint?.actionInherit === 'grant';
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['update'],
  );
  assert.deepEqual(calls, ['update']);
});

test('explicit action inheritance and custom actions are preserved', () => {
  const calls: Array<[string | undefined, IPermissionHintGeneral | undefined]> = [];
  const explicitHint = { actionInherit: 'grant', formScene: ['create', 'edit'] };
  const customHint = { mode: 'action', formScene: ['create', 'edit'] };
  const actions = [
    { name: 'update', options: { permission: explicitHint } },
    { name: 'archive', options: { permission: customHint } },
  ];

  const allowed = filterDetailsRowActions(
    'create',
    (actionName, permissionHint) => {
      calls.push([actionName, permissionHint]);
      return true;
    },
    actions as any,
  );

  assert.deepEqual(
    allowed.map(action => action.name),
    ['update', 'archive'],
  );
  assert.deepEqual(calls, [
    ['update', explicitHint],
    ['archive', customHint],
  ]);
});
