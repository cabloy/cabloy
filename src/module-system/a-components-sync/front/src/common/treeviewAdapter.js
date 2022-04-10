export default function (ctx) {
  return class Adapter {
    constructor(treeviewData) {
      this.treeviewData = treeviewData;
    }
    dispose() {
      this.treeviewData = null;
    }
    openNode(node) {
      const $el = ctx.getElementByNode(node);
      ctx.$f7.treeview.open($el);
    }
    async onLoadChildren(node) {
      return await ctx.onLoadChildren(node, this.treeviewData);
    }
    onNodeSelect(node) {
      ctx.$emit('node:select', node);
      ctx.$emit('nodeSelect', node);
    }
    onNodeChange(node) {
      ctx.$emit('node:change', node);
      ctx.$emit('nodeChange', node);
    }
  };
}
