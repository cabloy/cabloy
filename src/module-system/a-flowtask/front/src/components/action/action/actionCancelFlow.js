export default {
  methods: {
    async _onActionCancelFlow() {
      const { ctx } = this.$props;
      ctx.$refs.actionCancelFlow.open({
        flowLayoutManager: this.flowLayoutManager,
        flowTaskId: this.flowTaskId,
      });
    },
  },
};
