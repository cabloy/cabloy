import Vue from 'vue';
import ActionKickOut from './action/actionKickout.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionKickOut,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'kickOut') {
        return await this._onActionKickOut();
      }
    },
  },
};
