export default {
  methods: {
    async item_onActionByModeFlow(event, item, action) {
      const task = action.__task;
      const url = `/a/flowtask/flow?flowId=${task.flowId}&flowTaskId=${task.flowTaskId}`;
      this.$view.navigate(url);
    },
    async item_onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      await this.$meta.util.performAction({ ctx: this, action: _action, item });
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async item_onActionView(event, item) {
      let actionName = this.$meta.util.getProperty(this.container.params, 'actionOnClick');
      if (!actionName) {
        if (item.atomStage === 0 && item.atomClosed === 0 && item.atomFlowId === 0) {
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
