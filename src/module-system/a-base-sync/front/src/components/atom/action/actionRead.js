export default {
  methods: {
    async _onActionRead() {
      const { ctx, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
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
      ctx.$view.navigate(url, {
        // target: '_self'
      });
    },
  },
};
