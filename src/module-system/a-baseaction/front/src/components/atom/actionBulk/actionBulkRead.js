export default {
  methods: {
    async _onActionBulkRead() {
      const { ctx, action, item } = this.$props;
      // options
      const options = {
        language: item.language,
        category: item.category,
        stage: item.stage || 'formal',
      };
      // params
      // const params = {
      //   pageTitle: `${this.$text('History')}: ${item.atomName}`,
      // };
      // queries
      const queries = {
        module: item.module,
        atomClassName: item.atomClassName,
        options: JSON.stringify(options),
        // params: JSON.stringify(params),
      };
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      // navigateOptions(.target)
      ctx.$view.navigate(url, action.navigateOptions);
    },
  },
};
