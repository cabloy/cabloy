import Vue from 'vue';
import ActionActomAtom from './action/actionAtomName.js';
import ActionDateRange from './action/actionDateRange.js';
import ActionDict from './action/actionDict.js';

const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionActomAtom,
    ActionDateRange,
    ActionDict,
  ],
  methods: {
    onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'atomName') {
        return this.onAction_atomName();
      } else if (actionName === 'dateRange') {
        return this.onAction_dateRange();
      } else if (actionName === 'dict') {
        return this.onAction_dict();
      }
    },
  },
};
