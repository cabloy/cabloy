export default function (ctx) {
  return {
    openNode(node) {
      const $el = ctx.getElementByNode(node);
      ctx.$f7.treeview.open($el);
    },
    async onLoadChildren(node, instance) {
      return await ctx.onLoadChildren(node, instance);
    },
  };
}
