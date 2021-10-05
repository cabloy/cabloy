export default {
  methods: {
    async _onActionForward() {
      const { ctx } = this.$props;
      // ensure claim
      await this._ensureClaimed();
      // navigate options
      const navigateOptions = {
        context: {
          params: {
            flowTaskId: this.flowTaskId,
          },
          callback: code => {
            if (code === 200) {
              this.flowLayoutManager.base_loadData().then(() => {});
            }
          },
        },
      };
      if (ctx.$pageRoute.path === '/a/flowtask/flowTaskAtom') {
        navigateOptions.target = '_self';
        navigateOptions.reloadCurrent = true;
      }
      // navigate
      const url = `/a/flowtask/flowTaskAction/forward?flowTaskId=${this.flowTaskId}`;
      ctx.$view.navigate(url, navigateOptions);
    },
    async _onActionForwardRecall() {
      const { ctx } = this.$props;
      await ctx.$view.dialog.confirm(ctx.$text('ForwardRecallPrompt'));
      await ctx.$api.post('/a/flowtask/task/forwardRecall', {
        flowTaskId: this.flowTaskId,
      });
      await this.flowLayoutManager.base_loadData();
    },
  },
};
