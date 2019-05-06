export default {
  meta: {
    component: false,
  },
  computed: {
    actionsAll() {
      return this.$store.getState('a/base/actions');
    },
  },
  methods: {
    getAction(action) {
      if (!this.actionsAll) return null;
      return this.actionsAll[action.module][action.atomClassName][action.name];
    },
    getActionTitle(action) {
      const _action = this.getAction(action);
      return _action ? _action.titleLocale : null;
    },
    getActionsOfAtomClass(atomClass) {
      if (!atomClass || !this.actionsAll) return null;
      return this.actionsAll[atomClass.module][atomClass.atomClassName];
    },
  },
  created() {
    this.$store.dispatch('a/base/getActions');
  },
};

