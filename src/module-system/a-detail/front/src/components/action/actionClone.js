export default {
  methods: {
    async _onActionClone() {
      const { ctx, action } = this.$props;
      try {
        const keyDest = await ctx.$api.post('/a/detail/detail/clone', {
          flowTaskId: this.flowTaskId,
          key: this.detailKey,
        });
        const _item = {
          ...this.detailItem,
          detailId: keyDest.detailId,
          detailItemId: keyDest.detailItemId,
        };
        // event
        ctx.$meta.eventHub.$emit('detail:action', {
          atomKey: this.atomKey,
          detailClass: this.detailClass,
          key: keyDest,
          action: { name: 'create' },
        });
        // write
        const actionsAll = await ctx.$store.dispatch('a/base/getDetailActions');
        let actionWrite = actionsAll[this.detailItem.module][this.detailItem.detailClassName].write;
        actionWrite = ctx.$utils.extend({}, actionWrite);
        if (ctx.index?.layoutManagerScene === 'item') {
          actionWrite.navigateOptions = { target: '_self' };
        } else {
          actionWrite.navigateOptions = action.navigateOptions;
        }
        await ctx.$meta.util.performAction({
          ctx,
          action: actionWrite,
          item: {
            item: _item,
            meta: this.meta,
          },
        });
      } catch (err) {
        if (err.code === 422) {
          throw new Error(err.message[0].message);
        }
        throw err;
      }
    },
  },
};
