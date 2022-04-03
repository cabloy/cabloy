export default {
  methods: {
    async _onActionMove() {
      const { ctx, action, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      // select role
      const roleIdParent = await this._onActionMove_selectRole({ ctx, item });
      // move
      const data = await ctx.$api.post('/a/baseadmin/role/move', { key });
      // progress
      const progressId = data.progressId;
      await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
      ctx.$meta.eventHub.$emit('atom:action', { key, action });
      // back
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        ctx.$f7router.back();
      }
    },
    async _onActionMove_selectRole({ ctx, item }) {
      return new Promise((resolve, reject) => {
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
              roleIdDisable: item.itemId,
              // catalogOnly: true,
            },
            callback: (code, data) => {
              if (code === 200) {
                const roleIdParent = data.id;
                if (item.roleIdParent === roleIdParent) {
                  reject(new Error());
                }
                resolve(roleIdParent);
              }
            },
          },
        });
      });
    },
  },
};
