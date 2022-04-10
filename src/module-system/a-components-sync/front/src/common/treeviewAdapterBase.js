export default function (ctx) {
  return class Adapter {
    constructor(treeviewData) {
      this.treeviewData = treeviewData;
    }
    dispose() {
      this.treeviewData = null;
    }
    openNode(/* node*/) {}
    async onLoadChildren(/* node*/) {}
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
