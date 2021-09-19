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
      if (this.action.name === 'atomName') {
        return this.onAction_atomName();
      }
    },
    onAction_atomName() {
      const { ctx, item } = this.$props;
      const { value, operator, data } = item;
      if (!value) return null;
      const clause = {};
      const op = operator.op;
      const atomClass = data.atomClass ? ctx.getAtomClass(data.atomClass) : null;
      const clauseValue = { op, val: value };
      if (atomClass && atomClass.resource) {
        clause.__or__atomNameResource = [
          { 'a.atomName': clauseValue }, //
          { 'f.atomNameLocale': clauseValue },
        ];
      } else {
        clause['a.atomName'] = clauseValue;
      }
      return clause;
    },
  },
};
