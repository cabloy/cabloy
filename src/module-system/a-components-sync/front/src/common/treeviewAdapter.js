import TreeviewAdapterBaseFn from './treeviewAdapterBase.js';

export default function (ctx) {
  return class Adapter extends TreeviewAdapterBaseFn(ctx) {
    async onLoadChildren(node) {
      return await ctx.onLoadChildren(node, this.treeviewData);
    }
  };
}
