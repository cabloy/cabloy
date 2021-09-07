import { MenuItem } from 'prosemirror-menu';
import { canInsert } from './utils.js';

export const ButtonCabloyBlock = {
  node: true,
  title: 'EditorButtonTitleBlock',
  icon: { material: 'add_box' },
  onBuild: insertCabloyBlock,
};

function insertCabloyBlock(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return canInsert(state, nodeType);
    },
    run(state, _, view) {
      const { ctx } = options;
      const attrs = {
        params: 'a-markdownblock:',
      };
      // atomId
      const atomId = (ctx.host && ctx.host.atomId) || 0;
      // navigate
      ctx.$view.navigate(`/a/file/file/upload?t=${Date.now()}`, {
        context: {
          params: {
            mode: 1, // image
            atomId,
          },
          callback: (code, data) => {
            if (code === 200) {
              const attrs = { alt: data.realName, src: data.downloadUrl };
              view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
              view.focus();
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
