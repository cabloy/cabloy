import type { IResourceRenderBlockOptionsBlock } from 'zova-module-a-openapi';

import assert from 'node:assert/strict';
import test from 'node:test';

import { createResourcePickerPageHost } from '../../src/lib/resourcePickerPageHost.ts';

function createDialog() {
  const resolved: unknown[] = [];
  let cancelled = false;
  const dialog = {
    id: 1,
    props: {
      resource: 'training-student:student',
      selectionMode: 'multiple' as const,
      selectionMax: 2,
    },
    session: {
      selectedIds: [1],
      selectedRows: [{ id: 1, name: 'One' }],
    },
    resolve(value: unknown) {
      resolved.push(value);
    },
    cancel() {
      cancelled = true;
    },
  };
  return {
    dialog,
    resolved,
    get cancelled() {
      return cancelled;
    },
  };
}

test('Basic picker host adapts only the Basic page block and preserves picker state', () => {
  const { dialog } = createDialog();
  const host = createResourcePickerPageHost(dialog);
  const unrelated: IResourceRenderBlockOptionsBlock = {
    render: 'other:block' as never,
    options: { class: 'other' },
  };
  const basicPage: IResourceRenderBlockOptionsBlock = {
    render: 'basic-page:blockPage' as never,
    options: {
      blocks: [{ render: 'basic-page:blockTable' as never }],
    } as any,
  };

  const context = {
    options: dialog.props,
    session: dialog.session,
    dialog: host,
  };
  const blocks = host.prepareBlocks([unrelated, basicPage], context)!;

  assert.equal(blocks[0], unrelated);
  assert.deepEqual(blocks[1].options, {
    actionPath: undefined,
    queryFixed: undefined,
    selectionPolicy: 'always',
    selectionMode: 'multiple',
    selectionMax: 2,
    selectedIds: [1],
    selectedRows: [{ id: 1, name: 'One' }],
    blocks: [
      { render: 'basic-page:blockTable' },
      { render: 'basic-resource:blockResourcePickerActions' },
    ],
  });

  const onSelectionChange = (blocks[1].options as any).onSelectionChange as (
    selection: any,
  ) => void;
  onSelectionChange({ ids: [2], rows: [{ id: 2, name: 'Two' }], count: 1 });
  assert.deepEqual(dialog.session, {
    selectedIds: [2],
    selectedRows: [{ id: 2, name: 'Two' }],
  });
});

test('Basic picker host forwards resolve and cancel', () => {
  const { dialog, resolved, cancelled } = createDialog();
  const host = createResourcePickerPageHost(dialog);
  const selection = { ids: [1], rows: [{ id: 1 }], count: 1 };

  host.resolve(selection);
  host.cancel();

  assert.deepEqual(resolved, [selection]);
  assert.equal(cancelled, true);
});
