export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'partyOver') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionPartyOver({ ctx, key });
      } else if (action.name === 'enable') {
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
      // deleteBulk
      const res = await ctx.$api.post('/a/base/atom/deleteBulk', { atomClass, keys });
      // delete
      for (const key of res.keys) {
        // selected
        const index = selectedAtoms.findIndex(_item => _item.atomId === key.atomId);
        if (index > -1) {
          selectedAtoms.splice(index, 1);
        }
        // action
        ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'delete' } });
      }
      // check result
      if (res.keys.length === keys.length) return true;
      return this.$text('DeleteBulkNotAllDone');
    },
  },
};
