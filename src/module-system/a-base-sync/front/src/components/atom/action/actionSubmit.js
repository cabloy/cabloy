export default {
  methods: {
    async _onActionSubmit() {
      const { ctx, item } = this.$props;
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      const data = await ctx.$api.post('/a/base/atom/writeSubmit', { key, item });
      if (data.formal) {
        // delete draft
        if (item.atomStage === 0) {
          ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'delete' } });
        }
        // update formal
        ctx.$meta.eventHub.$emit('atom:action', { key: data.formal.key, action: { name: 'save' } });
        // back
        ctx.$f7router.back();
      } else {
        // flow
        const flow = data.flow;
        // update draft
        ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
        // navigate replace self
        const url = `/a/flowtask/flow?flowId=${flow.id}`;
        ctx.$view.navigate(url, {
          target: '_self',
          reloadCurrent: true,
        });
      }
    },
  },
};
