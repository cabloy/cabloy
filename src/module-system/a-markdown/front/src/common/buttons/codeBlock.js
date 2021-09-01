import { blockTypeItem } from 'prosemirror-menu';
import { setBlockType } from 'prosemirror-commands';

export const ButtonCodeBlock = {
  node: true,
  title: 'EditorButtonTitleCodeBlock',
  icon: { material: 'wysiwyg' },
  onBuild: insertCodeBlock,
};

function insertCodeBlock(nodeType, options) {
  return blockTypeItem(nodeType, {
    ...options,
    run: (state, dispatch, view, event) => {
      const command = setBlockType(nodeType, { params: ' shell' });
      return command(state, dispatch, view, event);
    },
  });
}
