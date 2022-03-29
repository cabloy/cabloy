import Vue from 'vue';
import ActionBuildBulk from './actionRole/actionBuildBulk.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionBuildBulk,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'buildBulk') {
        return await this._onActionBuildBulk();
      }
    },
  },
};
