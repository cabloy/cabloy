import TreeviewAdapterFn from './treeviewAdapter.js';

import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;
export default {
  meta: {
    global: false,
  },
  mixins: [ebActionBase],
  methods: {
    async onAction() {
      if (this.action.name === 'createTreeviewAdapter') {
        return await this._onActionCreateTreeviewAdapter();
      }
    },
    async _onActionCreateTreeviewAdapter() {
      const { ctx, item } = this.$props;
      return TreeviewAdapterFn(ctx, item);
    },
  },
};
