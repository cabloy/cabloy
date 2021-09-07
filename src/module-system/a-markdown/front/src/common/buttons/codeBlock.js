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
      const { ctx } = options;
      // navigate
      ctx.$view.navigate(`/a/codemirror/modeSelect?t=${Date.now()}`, {
        context: {
          callback: (code, res) => {
            if (code === 200) {
              const attrs = { params: res.mode };
              const command = setBlockType(nodeType, attrs);
              command(state, dispatch, view, event);
            }
            if (code === false) {
              view.focus();
            }
          },
        },
      });
    },
  });
}
