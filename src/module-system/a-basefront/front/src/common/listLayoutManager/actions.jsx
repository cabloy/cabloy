import Vue from 'vue';
export default {
  data() {
    return {};
  },
  methods: {
    async actions_fetchActions(item) {
      if (item._actions) return item._actions;
      // fetch
      let actions = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        atomClass: this.base.atomClass,
        mode: this.container.mode,
        // basic: !this.$device.desktop,
      });
      // filter
      actions = actions.filter(action => {
        if (action.actionMode === 1) return true;
        const _action = this.getAction(action);
        // filter: view/disableOnList
        return action.code !== 2 && !_action.disableOnList;
      });
      // workflow
      if (item.atomStage === 0 && item.atomFlowId > 0) {
        actions.push({
          module: item.module,
          atomClassName: item.atomClassName,
          name: 'workflow',
        });
      }
      // set
      Vue.set(item, '_actions', actions);
      return item._actions;
    },
  },
};
