import Vue from 'vue';
import ActionHideClientSecret from './action/actionHideClientSecret.js';
import ActionResetClientSecret from './action/actionResetClientSecret.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionHideClientSecret,
    ActionResetClientSecret,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'hideClientSecret') {
        return await this._onActionHideClientSecret();
      } else if (actionName === 'resetClientSecret') {
        return await this._onActionResetClientSecret();
      }
    },
  },
};
