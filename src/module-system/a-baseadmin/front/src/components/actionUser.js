import Vue from 'vue';
import ActionUserRoles from './actionUser/actionUserRoles.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionUserRoles,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'userRoles') {
        return await this._onActionUserRoles();
      }
    },
  },
};
