export default {
  methods: {
    async _onActionDisable() {
      const { ctx, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/disable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
  },
};
