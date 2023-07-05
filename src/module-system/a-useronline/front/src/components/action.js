import Vue from 'vue';
import ActionKickOut from './action/actionKickout.js';
import ActionLoginLog from './action/actionLoginLog.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionKickOut,
    ActionLoginLog,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'kickOut') {
        return await this._onActionKickOut();
      }
      if (actionName === 'loginLog') {
        return await this._onActionLoginLog();
      }
    },
  },
};
