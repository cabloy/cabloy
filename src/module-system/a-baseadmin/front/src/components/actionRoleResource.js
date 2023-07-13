import Vue from 'vue';
import ActionCreate from './actionRoleResource/actionCreate.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionCreate,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'create') {
        return await this._onActionCreate();
      }
    },
  },
};
