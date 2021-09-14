export default {
  methods: {
    async _onActionCreate() {
      const { ctx, action } = this.$props;
      // create
      const key = await ctx.$api.post('/a/detail/detail/create', {
        flowTaskId: this.meta.flowTaskId,
        atomKey: this.atomKey,
        detailClass: this.detailClass,
        item: this.detailItem,
      });
      // event
      ctx.$meta.eventHub.$emit('detail:action', {
        atomKey: this.atomKey,
        detailClass: this.detailClass,
        key,
        action,
      });
      // menu
      if (action.actionComponent || action.actionPath) {
        const itemWrite = ctx.$utils.extend({}, this.detailItem, key);
        // write
        const actionsAll = await ctx.$store.dispatch('a/base/getDetailActions');
        let actionWrite = actionsAll[itemWrite.module][itemWrite.detailClassName].write;
        actionWrite = ctx.$utils.extend({}, actionWrite);
        await ctx.$meta.util.performAction({
          ctx,
          action: actionWrite,
          item: {
            item: itemWrite,
            meta: this.meta,
          },
        });
      }
      // just return key
      return key;
    },
  },
};
