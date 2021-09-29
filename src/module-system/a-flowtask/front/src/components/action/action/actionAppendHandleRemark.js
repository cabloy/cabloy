export default {
  methods: {
    async _onActionAppendHandleRemark() {
      const { ctx } = this.$props;
      const { task, flowTaskId } = this.$data;
      const remark = await ctx.$view.dialog.prompt(this.$text('Please specify the handle remark'));
      if (!remark) return;
      await ctx.$api.post('/a/flowtask/task/appendHandleRemark', {
        flowTaskId,
        handle: { remark },
      });
      task.handleRemark = remark;
    },
  },
};
