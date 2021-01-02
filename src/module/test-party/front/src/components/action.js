export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'partyOver') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionPartyOver({ ctx, key });
      } else if (action.name === 'partyOverBulk') {
        return await this._onActionPartyOverBulk({ ctx, item });
      }
    },
    async _onActionPartyOver({ ctx, key }) {
      await ctx.$api.post('/test/party/party/over', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
    async _onActionPartyOverBulk({ ctx, item }) {
      // confirm
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = { id: item.atomClassId };
      // keys
      const selectedAtoms = ctx.bulk.selectedAtoms;
      const keys = selectedAtoms.map(item => {
        return { atomId: item.atomId, itemId: item.itemId };
      });
      // overBulk
      const res = await ctx.$api.post('/test/party/party/overBulk', { atomClass, keys });
      // change
      for (const key of res.keys) {
        // action
        ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
      }
      // clear selection
      ctx.bulk_clearSelectedAtoms();
      // check result
      if (res.keys.length === keys.length) return true;
      return this.$text('PartyOverBulkNotAllDone');
    },
  },
};
