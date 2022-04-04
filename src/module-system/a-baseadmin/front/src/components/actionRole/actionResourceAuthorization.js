export default {
  methods: {
    async _onActionResourceAuthorization() {
      const { ctx, action, item } = this.$props;
      // resourceAuthorization
      // open
      const url = ctx.$meta.util.replaceTemplate(
        '/a/baseadmin/resourceRight/edit?roleAtomId={{atomId}}&roleId={{itemId}}',
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
