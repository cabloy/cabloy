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
      if (this.action.name === 'hideClientSecret') {
        return await this._onActionHideClientSecret();
      } else if (this.action.name === 'resetClientSecret') {
        return await this._onActionResetClientSecret();
      }
    },
  },
};
