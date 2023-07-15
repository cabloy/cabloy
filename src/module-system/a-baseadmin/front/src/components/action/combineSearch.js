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
      if (actionName === 'atomName') {
        return this.onAction_atomName();
      } else if (actionName === 'dateRange') {
        return this.onAction_dateRange();
      }
    },
    onAction_atomName() {
      const { ctx, item } = this.$props;
      const { value, operator, data } = item;
      if (!value) return null;
      const op = operator.op;
      const clauseValue = { op, val: value };
      const clause = {
        __or__atomNameResource: [{ 'a.atomName': clauseValue }],
      };
      const atomClass = data.atomClass ? ctx.getAtomClass(data.atomClass) : null;
      if (atomClass && atomClass.resource) {
        const fieldName = ctx.container && ctx.container.resource ? 'm.atomNameLocale' : 'f.atomNameLocale';
        clause.__or__atomNameResource.push({ [fieldName]: clauseValue });
      }
      return clause;
    },
    onAction_dateRange() {
      const { ctx, item } = this.$props;
      const { key, property, value } = item;
      const ebSearch = property.ebSearch;
      const dateFormat = property.ebParams.dateFormat;
      if (!value) return null;
      // name
      let tableAlias = ebSearch && ebSearch.tableAlias;
      tableAlias = tableAlias === null ? null : tableAlias || 'f';
      const fieldName = (ebSearch && ebSearch.fieldName) || key;
      const clauseName = tableAlias === null ? fieldName : `${tableAlias}.${fieldName}`;
      // value
      const [valueBegin, valueEnd] = value.split(',');
      const __and__dateRange = [];
      if (valueBegin) {
        const val = new Date(ctx.$meta.util.moment(valueBegin, dateFormat).format('YYYY-MM-DD 00:00:00'));
        __and__dateRange.push({
          [clauseName]: { op: '>=', val },
        });
      }
      if (valueEnd) {
        const val = new Date(ctx.$meta.util.moment(valueEnd, dateFormat).format('YYYY-MM-DD 23:59:59'));
        __and__dateRange.push({
          [clauseName]: { op: '<=', val },
        });
      }
      // ok
      if (__and__dateRange.length === 0) return null;
      return { [`__and__${fieldName}`]: __and__dateRange };
    },
  },
};
