import { MenuItem } from 'prosemirror-menu';
import { /* NodeSelection, TextSelection,*/ Selection } from 'prosemirror-state';

export const ButtonKeyboardReturn = {
  title: 'EditorButtonTitleParagraphKeyboardReturn',
  icon: { material: 'keyboard_return' },
  onBuild: menuItemKeyboardReturn,
};

function menuItemKeyboardReturn(_, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return true;
    },
    run(state, dispatch, view) {
      KeyboardReturn(state, dispatch, view);
    },
  });
}

function KeyboardReturn(state, dispatch, view) {
  const ref = state.selection;
  const $from = ref.$from;
  if (dispatch) {
    let tr = state.tr;
    if (!$from.node(1)) {
      tr = tr.insertText('\n');
    } else {
      const pos = $from.end(1);
      tr = tr.insert(pos + 1, state.schema.nodes.paragraph.createAndFill());
      tr.setSelection(Selection.near(tr.doc.resolve(pos + 1), 1));
    }
    dispatch(tr.scrollIntoView());
    view.focus(); // for exit codemirror
  }
  return true;
}
