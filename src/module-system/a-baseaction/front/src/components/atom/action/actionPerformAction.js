export default {
  methods: {
    async _onActionPerformAction() {
      // form
      const formHandle = await this.base_handleActionForm();
      if (formHandle) return;
      // perform
      await this._onActionPerformActionPerform();
    },
    async _onActionPerformActionPerform() {
      const { ctx, action, item } = this.$props;
      // confirm
      await this.base_handleConfirm();
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
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
      let res = await ctx.$api.post('/a/base/atom/performAction', {
        key,
        atomClass,
        action: action.name,
        // item, //form data
        options,
      });
      // progress
      const progressId = res && res.progressId;
      if (progressId) {
        const title = this.base_getDialogTitle();
        res = await ctx.$view.dialog.progressbar({ progressId, title });
      }
      // action after
      await this.base_handleActionAfter({ key, atomClass });
      // toast
      this.base_handleToast();
    },
  },
};
