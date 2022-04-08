import Vue from 'vue';
import ActionUserRoles from './actionUser/actionUserRoles.js';
import ActionResourceAuthorizations from './actionUser/actionResourceAuthorizations.js';
import ActionAtomAuthorizations from './actionUser/actionAtomAuthorizations.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionUserRoles,
    ActionResourceAuthorizations,
    ActionAtomAuthorizations,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'userRoles') {
        return await this._onActionUserRoles();
      } else if (this.action.name === 'resourceAuthorizations') {
        return await this._onActionResourceAuthorizations();
      } else if (this.action.name === 'atomAuthorizations') {
        return await this._onActionAtomAuthorizations();
      }
    },
  },
};
