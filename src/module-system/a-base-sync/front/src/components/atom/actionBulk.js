export default {
  meta: {
    global: false,
  },
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    async onAction() {
      if (this.action.name === 'deleteBulk') {
        return await this.onAction_deleteBulk();
      } else if (this.action.name === 'exportBulk') {
        return await this.onAction_exportBulk();
      }
    },
    async onAction_deleteBulk() {
      const ctx = this.ctx;
      const item = this.item;
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
    async onAction_exportBulk() {
      const ctx = this.ctx;
      const item = this.item;
      // confirm
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = { id: item.atomClassId };
      // options
      let options;
      const selectParams = ctx.base_prepareSelectParams();
      const selectedAtoms = ctx.bulk.selectedAtoms;
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
      const fields = ctx.base_getExportFields();
      // export
      const res = await ctx.$api.post('/a/base/atom/exportBulk', { atomClass, options, fields });
      this.$meta.eventHub.$emit('export:action', { action: 'create', fileId: res.fileId });
      // open
      const url = this.$meta.util.combineQueries('/a/user/user/exports', { recent: res.fileId });
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
