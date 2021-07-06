export default {
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
    getActionTitle(action, atom) {
      const atomStage = atom && atom.atomStage;
      if (action.name === 'write' && atomStage !== undefined) {
        if (atomStage === 0) return this.$text('Edit');
        if (atomStage === 1) return this.$text('Edit Again');
        if (atomStage === 2) return this.$text('RevertToThisRevision');
      }
      if (action.name === 'delete' && atomStage !== undefined) {
        const atomIdFormal = atom && atom.atomIdFormal;
        if (atomStage === 0 && atomIdFormal > 0) return this.$text('Close Draft');
      }
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
