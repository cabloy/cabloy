import Vue from 'vue';
import ActionDelete from './actionRole/actionDelete.js';
import ActionClone from './actionRole/actionClone.js';
import ActionMove from './actionRole/actionMove.js';
import ActionAddChild from './actionRole/actionAddChild.js';
import ActionRoleUsers from './actionRole/actionRoleUsers.js';
import ActionIncludes from './actionRole/actionIncludes.js';
import ActionResourceAuthorization from './actionRole/actionResourceAuthorization.js';
import ActionAtomAuthorizations from './actionRole/actionAtomAuthorizations.js';
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
    ActionResourceAuthorization,
    ActionAtomAuthorizations,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'delete') {
        return await this._onActionDelete();
      } else if (this.action.name === 'clone') {
        return await this._onActionClone();
      } else if (this.action.name === 'move') {
        return await this._onActionMove();
      } else if (this.action.name === 'addChild') {
        return await this._onActionAddChild();
      } else if (this.action.name === 'roleUsers') {
        return await this._onActionRoleUsers();
      } else if (this.action.name === 'includes') {
        return await this._onActionIncludes();
      } else if (this.action.name === 'resourceAuthorization') {
        return await this._onActionResourceAuthorization();
      } else if (this.action.name === 'atomAuthorizations') {
        return await this._onActionAtomAuthorizations();
      }
    },
  },
};
