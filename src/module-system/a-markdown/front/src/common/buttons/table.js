import { MenuItem } from 'prosemirror-menu';
import { TextSelection } from 'prosemirror-state';
import { addRowAt, createTable, getCellsInColumn, moveRow } from '@zhennann/prosemirror-utils';
import { isInTable, addColumnBefore, addColumnAfter, deleteColumn } from 'prosemirror-tables';
import { buttonPopupChildren, onPopupPerform, selectionTableColumnIndex, setTableColumnAttr } from './utils.js';

export const ButtonTable = {
  node: true,
  title: 'EditorButtonTitleTable',
  icon: { material: 'grid_on' },
  onBuild: insertTableMenu,
  popup: true,
  children: [
    {
      key: 'TableAlignLeft',
      title: 'EditorButtonTitleAlignLeft',
      attrs: { textAlign: 'left' },
      onBuild: menuItemSetAlign,
    },
    {
      key: 'TableAlignCenter',
      title: 'EditorButtonTitleAlignCenter',
      attrs: { textAlign: 'center' },
      onBuild: menuItemSetAlign,
    },
    {
      key: 'TableAlignRight',
      title: 'EditorButtonTitleAlignRight',
      attrs: { textAlign: 'right' },
      onBuild: menuItemSetAlign,
    },
    {
      key: 'TableInsertColumnBefore',
      title: 'EditorButtonTitleInsertColumnBefore',
      onBuild: (nodeType, options) => menuItemTableCmd(options, addColumnBefore),
    },
    {
      key: 'TableInsertColumnAfter',
      title: 'EditorButtonTitleInsertColumnAfter',
      onBuild: (nodeType, options) => menuItemTableCmd(options, addColumnAfter),
    },
    {
      key: 'TableDeleteColumn',
      title: 'EditorButtonTitleDeleteColumn',
      onBuild: (nodeType, options) => menuItemTableCmd(options, deleteColumn),
    },
  ],
};

function menuItemTableCmd(options, cmd) {
  return new MenuItem({
    ...options,
    select: cmd,
    run: cmd,
  });
}

function menuItemSetAlign(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return true;
    },
    run(state, dispatch, view) {
      const index = selectionTableColumnIndex(state);
      const cmd = setTableColumnAttr(index, options.attrs);
      return cmd(state, dispatch, view);
    },
  });
}

function insertTableMenu(nodeType, options) {
  // children
  const menuItems = buttonPopupChildren(options.ctx, nodeType, options);
  // menuItem
  const menuItem = new MenuItem({
    ...options,
    menuItems,
    // select(state) {
    //   return !isInTable(state);
    // },
    enable(state) {
      return true;
    },
    run(state, dispatch, view, event) {
      if (!isInTable(state)) return _insertTable(state, dispatch);
      return onPopupPerform(state, dispatch, view, event, menuItem);
    },
  });
  return menuItem;
}

function _insertTable(state, dispatch) {
  const rowsCount = 3;
  const colsCount = 3;
  const offset = state.tr.selection.anchor + 1;
  // const cell = state.schema.nodes.paragraph.create();
  const nodes = createTable(state.schema, rowsCount, colsCount, true /* , cell*/);
  const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
  const resolvedPos = tr.doc.resolve(offset);

  tr.setSelection(TextSelection.near(resolvedPos));
  dispatch(tr);
}
