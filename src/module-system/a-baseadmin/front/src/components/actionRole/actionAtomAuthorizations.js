export default {
  methods: {
    async _onActionAtomAuthorizations() {
      const { ctx, action, item } = this.$props;
      // atomAuthorizations
      // options
      const options = {
        atomIdMain: item.atomId,
      };
      // params
      const params = {
        pageTitle: `${this.$text('Atom Right')}: ${item.atomNameLocale || item.atomName}`,
      };
      // queries
      const queries = {
        module: 'a-base',
        atomClassName: 'roleRight',
        options: JSON.stringify(options),
        params: JSON.stringify(params),
      };
      // url
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      // const url = ctx.$meta.util.replaceTemplate(
      //   '/a/baseadmin/atomRight/edit?roleAtomId={{atomId}}&roleId={{itemId}}',
      //   item
      // );
      // open
      let navigateOptions = action.navigateOptions;
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        navigateOptions = { target: '_self' };
      }
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
