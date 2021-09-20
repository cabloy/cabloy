const __DateRangeDefault = {
  ebParams: {
    dateFormat: 'YYYY-MM-DD',
    header: false,
    toolbar: false,
  },
  ebRender: {
    actionModule: 'a-user',
    actionComponent: 'action',
    name: 'dateRange',
  },
  // ebRender: {
  //   actionModule: 'a-basefront',
  //   actionComponent: 'componentAction',
  //   name: 'dateRange',
  // },
  ebSearch: {
    combine: {
      actionModule: 'a-baselayout',
      actionComponent: 'combineSearch',
      name: 'createdAt',
    },
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
