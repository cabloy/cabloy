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
              console.log(data);
              this._onActionForward_handle({ userId: data.id });
            }
          },
        },
      });
    },
    async _onActionForward_handle({ userId }) {
      const { flowLayoutManager, task, flowTaskId } = this.$data;

      await flowLayoutManager.base_loadData();
    },
  },
};
