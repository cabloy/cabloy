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
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      ctx.$view.navigate(url, {
        // target: '_self'
      });
    },
  },
};
