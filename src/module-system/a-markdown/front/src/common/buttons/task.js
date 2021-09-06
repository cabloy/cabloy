import { MenuItem } from 'prosemirror-menu';
import { isInList } from './utils.js';

export const ButtonTaskToggle = {
  title: 'EditorButtonTitleTaskToggle',
  icon: { material: 'task_alt' },
  onBuild: menuItemTaskToggle,
};

function menuItemTaskToggle(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return isInList(state);
    },
    active(state) {
      return !!checkTaskActive(state);
    },
    run(state, dispatch, view) {
      taskToggle(state, dispatch, view);
    },
  });
}

function taskToggle(state, dispatch) {
  const checkbox = checkTaskActive(state);
  if (dispatch) {
    let tr = state.tr;
    if (checkbox) {
      const $from = state.selection.$from;
      const pos = $from.posAtIndex(0, $from.depth);
      tr = tr.delete(pos, pos + checkbox.nodeSize + 1);
    } else {
    }
    dispatch(tr);
  }

  return !!checkbox;
}

function checkTaskActive(state) {
  if (!isInList(state)) return false;
  // paragraph
  const paragraph = _findParagraph(state);
  if (!paragraph) return false;
  // checkbox
  return _findCheckbox(paragraph);
}

function _findParagraph(state) {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    const node = $head.node(d);
    if (node.type.name === 'paragraph') {
      return node;
    }
  }
  return null;
}

function _findCheckbox(paragraph) {
  let _node;
  paragraph.forEach(node => {
    if (node.type.name === 'html_inline') {
      _node = node;
    }
  });
  return _node;
}
