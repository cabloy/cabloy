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
      if (ctx.index?.layoutManagerScene === 'item') {
        navigateOptions = { target: '_self' };
      }
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
