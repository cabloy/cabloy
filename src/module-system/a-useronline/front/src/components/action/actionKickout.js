export default {
  methods: {
    async _onActionKickOut() {
      const { ctx, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/useronline/userOnline/kickOut', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
      return true;
    },
  },
};
