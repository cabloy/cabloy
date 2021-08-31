import { MenuItem } from 'prosemirror-menu';
import { canInsert } from './utils.js';

export const ButtonHorizontalRule = {
  node: true,
  title: 'EditorButtonTitleHorizontalRule',
  icon: { material: 'horizontal_rule' },
  onBuild: insertHorizontalRule,
};

function insertHorizontalRule(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return canInsert(state, nodeType);
    },
    run(state, dispatch) {
      dispatch(state.tr.replaceSelectionWith(nodeType.create()));
    },
  });
}
