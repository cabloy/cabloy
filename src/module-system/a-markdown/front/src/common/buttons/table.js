import { MenuItem } from 'prosemirror-menu';
import { TextSelection } from 'prosemirror-state';
import { addRowAt, createTable, getCellsInColumn, moveRow } from '@zhennann/prosemirror-utils';

export const ButtonTable = {
  node: true,
  title: 'EditorButtonTitleTable',
  icon: { material: 'grid_on' },
  onBuild: insertTableMenu,
};

function insertTableMenu(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return true;
    },
    run(state, dispatch) {
      const rowsCount = 3;
      const colsCount = 3;
      const offset = state.tr.selection.anchor + 1;
      const cell = state.schema.nodes.paragraph.create();
      const nodes = createTable(state.schema, rowsCount, colsCount, true, cell);
      const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
      const resolvedPos = tr.doc.resolve(offset);

      tr.setSelection(TextSelection.near(resolvedPos));
      dispatch(tr);
    },
  });
}
