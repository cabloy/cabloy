import type { ISchemaObjectExtensionField } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { TableColumnIdSelection } from '../../src/types/table.js';
import { reconcileTableLayout } from '../../src/types/tableLayout.js';

function createProperties(...properties: ISchemaObjectExtensionField[]) {
  return properties;
}

test('table layout drops stale and malformed profile columns while preserving schema defaults', () => {
  const layout = reconcileTableLayout(
    createProperties(
      { key: 'id', type: 'number', rest: { width: 60, fixed: 'left' } },
      { key: 'name', type: 'string' },
      { key: 'level', type: 'string', rest: { width: 120 } },
      { key: 'operations', type: 'string', rest: { width: 360, fixed: 'right' } },
    ),
    {
      version: 1,
      schemaFingerprint: 'student-v1',
      columns: [
        { key: 'name', visible: false, width: 480 },
        { key: 'obsolete', visible: true, width: 80 },
        { key: 'level', visible: true, width: 0 },
        { key: 'operations', visible: true, width: 'auto' },
        { key: '', visible: false, width: 90 },
      ],
    },
  );

  assert.deepEqual(layout, {
    version: 1,
    schemaFingerprint: 'student-v1',
    columns: [
      { key: 'id', visible: true, width: 60 },
      { key: 'name', visible: false, width: 480 },
      { key: 'level', visible: true, width: 120 },
      { key: 'operations', visible: true, width: 'auto' },
    ],
  });
});

test('table layout retains the first valid duplicate and appends new schema fields', () => {
  const layout = reconcileTableLayout(
    createProperties(
      { key: 'name', type: 'string' },
      { key: 'level', type: 'string' },
      { key: 'createdAt', type: 'string', rest: { width: 180 } },
    ),
    {
      columns: [
        { key: 'level', visible: false, width: 240 },
        { key: 'name', visible: true, width: 'auto' },
        { key: 'level', visible: true, width: 300 },
      ],
    },
  );

  assert.deepEqual(layout.columns, [
    { key: 'level', visible: false, width: 240 },
    { key: 'name', visible: true, width: 'auto' },
    { key: 'createdAt', visible: true, width: 180 },
  ]);
});

test('table layout permits ordering only within schema fixed regions', () => {
  const layout = reconcileTableLayout(
    createProperties(
      { key: 'leftFirst', type: 'string', rest: { fixed: 'left' } },
      { key: 'leftSecond', type: 'string', rest: { fixed: 'left' } },
      { key: 'centerFirst', type: 'string' },
      { key: 'centerSecond', type: 'string' },
      { key: 'rightFirst', type: 'string', rest: { fixed: 'right' } },
      { key: 'rightSecond', type: 'string', rest: { fixed: 'right' } },
    ),
    {
      columns: [
        { key: 'rightSecond', visible: true, width: 'auto' },
        { key: 'centerSecond', visible: true, width: 'auto' },
        { key: 'leftSecond', visible: true, width: 'auto' },
        { key: 'rightFirst', visible: true, width: 'auto' },
        { key: 'centerFirst', visible: true, width: 'auto' },
        { key: 'leftFirst', visible: true, width: 'auto' },
      ],
    },
  );

  assert.deepEqual(
    layout.columns.map(column => column.key),
    ['leftSecond', 'leftFirst', 'centerSecond', 'centerFirst', 'rightSecond', 'rightFirst'],
  );
});

test('table layout excludes synthetic selection state from persistence', () => {
  const layout = reconcileTableLayout(
    createProperties(
      { key: TableColumnIdSelection, type: 'boolean' },
      { key: 'name', type: 'string' },
    ),
    {
      columns: [
        { key: TableColumnIdSelection, visible: false, width: 40 },
        { key: 'name', visible: true, width: 'auto' },
      ],
    },
  );

  assert.deepEqual(layout.columns, [{ key: 'name', visible: true, width: 'auto' }]);
});
