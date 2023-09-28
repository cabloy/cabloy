export default function (ctx) {
  return class Adapter {
    constructor(treeviewData) {
      this.treeviewData = treeviewData;
    }
    dispose() {
      this.treeviewData = null;
    }
    async onLoadChildren(/* node*/) {}
    onNodeOpen(node) {
      ctx.$emit('node:open', node);
      ctx.$emit('nodeOpen', node);
    }
    onNodeClose(node) {
      ctx.$emit('node:close', node);
      ctx.$emit('nodeClose', node);
    }
    onNodeSelect(node) {
      ctx.$emit('node:select', node);
      ctx.$emit('nodeSelect', node);
    }
    onNodeChange(node) {
      ctx.$emit('node:change', node);
      ctx.$emit('nodeChange', node);
    }
    onNodeReplace(node, nodeNew) {
      ctx.$emit('node:replace', node, nodeNew);
      ctx.$emit('nodeReplace', node, nodeNew);
    }
  };
}
