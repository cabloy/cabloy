import Vue from 'vue';
import ActionDelete from './actionRole/actionDelete.js';
import ActionClone from './actionRole/actionClone.js';
import ActionMove from './actionRole/actionMove.js';
import ActionBuildBulk from './actionRole/actionBuildBulk.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionDelete,
    ActionClone,
    ActionMove,
    ActionBuildBulk,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'delete') {
        return await this._onActionDelete();
      } else if (this.action.name === 'clone') {
        return await this._onActionClone();
      } else if (this.action.name === 'move') {
        return await this._onActionMove();
      } else if (this.action.name === 'buildBulk') {
        return await this._onActionBuildBulk();
      }
    },
  },
};
