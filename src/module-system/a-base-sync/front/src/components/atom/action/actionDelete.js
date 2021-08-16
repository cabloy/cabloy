export default {
  methods: {
    async _onActionDelete() {
      // delete
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/delete', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action });
      // back
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        ctx.$f7router.back();
      }
    },
  },
};
