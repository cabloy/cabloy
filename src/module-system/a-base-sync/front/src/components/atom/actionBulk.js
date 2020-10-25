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
      // confirm
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
      // confirm
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = { id: item.atomClassId };
      // options
      let options;
      const selectParams = ctx.layoutManager.base_prepareSelectParams();
      const selectedAtoms = ctx.layoutManager.bulk.selectedAtoms;
      if (selectedAtoms.length > 0) {
        const keys = selectedAtoms.map(item => {
          return { atomId: item.atomId, itemId: item.itemId };
        });
        options = {
          where: {
            'a.id': keys.map(key => key.atomId),
          },
          stage: selectParams.options.stage,
        };
      } else {
        options = selectParams.options;
      }
      // fields
      const fields = ctx.layoutManager.base_getExportFields();
      // export
      const res = await ctx.$api.post('/a/base/atom/exportBulk', { atomClass, options, fields });
      const url = this.$meta.util.combineQueries('/a/user/user/exports', { recent: res.fileId });
      // open
      const inPanel = ctx.$view.inPanel();
      const showPanel = ctx.$meta.vueApp.layout === 'pc' && !inPanel;
      const navigateOptions = {};
      if (showPanel) {
        navigateOptions.scene = 'sidebar';
        navigateOptions.sceneOptions = { side: 'right', name: 'exports', title: 'Exports' };
      } else {
        navigateOptions.target = '_self';
      }
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
