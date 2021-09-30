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
              return this.$api.post('/a/flowchart/flowDef/userSelect', {
                host: this.host,
                params: {
                  query,
                  page,
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              const _user = this.assignees.users.find(item => item.id === data.id);
              if (!_user) {
                this.assignees.users.push(data);
              }
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
