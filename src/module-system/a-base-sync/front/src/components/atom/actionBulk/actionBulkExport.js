export default {
  methods: {
    async _onActionBulkExport() {
      const { ctx, item } = this.$props;
      // confirm
      await ctx.$view.dialog.confirm();
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // atomClassBase
      const useStoreAtomClasses = await ctx.$store.use('a/base/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
      // options
      let options;
      const selectParams = ctx.base_prepareSelectParams();
      const selectedAtoms = ctx.bulk.selectedAtoms;
      if (selectedAtoms.length > 0) {
        const idFieldName = atomClassBase.itemOnly ? 'f.id' : 'a.id';
        const keys = selectedAtoms.map(item => {
          return { atomId: item.atomId, itemId: item.itemId };
        });
        options = {
          where: {
            [idFieldName]: keys.map(key => key.atomId),
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
