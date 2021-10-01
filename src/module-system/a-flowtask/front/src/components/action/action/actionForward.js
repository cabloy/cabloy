export default {
  methods: {
    async _onActionForward() {
      const { ctx } = this.$props;
      const { flowTaskId } = this.$data;
      ctx.$view.navigate('/a/baseadmin/user/select', {
        // target: '_self',
        context: {
          params: {
            onFetchUsers: ({ query, page }) => {
              return this.$api.post('/a/flowtask/task/userSelectForward', {
                flowTaskId,
                params: {
                  query,
                  page,
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              this._onActionForward_handle({ userId: data.id });
            }
          },
        },
      });
    },
    async _onActionForward_handle({ userId }) {
      const { ctx } = this.$props;
      const { flowLayoutManager, flowTaskId } = this.$data;
      await ctx.$api.post('/a/flowtask/task/forward', {
        flowTaskId,
        handle: {
          assignee: userId,
          remark,
        },
      });
      await flowLayoutManager.base_loadData();
    },
  },
};
