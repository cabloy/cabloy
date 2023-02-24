export default {
  data() {
    return {
      actions: {
        list: null,
      },
    };
  },
  created() {
    // this.actions_fetchActions();
  },
  methods: {
    async actions_fetchActions() {
      if (this.actions.list) return;
      // fetch
      let actions = await this.$api.post('/a/detail/detail/actions', {
        flowTaskId: this.container.flowTaskId,
        atomKey: { atomId: this.container.atomId },
        detailClass: this.container.detailClass,
        mode: this.container.mode,
      });
      // filter
      actions = actions.filter(action => {
        const _action = this.getDetailAction(action);
        // filter: view/disableOnList
        return action.code !== 2 && !_action.disableOnList;
      });
      // ok
      this.actions.list = actions;
    },
  },
};
