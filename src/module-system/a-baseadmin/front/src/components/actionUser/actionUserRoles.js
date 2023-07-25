export default {
  methods: {
    async _onActionUserRoles() {
      const { ctx, action, item } = this.$props;
      // includes
      // open
      const url = ctx.$meta.util.replaceTemplate(
        '/a/baseadmin/user/userRoles?userAtomId={{atomId}}&userId={{itemId}}',
        item
      );
      let navigateOptions = action.navigateOptions;
      if (ctx.index?.layoutManagerScene === 'item') {
        navigateOptions = { target: '_self' };
      }
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
