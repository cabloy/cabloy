export default {
  methods: {
    async _onActionSubmit() {
      const { ctx, item } = this.$props;
      // onActionSubmitBefore
      if (ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionSubmitBefore) {
        await ctx.layout.instanceExtend.onActionSubmitBefore(this.$props);
      }
      // confirm
      await ctx.$view.dialog.confirm(this.$text('AtomActionSubmitConfirm'));
      // submit
      const key = { atomId: item.atomId, itemId: item.itemId };
      const data = await ctx.$api.post('/a/base/atom/writeSubmit', { key, item });
      if (data.formal) {
        // delete draft
        if (item.atomStage === 0) {
          ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'delete' } });
          // list create
          ctx.$meta.eventHub.$emit('atom:action', {
            key: data.formal.key,
            action: { name: 'create' },
            atom: data.formal.atom,
          });
        }
        // update formal
        ctx.$meta.eventHub.$emit('atom:action', { key: data.formal.key, action: { name: 'save' }, actionSource: ctx });
        // back
        ctx.page_setDirty(false); // should before navigate
        ctx.$f7router.back();
      } else {
        // flow
        const flow = data.flow;
        // update draft
        ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' }, actionSource: ctx });
        // navigate replace self
        ctx.page_setDirty(false); // should before navigate
        const url = `/a/flowtask/flow?flowId=${flow.id}`;
        ctx.$view.navigate(url, {
          target: '_self',
          reloadCurrent: true,
        });
      }
    },
  },
};
