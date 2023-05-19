export default {
  methods: {
    async _onActionSpreadsBulk() {
      const { ctx, action } = this.$props;
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // options
      const options = {
        atomIdMain: dataOptions.atomIdMain,
      };
      // params
      const params = {
        //  pageTitle: `${this.$text('Atom Right')}: ${item.atomNameLocale || item.atomName}`,
      };
      // queries
      const queries = {
        module: 'a-base',
        atomClassName: 'roleRightSpread',
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
      navigateOptions = Object.assign({}, navigateOptions, {
        context: {
          params: { atomMain: dataOptions.atomMain },
        },
      });
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
