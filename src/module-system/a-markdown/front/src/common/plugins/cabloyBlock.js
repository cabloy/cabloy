import { Plugin } from 'prosemirror-state';

export function cabloyBlockPlugin(options) {
  const cabloyBlockPlugin = new Plugin({
    props: {
      handleDoubleClickOn(view, pos, node, nodePos, event /* , direct*/) {
        if (node.type.name === 'cabloy_block') {
          const { ctx } = options;
          const menuItem = ctx._findMenuItem('cabloy_block');
          if (menuItem) {
            menuItem.spec.run(view.state, view.dispatch, view, event);
            return true;
          }
        }
      },
    },
  });
  return cabloyBlockPlugin;
}
