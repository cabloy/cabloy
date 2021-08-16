export default {
  methods: {
    async _onActionWrite() {
      const { ctx, action, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      // openDraft
      const data = await ctx.$api.post('/a/base/atom/openDraft', { key });
      const keyWrite = data.draft ? data.draft.key : data.formal.key;
      const changed = data.changed;
      // navigate
      const _item = {
        ...item,
        atomId: keyWrite.atomId,
        itemId: keyWrite.itemId,
      };
      const url = ctx.$meta.util.replaceTemplate('/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}', _item);
      ctx.$view.navigate(url, action.navigateOptions);
      // event: neednot check atomStage
      // if (item.atomStage > 0) {
      //   ctx.$meta.eventHub.$emit('atom:actions', { key });
      // }
      if (changed) {
        ctx.$meta.eventHub.$emit('atom:actions', { key });
      }
    },
  },
};
