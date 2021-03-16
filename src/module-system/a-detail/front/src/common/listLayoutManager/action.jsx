export default {
  data() {
    return {
      action: {
        actions: null,
      },
    };
  },
  created() {
    this.action_loadActions();
  },
  methods: {
    action_loadActions() {
      if (this.action.actions) return;
      this.$api.post('/a/detail/detail/actions', {
        atomKey: { atomId: this.container.atomId },
        detailClass: this.container.detailClass,
        mode: this.container.mode,
      }).then(data => {
        this.action.actions = data;
      });
    },
  },
};
