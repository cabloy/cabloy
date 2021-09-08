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
      const node = _inCabloyBlock(state);
      if (!node) {
        // add
        _blockAdd(options).then(attrs => {
          if (attrs) {
            view.dispatch(view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)));
          }
          view.focus();
        });
      } else {
        // update
        const pos = state.selection.$anchor.pos;
        _blockUpdate(options, node.attrs).then(attrs => {
          if (attrs) {
            const tr = view.state.tr.setNodeMarkup(pos, undefined, attrs);
            view.dispatch(tr);
          }
          view.focus();
        });
      }
    },
  });
}

function _inCabloyBlock(state) {
  const node = state.selection.node;
  if (!node || node.type.name !== 'cabloy_block') return null;
  return node;
}

async function _blockAdd(options) {
  const block = await _blockSelect(options);
  if (!block) return null;
  const content = await _blockEdit(options, block);
  return content ? { params: block.atomStaticKey, content } : null;
}

async function _blockUpdate(options, attrs) {
  const block = await _blockFetch(options, attrs);
  if (!block) return null;
  const content = await _blockEdit(options, block, attrs.content);
  return content ? { params: block.atomStaticKey, content } : null;
}

async function _blockFetch(options, attrs) {
  const { ctx } = options;
  const resources = await ctx.$store.dispatch('a/base/getResources', { resourceType: 'a-markdown:block' });
  return resources[attrs.params];
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

function _blockEdit(options, block, content) {
  const { ctx } = options;
  return new Promise((resolve, reject) => {
    const resourceConfig = window.JSON5.parse(block.resourceConfig);
    const validatorParams = resourceConfig.validator;
    const dataDefault = content ? window.JSON5.parse(content) : resourceConfig.default;
    const isCreate = !content;
    ctx.$view.navigate(`/a/validation/validate?t=${Date.now()}`, {
      context: {
        params: {
          params: validatorParams,
          title: isCreate ? ctx.$text('Create Block') : ctx.$text('Edit Block'),
          data: dataDefault,
          host: ctx.host,
          performValidate: resourceConfig.performValidate !== false,
        },
        callback: (code, res) => {
          if (code === 200) {
            let content = res.data;
            content = content ? window.JSON5.stringify(content, null, 2) : null;
            resolve(content);
          }
          if (code === false) {
            resolve(null);
          }
        },
      },
    });
  });
}
