export default {
  methods: {
    async _onActionViewHistory() {
      const { ctx, item } = this.$props;
      const atomIdFormal = item.atomStage === 1 ? item.atomId : item.atomIdFormal;
      if (!atomIdFormal) return;
      // options
      const options = {
        where: {
          'a.atomIdFormal': atomIdFormal,
        },
        stage: 'history',
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
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      ctx.$view.navigate(url, {
        // target: '_self'
      });
    },
  },
};
