import Vue from 'vue';
import ActionUserRoles from './actionUser/actionUserRoles.js';
import ActionResourceAuthorization from './actionUser/actionResourceAuthorization.js';
import ActionAtomAuthorizations from './actionUser/actionAtomAuthorizations.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionUserRoles,
    ActionResourceAuthorization,
    ActionAtomAuthorizations,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'userRoles') {
        return await this._onActionUserRoles();
      } else if (this.action.name === 'resourceAuthorization') {
        return await this._onActionResourceAuthorization();
      } else if (this.action.name === 'atomAuthorizations') {
        return await this._onActionAtomAuthorizations();
      }
    },
  },
};
