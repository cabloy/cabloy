export default {
  methods: {
    async _onActionClone() {
      const { ctx, action, item } = this.$props;
      await ctx.$view.dialog.confirm();
      try {
        const key = { atomId: item.atomId, itemId: item.itemId };
        const data = await ctx.$api.post('/a/base/atom/clone', { key });
        const keyDraft = data.draft.key;
        const _item = {
          ...item,
          atomId: keyDraft.atomId,
          itemId: keyDraft.itemId,
        };
        const url = ctx.$meta.util.replaceTemplate(
          '/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}',
          _item
        );
        let navigateOptions = action.navigateOptions;
        if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
          navigateOptions = { target: '_self' };
        }
        ctx.$view.navigate(url, navigateOptions);
      } catch (err) {
        if (err.code === 422) {
          throw new Error(err.message[0].message);
        }
        throw err;
      }
    },
  },
};
