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
      _blockAdd(options).then(res => {
        console.log(res);
      });
      return;
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

async function _blockAdd(options) {
  const block = await _blockSelect(options);
  if (!block) return;
  console.log(block);
  return await this._blockEdit(block, this.item.atomId);
}

function _blockSelect(options) {
  const { ctx } = options;
  return new Promise(resolve => {
    let res;
    ctx.$view.navigate('/a/basefront/resource/select?resourceType=a-markdown:block', {
      context: {
        params: {
          multiple: false,
        },
        callback: (code, node) => {
          if (code === 200) {
            res = node && node.data;
          } else {
            resolve(res);
          }
        },
      },
    });
  });
}
