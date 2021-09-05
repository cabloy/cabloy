import { MenuItem } from 'prosemirror-menu';

export const ButtonTaskToggle = {
  title: 'EditorButtonTitleTaskToggle',
  icon: { material: 'task_alt' },
  onBuild: menuItemTaskToggle,
};

function menuItemTaskToggle(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return true;
    },
    active(state) {
      return false;
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
