export default {
  methods: {
    async _onActionSave() {
      const { ctx, action } = this.$props;
      await ctx.$api.post('/a/detail/detail/write', {
        flowTaskId: this.flowTaskId,
        key: this.detailKey,
        item: this.detailItem,
      });
      ctx.$meta.eventHub.$emit('detail:action', {
        atomKey: this.atomKey,
        detailClass: this.detailClass,
        key: this.detailKey,
        action,
      });
      // toast
      return ctx.$text('Saved');
    },
  },
};
