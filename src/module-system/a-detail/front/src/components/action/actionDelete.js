export default {
  methods: {
    async _onActionDelete() {
      const { ctx, action } = this.$props;
      // delete
      await ctx.$view.dialog.confirm();
      // delete
      await ctx.$api.post('/a/detail/detail/delete', {
        flowTaskId: this.flowTaskId,
        key: this.detailKey,
      });
      // event
      ctx.$meta.eventHub.$emit('detail:action', {
        atomKey: this.atomKey,
        detailClass: this.detailClass,
        key: this.detailKey,
        action,
      });
      // back
      if (ctx.index?.layoutManagerScene === 'item') {
        ctx.$f7router.back();
      }
    },
  },
};
