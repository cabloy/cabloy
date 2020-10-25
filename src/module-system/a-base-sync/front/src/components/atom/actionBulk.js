export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'deleteBulk') {
        return await this.onAction_deleteBulk({ ctx, item });
      } else if (action.name === 'exportBulk') {
        return await this.onAction_exportBulk({ ctx, item });
      }
    },
    async onAction_deleteBulk({ ctx, item }) {
      // delete
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = { id: item.atomClassId };
      // keys
      const selectedAtoms = ctx.layoutManager.bulk.selectedAtoms;
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
    async onAction_exportBulk({ ctx, item }) {

    },
  },
};
