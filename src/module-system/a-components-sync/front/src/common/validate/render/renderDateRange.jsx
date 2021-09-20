export default {
  methods: {
    renderDateRange(context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ...property,
          ebRender: {
            actionModule: 'a-basefront',
            actionComponent: 'componentAction',
            name: 'dateRange',
          },
        };
        context = {
          ...context,
          property,
        };
      }
      return this.renderComponentAction(context);
    },
  },
};
