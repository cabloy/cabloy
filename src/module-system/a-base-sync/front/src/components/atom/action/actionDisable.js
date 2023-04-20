export default {
  methods: {
    async _onActionDisable() {
      const { ctx, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      await ctx.$api.post('/a/base/atom/disable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' } });
    },
  },
};
