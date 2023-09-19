export default {
  created() {
    this.$meta.eventHub.$on('flow:action', this.event_onActionFlow);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('flow:action', this.event_onActionFlow);
  },
  methods: {
    async base_emitActionReload({ flowId, atomChanged, disableSelf }) {
      if (atomChanged) {
        this.base_emitAtomActionSave();
        if (!disableSelf) {
          await this.base_loadData_autoCheck();
        }
      } else {
        if (!disableSelf) {
          await this.base_loadData();
        }
      }
      this.$meta.eventHub.$emit('flow:action', {
        flowId,
        action: { name: 'reload' },
        actionSource: this,
        autoCheck: atomChanged,
      });
    },
    async event_onActionFlow(data) {
      const flowId = data.flowId;
      const action = data.action;
      const actionSource = data.actionSource;
      if (flowId !== this.base_flow?.flowId) return;
      if (actionSource === this) return;
      // action
      if (action === 'reload') {
        if (data.autoCheck) {
          await this.base_loadData_autoCheck();
        } else {
          await this.base_loadData();
        }
      }
    },
  },
};
