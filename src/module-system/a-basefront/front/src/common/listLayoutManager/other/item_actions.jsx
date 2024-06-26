export default {
  methods: {
    async item_onActionByModeFlow(event, item, action) {
      const task = action.__task;
      const url = `/a/flowtask/flow?flowId=${task.flowId}&flowTaskId=${task.flowTaskId}`;
      this.$view.navigate(url);
    },
    async item_onAction(event, item, action) {
      let _action = this.getAction(action);
      if (!_action) return;
      // dataOptions
      const dataOptions = {
        atomIdMain: this.base_atomIdMain,
        atomMain: this.base_atomMain,
      };
      if (this.base_flowTaskId) {
        dataOptions.flowTaskId = this.base_flowTaskId;
      }
      if (this.base_formActionMain) {
        dataOptions.formActionMain = this.base_formActionMain;
      }
      // not use this.$utils.extend
      _action = Object.assign({}, _action, { dataOptions });
      await this.$meta.util.performAction({ ctx: this, action: _action, item });
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async item_onActionView(event, item) {
      let actionName = this.$meta.util.getProperty(this.container.params, 'actionOnClick');
      if (!actionName) {
        if (this.container.mode === 'edit') {
          // for detail
          actionName = 'write';
        } else if (item.atomStage === 0 && item.atomClosed === 0 && item.atomFlowId === 0) {
          // for draft
          actionName = 'write';
        } else {
          actionName = 'read';
        }
      }
      const action = {
        module: item.module,
        atomClassName: item.atomClassName,
        name: actionName,
      };
      return await this.item_onAction(event, item, action);
    },
    item_getActionTitle(action, item) {
      return this.getActionTitle(action, item);
    },
    // item_getActionColor(action /* , index*/) {
    //   if (action.actionMode === 1) return 'teal';
    //   if (action.code === 3) return 'orange';
    //   if (action.code === 4) return 'red';
    //   return 'blue';
    // },
  },
};
