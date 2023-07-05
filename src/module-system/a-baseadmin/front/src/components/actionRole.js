import Vue from 'vue';
import ActionDelete from './actionRole/actionDelete.js';
import ActionClone from './actionRole/actionClone.js';
import ActionMove from './actionRole/actionMove.js';
import ActionAddChild from './actionRole/actionAddChild.js';
import ActionRoleUsers from './actionRole/actionRoleUsers.js';
import ActionIncludes from './actionRole/actionIncludes.js';
import ActionResourceAuthorizations from './actionRole/actionResourceAuthorizations.js';
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
    ActionAddChild,
    ActionRoleUsers,
    ActionIncludes,
    ActionResourceAuthorizations,
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'delete') {
        return await this._onActionDelete();
      } else if (actionName === 'clone') {
        return await this._onActionClone();
      } else if (actionName === 'move') {
        return await this._onActionMove();
      } else if (actionName === 'addChild') {
        return await this._onActionAddChild();
      } else if (actionName === 'roleUsers') {
        return await this._onActionRoleUsers();
      } else if (actionName === 'includes') {
        return await this._onActionIncludes();
      } else if (actionName === 'resourceAuthorizations') {
        return await this._onActionResourceAuthorizations();
      }
    },
  },
};
