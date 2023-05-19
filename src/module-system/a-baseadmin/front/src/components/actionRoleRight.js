import Vue from 'vue';
import ActionSpreadsBulk from './actionRoleRight/actionSpreadsBulk.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionSpreadsBulk,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'spreadsBulk') {
        return await this._onActionSpreadsBulk();
      }
    },
  },
};
