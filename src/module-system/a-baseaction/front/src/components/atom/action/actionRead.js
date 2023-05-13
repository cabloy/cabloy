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
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      // open
      const navigateOptions = Object.assign(
        {},
        {
          context: {
            params: { atomMain: dataOptions.atomMain },
          },
        }
      );
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
