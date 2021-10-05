export default {
  methods: {
    async _onActionCancelFlow() {
      const { ctx } = this.$props;
      // ensure claim
      await this._ensureClaimed();
      // cancel flow
      ctx.$refs.actionCancelFlow.open({
        flowLayoutManager: this.flowLayoutManager,
        flowTaskId: this.flowTaskId,
      });
    },
  },
};
