export default {
  computed: {
    detailActionsAll() {
      return this.$store.getState('a/base/detailActions');
    },
  },
  methods: {
    getDetailAction(action) {
      if (!this.detailActionsAll) return null;
      return this.detailActionsAll[action.module][action.detailClassName][action.name];
    },
    getDetailActionTitle(action) {
      const _action = this.getDetailAction(action);
      return _action ? _action.titleLocale : null;
    },
    getActionsOfDetailClass(detailClass) {
      if (!detailClass || !this.detailActionsAll) return null;
      return this.detailActionsAll[detailClass.module][detailClass.detailClassName];
    },
  },
  created() {
    this.$store.dispatch('a/base/getDetailActions');
  },
};
