export default {
  methods: {
    async _onActionRead() {
      const { ctx, item } = this.$props;
      // queries
      const queries = {
        mode: 'view',
        atomId: item.atomId,
        itemId: item.itemId,
      };
      const module = item.module;
      const atomClassName = item.atomClassName;
      if (module && atomClassName) {
        queries.module = module;
        queries.atomClassName = atomClassName;
      }
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      ctx.$view.navigate(url, {
        // target: '_self'
      });
    },
  },
};
