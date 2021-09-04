import { MenuItem } from 'prosemirror-menu';
import { TextSelection } from 'prosemirror-state';
import { addRowAt, createTable, getCellsInColumn, moveRow } from '@zhennann/prosemirror-utils';
import { isInTable } from 'prosemirror-tables';
import { buttonPopupChildren } from './utils.js';

export const ButtonTable = {
  node: true,
  title: 'EditorButtonTitleTable',
  icon: { material: 'grid_on' },
  onBuild: insertTableMenu,
  // popup: true,
  children: [
    {
      key: 'AlignLeft',
      title: 'EditorButtonTitleTableSetAlignLeft',
      attrs: { textAlign: 'left' },
      // onBuild: blockTypeItem,
    },
  ],
};

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
      options.onPopup(state, dispatch, view, event, menuItem);
    },
  });
  return menuItem;
}

function _insertTable(state, dispatch) {
  const rowsCount = 3;
  const colsCount = 3;
  const offset = state.tr.selection.anchor + 1;
  const cell = state.schema.nodes.paragraph.create();
  const nodes = createTable(state.schema, rowsCount, colsCount, true, cell);
  const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
  const resolvedPos = tr.doc.resolve(offset);

  tr.setSelection(TextSelection.near(resolvedPos));
  dispatch(tr);
}
