import Vue from 'vue';
export default {
  data() {
    return {};
  },
  methods: {
    async actions_fetchActions(item) {
      if (item._actions) return item._actions;
      // fetch
      const options = this.base_prepareReadOptions();
      let actions = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        atomClass: this.base.atomClass,
        options,
        // basic: !this.$device.desktop,
      });
      // filter
      actions = actions.filter(action => {
        if (action.actionMode === 1) return true;
        const _action = this.getAction(action);
        // filter: view/disableOnList
        return action.code !== 2 && !_action.disableOnList;
      });
      // set
      Vue.set(item, '_actions', actions);
      return item._actions;
    },
  },
};
