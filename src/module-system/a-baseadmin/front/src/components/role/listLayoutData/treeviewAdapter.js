import Vue from 'vue';
const ebTreeviewAdapterBase = Vue.prototype.$meta.module.get('a-components').options.mixins.ebTreeviewAdapterBase;

export default function (ctx) {
  return class Adapter extends ebTreeviewAdapterBase(ctx) {
    openNode(node) {
      // const $el = ctx.getElementByNode(node);
      // ctx.$f7.treeview.open($el);
    }
    async onLoadChildren(node) {
      return await ctx.onLoadChildren(node, this.treeviewData);
    }
  };
}
