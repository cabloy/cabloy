export default {
  methods: {
    async _onActionAssigneesConfirmation() {
      const { ctx } = this.$props;
      // assignees
      const assignees = await ctx.$api.post('/a/flowtask/task/assignees', {
        flowTaskId: this.flowTaskId,
      });
      // navigate options
      const navigateOptions = {
        context: {
          params: {
            flowTaskId: this.flowTaskId,
            assignees,
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
      const url = `/a/flowtask/flowTaskAction/assigneesConfirmation?flowTaskId=${this.flowTaskId}`;
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
