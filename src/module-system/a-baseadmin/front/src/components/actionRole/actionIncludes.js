export default {
  methods: {
    async _onActionIncludes() {
      const { ctx, action, item } = this.$props;
      // includes
      // open
      const url = ctx.$meta.util.replaceTemplate(
        '/a/baseadmin/role/includes?roleAtomId={{atomId}}&roleId={{itemId}}',
        item
      );
      let navigateOptions = action.navigateOptions;
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        navigateOptions = { target: '_self' };
      }
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
