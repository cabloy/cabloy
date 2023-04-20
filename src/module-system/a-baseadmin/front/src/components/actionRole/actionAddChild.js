export default {
  methods: {
    async _onActionAddChild() {
      const { ctx, action, item } = this.$props;
      try {
        // add
        const key = { atomId: item.atomId, itemId: item.itemId };
        const atomClass = {
          module: item.module,
          atomClassName: item.atomClassName,
        };
        const data = await ctx.$api.post('/a/baseadmin/role/addChild', { key });
        const keyChild = data.key;
        const atomChild = data.atom;
        // progress
        const progressId = data.progressId;
        await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
        // event
        ctx.$meta.eventHub.$emit('atom:action', {
          key: keyChild,
          atomClass,
          action: { name: 'addChildNode' },
          node: { parentId: atomChild.roleIdParent },
        });
        // open
        const url = ctx.$meta.util.replaceTemplate(
          '/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}',
          atomChild
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
