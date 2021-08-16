export default {
  methods: {
    async _onActionWrite() {
      const { ctx, action } = this.$props;
      const queries = {
        mode: 'edit',
        detailId: this.detailItem.detailId,
        detailItemId: this.detailItem.detailItemId,
        flowTaskId: this.flowTaskId,
      };
      const url = ctx.$meta.util.combineQueries('/a/detail/detail/item', queries);
      ctx.$view.navigate(url, action.navigateOptions);
    },
  },
};
