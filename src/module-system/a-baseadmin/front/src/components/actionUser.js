import Vue from 'vue';
import ActionUserRoles from './actionUser/actionUserRoles.js';
import ActionResourceAuthorizations from './actionUser/actionResourceAuthorizations.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionUserRoles,
    ActionResourceAuthorizations,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'userRoles') {
        return await this._onActionUserRoles();
      } else if (actionName === 'resourceAuthorizations') {
        return await this._onActionResourceAuthorizations();
      }
    },
  },
};
