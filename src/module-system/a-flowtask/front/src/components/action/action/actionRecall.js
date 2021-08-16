export default {
  methods: {
    async _onActionRecall() {
      const { ctx } = this.$props;
      await ctx.$view.dialog.confirm(ctx.$text('RecallPrompt'));
      await ctx.$api.post('/a/flowtask/task/recall', {
        flowTaskId: this.flowTaskId,
      });
      await this.flowLayoutManager.base_loadData();
    },
  },
};
