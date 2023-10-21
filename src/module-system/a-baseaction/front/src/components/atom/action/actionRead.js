export default {
  methods: {
    async _onActionRead() {
      const { ctx, action, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // queries
      const queries = {
        mode: 'view',
        atomId: item.atomId,
        itemId: item.itemId,
        ...atomClass,
      };
      this.base_prepareOptionsFromDataOptions(queries, dataOptions);
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      // open
      let navigateOptions = action.navigateOptions;
      navigateOptions = Object.assign({}, navigateOptions, {
        context: {
          params: { atomMain: dataOptions.atomMain },
        },
      });
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
