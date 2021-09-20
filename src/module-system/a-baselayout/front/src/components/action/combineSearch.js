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
      } else if (this.action.name === 'createdAt') {
        return this.onAction_createdAt();
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
    onAction_createdAt() {
      const { ctx, item } = this.$props;
      const { property, value } = item;
      const dateFormat = property.ebParams.dateFormat;
      if (!value) return null;
      const [valueBegin, valueEnd] = value.split(',');
      const __and__createdAt = [];
      if (valueBegin) {
        const val = new Date(ctx.$meta.util.moment(valueBegin, dateFormat).format('YYYY-MM-DD 00:00:00'));
        __and__createdAt.push({
          'a.createdAt': { op: '>=', val },
        });
      }
      if (valueEnd) {
        const val = new Date(ctx.$meta.util.moment(valueEnd, dateFormat).format('YYYY-MM-DD 23:59:59'));
        __and__createdAt.push({
          'a.createdAt': { op: '<=', val },
        });
      }
      // ok
      if (__and__createdAt.length === 0) return null;
      return { __and__createdAt };
    },
  },
};
