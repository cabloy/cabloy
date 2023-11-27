export default {
  methods: {
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
