export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.getDetailAction(action);
      if (!_action) return;
      const res = await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
      this.$meta.util.swipeoutClose(event.currentTarget);
      return res;
    },
    async item_onItemClick(event, item) {
      return await this.item_onAction(event, item, {
        module: item.module,
        detailClassName: item.detailClassName,
        name: this.container.mode === 'view' ? 'read' : 'write',
      });
    },
    item_getActionTitle(action) {
      return this.getDetailActionTitle(action);
    },
    // item_getActionColor(action /* , index*/) {
    //   if (action.code === 3) return 'orange';
    //   if (action.code === 4) return 'red';
    //   return 'blue';
    // },
  },
};
