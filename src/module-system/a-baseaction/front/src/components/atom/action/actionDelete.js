export default {
  methods: {
    async _onActionDelete() {
      const { ctx, action, item } = this.$props;
      // delete
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = { module: item.module, atomClassName: item.atomClassName };
      await ctx.$api.post('/a/base/atom/delete', { key, atomClass });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action });
      // update formal
      if (item.atomStage === 0 && item.atomIdFormal) {
        ctx.$meta.eventHub.$emit('atom:action', {
          key: { atomId: item.atomIdFormal },
          atomClass,
          action: { name: 'save' },
        });
      }
      // back
      if (ctx.index?.layoutManagerScene === 'item') {
        ctx.$f7router.back();
      }
    },
  },
};
