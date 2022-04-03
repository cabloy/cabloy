export default {
  methods: {
    async _onActionAddChild() {
      const { ctx, action, item } = this.$props;
      try {
        // add
        const key = { atomId: item.atomId, itemId: item.itemId };
        const data = await ctx.$api.post('/a/baseadmin/role/addChild', { key });
        const dataRes = data.draft || data.formal;
        const keyDraft = dataRes.key;
        const atomDraft = dataRes.atom;
        // progress
        const progressId = data.progressId;
        await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
        // event
        ctx.$meta.eventHub.$emit('atom:action:ext', { key: keyDraft, action: { name: 'addChild' }, atom: atomDraft });
        // open
        const url = ctx.$meta.util.replaceTemplate(
          '/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}',
          atomDraft
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
