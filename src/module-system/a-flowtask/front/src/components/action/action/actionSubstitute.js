export default {
  methods: {
    async _onActionSubstitute() {
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
      const url = `/a/flowtask/flowTaskAction/substitute?flowTaskId=${this.flowTaskId}`;
      ctx.$view.navigate(url, navigateOptions);
    },
    async _onActionSubstituteRecall() {
      const { ctx } = this.$props;
      await ctx.$view.dialog.confirm(ctx.$text('SubstituteRecallPrompt'));
      await ctx.$api.post('/a/flowtask/task/substituteRecall', {
        flowTaskId: this.flowTaskId,
      });
      await this.flowLayoutManager.base_loadData();
    },
  },
};
