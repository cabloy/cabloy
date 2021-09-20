const __DateRangeDefault = {
  ebRender: {
    actionModule: 'a-basefront',
    actionComponent: 'componentAction',
    name: 'dateRange',
  },
};
export default {
  methods: {
    renderDateRange(context) {
      let { property } = context;
      property = this.$meta.util.extend({}, __DateRangeDefault, property);
      context = {
        ...context,
        property,
      };
      return this.renderComponentAction(context);
    },
  },
};
