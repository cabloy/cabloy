export default {
  data() {
    return {
      actions: {
        list: null,
      },
    };
  },
  created() {
    this.actions_fetchActions();
  },
  methods: {
    async actions_fetchActions() {
      if (this.actions.list) return;
      this.actions.list = await this.$api.post('/a/detail/detail/actions', {
        flowTaskId: this.container.flowTaskId,
        atomKey: { atomId: this.container.atomId },
        detailClass: this.container.detailClass,
        mode: this.container.mode,
      });
    },
  },
};
