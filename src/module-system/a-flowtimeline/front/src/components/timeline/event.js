export default {
  created() {
    this.$meta.eventHub.$on('flow:action', this.event_onActionFlow);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('flow:action', this.event_onActionFlow);
  },
  methods: {
    async event_onActionFlow(data) {
      const flowId = data.flowId;
      const action = data.action;
      const actionSource = data.actionSource;
      if (flowId !== this.base_flow?.flowId) return;
      if (actionSource === this) return;
      // action
      if (action === 'reload') {
        await this.base_loadData();
      }
    },
  },
};
