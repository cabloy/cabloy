export default {
  methods: {
    async _onActionBulkImport() {
      const { ctx, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // 1. upload file
      const file = await this._onActionBulkImport_uploadFile();
      if (!file) return;
      // 2. import file
      const res = await ctx.$api.post('/a/base/atom/importBulk', {
        atomClass,
        file: { downloadId: file.downloadId },
      });
      // 3. progress
      const progressId = res && res.progressId;
      if (progressId) {
        await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Import') });
      }
      // 4. reload
      ctx.page_onRefresh();
      // 5. toast
      ctx.$view.toast.show({ text: this.$text('ImportCompleted') });
    },
    async _onActionBulkImport_uploadFile() {
      const { ctx, action } = this.$props;
      return new Promise((resolve, reject) => {
        ctx.$view.navigate('/a/file/file/upload', {
          target: '_popup',
          context: {
            params: {
              mode: 2,
              accept: action.params.accept,
            },
            callback: (code, file) => {
              if (code === 200) {
                resolve(file);
              }
              if (code === false) {
                resolve(null);
              }
            },
          },
        });
      });
    },
  },
};
