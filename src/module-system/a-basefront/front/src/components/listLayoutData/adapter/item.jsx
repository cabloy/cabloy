export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.layoutManager.getAction(action);
      if (!_action) return;
      await this.$meta.util.performAction({ ctx: this.layoutManager, action: _action, item });
      this.$meta.util.swipeoutClose(event.target);
    },
    async item_onClick(event, item) {
      return await this.item_onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read',
      });
    },
  },
};
