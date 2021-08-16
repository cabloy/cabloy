export default {
  methods: {
    async _onActionWorkflow() {
      const { ctx, item } = this.$props;
      const flowId = item.atomFlowId;
      const url = `/a/flowtask/flow?flowId=${flowId}`;
      ctx.$view.navigate(url, {});
    },
  },
};
