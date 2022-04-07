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
      if (this.action.name === 'userRoles') {
        return await this._onActionUserRoles();
      }
    },
  },
};
