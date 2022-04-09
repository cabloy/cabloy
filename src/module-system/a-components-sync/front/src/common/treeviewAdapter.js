export default function (ctx, instance) {
  return {
    openNode(node) {
      const $el = instance.getElementByNode(node);
      ctx.$f7.treeview.open($el);
    },
  };
}
