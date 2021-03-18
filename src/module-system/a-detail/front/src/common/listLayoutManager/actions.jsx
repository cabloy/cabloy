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
    actions_fetchActions() {
      if (this.actions.list) return;
      this.$api.post('/a/detail/detail/actions', {
        flowTaskId: this.container.flowTaskId,
        atomKey: { atomId: this.container.atomId },
        detailClass: this.container.detailClass,
        mode: this.container.mode,
      }).then(data => {
        this.actions.list = data;
      });
    },
  },
};
