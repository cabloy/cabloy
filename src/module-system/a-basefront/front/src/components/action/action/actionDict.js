export default {
  methods: {
    onAction_dict() {
      const { ctx, item } = this.$props;
      let { dataKey, property, value } = item;
      if (ctx.$meta.util.checkIfEmptyForSelect(value)) return null;
      // op
      let op;
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return null;
        } else if (value.length === 1) {
          value = value[0];
        } else {
          op = 'in';
        }
      }
      if (!op) {
        if (typeof value !== 'string') {
          op = '=';
        } else if (value.charAt(value.length - 1) === '/') {
          op = 'likeRight';
        } else {
          op = '=';
        }
      }
      const operator = { op };
      return ctx.$meta.util._combineSearchClause({ dataKey, property, value, operator });
    },
  },
};
