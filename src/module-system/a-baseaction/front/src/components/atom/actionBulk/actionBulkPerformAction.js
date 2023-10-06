export default {
  methods: {
    async _onActionBulkPerformAction() {
      const { ctx, action, item } = this.$props;
      // confirm
      await this.base_handleConfirm();
      // keys
      const selectedAtoms = ctx.bulk.selectedAtoms;
      const keys = selectedAtoms.map(item => {
        return { atomId: item.atomId, itemId: item.itemId };
      });
      // atomClass
      const atomClass = { module: item.module, atomClassName: item.atomClassName };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // onActionPerformActionBefore: should after form
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionPerformActionBefore) {
        await ctx.layout.instanceExtend.onActionPerformActionBefore(this.$props);
      }
      // options
      const options = {};
      // flowTaskId
      if (dataOptions.flowTaskId) {
        options.flowTaskId = dataOptions.flowTaskId;
      }
      // post
      const res = await ctx.$api.post('/a/base/atom/performActionBulk', {
        keys,
        atomClass,
        action: action.name,
        // item, //form data
        options,
      });
      // progress
      const progressId = res && res.progressId;
      if (progressId) {
        const title = this.base_getDialogTitle();
        await ctx.$view.dialog.progressbar({ progressId, title });
      }
      // action after
      await this.base_handleActionAfterBulk({ keysRes: res.keys, atomClass });
      // toast
      this.base_handleToastBulk({ keysReq: keys, keysRes: res.keys });
    },
  },
};
