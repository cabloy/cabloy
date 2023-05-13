export default {
  methods: {
    async _onActionBulkDraftStats() {
      const { ctx, item } = this.$props;
      // url
      const options = {
        stage: 'draft',
        mine: 1,
      };
      const queries = {
        module: item.module,
        atomClassName: item.atomClassName,
        options: JSON.stringify(options),
      };
      const url = this.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      // navigate
      ctx.$view.navigate(url, { target: '_self' });
    },
  },
};
