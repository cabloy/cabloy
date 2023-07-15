import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
  ],
  methods: {
    onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'resourceName') {
        return this.onAction_resourceName();
      }
    },
    resourceName() {
      const { item } = this.$props;
      const { value, operator } = item;
      if (!value) return null;
      const op = operator.op;
      const clauseValue = { op, val: value };
      const clause = {
        __or__atomNameResource: [{ 'f.atomName': clauseValue }, { 'f.atomNameLocale': clauseValue }],
      };
      return clause;
    },
  },
};
