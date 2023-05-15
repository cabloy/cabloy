export default {
  methods: {
    async _onActionBulkDelete() {
      const { ctx, action, item } = this.$props;
      // confirm
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // params
      const params = { atomClass, options: {} };
      // atomIdMain
      if (dataOptions.atomIdMain) {
        params.options.atomIdMain = dataOptions.atomIdMain;
      }
      // keys
      const selectedAtoms = ctx.bulk.selectedAtoms;
      const keys = selectedAtoms.map(item => {
        return { atomId: item.atomId, itemId: item.itemId };
      });
      params.keys = keys;
      // deleteBulk
      const res = await ctx.$api.post('/a/base/atom/deleteBulk', params);
      // delete
      for (const key of res.keys) {
        // selected
        const index = selectedAtoms.findIndex(_item => _item.atomId === key.atomId);
        if (index > -1) {
          selectedAtoms.splice(index, 1);
        }
        // action
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'delete' } });
      }
      // check result
      if (res.keys.length === keys.length) return true;
      return this.$text('DeleteBulkNotAllDone');
    },
  },
};
