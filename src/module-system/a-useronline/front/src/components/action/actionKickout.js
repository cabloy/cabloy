export default {
  methods: {
    async _onActionKickOut() {
      const { ctx, item } = this.$props;
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      await ctx.$api.post('/a/useronline/userOnline/kickOut', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' } });
      return true;
    },
  },
};
