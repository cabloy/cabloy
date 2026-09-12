import assert from 'node:assert/strict';
import test from 'node:test';

import {
  reconcileSelection,
  resolveSelectionMaxIds,
  resolveTableActionBulkDynamicProps,
  selectionKey,
  selectionRowIds,
} from '../../src/lib/selection.ts';

test('selection maximum uses action metadata before the frontend fallback', () => {
  assert.equal(resolveSelectionMaxIds(undefined), 100);
  assert.equal(resolveSelectionMaxIds(100), 100);
  assert.equal(resolveSelectionMaxIds(101), 101);
  assert.equal(resolveSelectionMaxIds(0), 0);
});

test('bulk action runtime props do not overwrite static action metadata', () => {
  const selection = { ids: [1], rows: [{ id: 1 }], count: 1 };

  assert.deepEqual(
    resolveTableActionBulkDynamicProps(
      { requiresSelection: true, disabled: true },
      selection,
      true,
    ),
    {
      dynamicSelection: selection,
      dynamicDisabled: false,
      dynamicDisabledReason: undefined,
      selectedMaxIds: 100,
    },
  );
  assert.deepEqual(
    resolveTableActionBulkDynamicProps(
      { requiresSelection: true, selectedMaxIds: 1 },
      selection,
      true,
    ),
    {
      dynamicSelection: selection,
      dynamicDisabled: false,
      dynamicDisabledReason: undefined,
      selectedMaxIds: 1,
    },
  );
  assert.deepEqual(
    resolveTableActionBulkDynamicProps(
      { requiresSelection: true, selectedMaxIds: 0 },
      selection,
      true,
    ),
    {
      dynamicSelection: selection,
      dynamicDisabled: true,
      dynamicDisabledReason: 'maxExceeded',
      selectedMaxIds: 0,
    },
  );
  assert.deepEqual(
    resolveTableActionBulkDynamicProps({ requiresSelection: true }, selection, false),
    {
      dynamicSelection: selection,
      dynamicDisabled: true,
      dynamicDisabledReason: 'selectionUnavailable',
      selectedMaxIds: 100,
    },
  );
});

test('selection keys normalize numeric and string identities', () => {
  assert.equal(selectionKey(7), '7');
  assert.equal(selectionKey('student-7'), 'student-7');
  assert.throws(() => selectionKey(''), /row id cannot empty/);
  assert.throws(() => selectionKey(undefined as never), /row id cannot empty/);
});

test('selection rejects duplicate loaded row identities', () => {
  assert.throws(() => selectionRowIds([{ id: '1' }, { id: 1 }]), /duplicate row id: 1/);
});

test('current-page selection changes preserve off-page selections', () => {
  const selection = { previous: true, 1: true };
  const rows = [{ id: '1' }, { id: '2' }];

  const selected = reconcileSelection(selection, rows, { 1: true, 2: true });
  assert.deepEqual(selected, { previous: true, 1: true, 2: true });

  const deselected = reconcileSelection(selected, rows, { 2: true });
  assert.deepEqual(deselected, { previous: true, 2: true });
});

test('current-page reconciliation removes only deselected loaded identities', () => {
  const rows = [{ id: '1' }, { id: '2' }];
  const selection = reconcileSelection({ 1: true, 2: true, previous: true }, rows, {});

  assert.deepEqual(selection, { previous: true });
});
