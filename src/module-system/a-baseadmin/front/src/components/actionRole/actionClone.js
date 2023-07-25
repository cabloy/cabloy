export default {
  methods: {
    async _onActionClone() {
      const { ctx, action, item } = this.$props;
      await ctx.$view.dialog.confirm();
      try {
        // clone
        const key = { atomId: item.atomId, itemId: item.itemId };
        const atomClass = {
          module: item.module,
          atomClassName: item.atomClassName,
        };
        const data = await ctx.$api.post('/a/baseadmin/role/clone', { key });
        const dataRes = data.draft || data.formal;
        const keyDraft = dataRes.key;
        const atomDraft = dataRes.atom;
        // progress
        const progressId = data.progressId;
        await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
        // event
        ctx.$meta.eventHub.$emit('atom:action', {
          key: keyDraft,
          atomClass,
          action: { name: 'addChildNode' },
          node: { parentId: atomDraft.roleIdParent },
        });
        // open
        const url = ctx.$meta.util.replaceTemplate(
          '/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}',
          atomDraft
        );
        let navigateOptions = action.navigateOptions;
        if (ctx.index?.layoutManagerScene === 'item') {
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
