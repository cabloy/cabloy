export default {
  methods: {
    async _onActionMove() {
      const { ctx, /* action,*/ item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      // select role
      const roleIdParent = await this._onActionMove_selectRole({ ctx, item });
      if (!roleIdParent) return;
      // move
      const data = await ctx.$api.post('/a/baseadmin/role/move', {
        key,
        data: { roleIdParent },
      });
      // progress
      const progressId = data.progressId;
      await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
      // action: create/delete/save
      const atom = { ...item, roleIdParent };
      ctx.$meta.eventHub.$emit('atom:action:ext', { key, action: { name: 'move' }, atom });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' }, actionSource: ctx });
    },
    async _onActionMove_selectRole({ ctx, item }) {
      return new Promise(resolve => {
        let target;
        if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
          target = '_self';
        }
        ctx.$view.navigate('/a/baseadmin/role/select', {
          target,
          context: {
            params: {
              roleIdStart: null,
              multiple: false,
              roleIdsDisable: [item.itemId, item.roleIdParent],
              // catalogOnly: true,
            },
            callback: (code, data) => {
              if (code === 200) {
                resolve(data.id);
              } else if (code === false) {
                resolve();
              }
            },
          },
        });
      });
    },
  },
};
