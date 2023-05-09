export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    selectedAtoms() {
      return this.layoutManager.select_getSelectedAtoms();
    },
  },
  created() {},
  methods: {
    onPerformDone() {
      // ok
      const selectMode = this.layoutManager.container.params?.selectMode;
      const res = selectMode === 'single' ? this.selectedAtoms[0] : this.selectedAtoms;
      this.layoutManager.contextCallback(200, res);
      this.$f7router.back();
    },
  },
  render() {
    const domActions = this.layoutManager.bulk_renderActionsNormalDefault();
    if (this.selectedAtoms.length > 0) {
      domActions.push(
        <eb-link iconF7="::done" tooltip={this.$text('Done')} propsOnPerform={this.onPerformDone}></eb-link>
      );
    }
    return <f7-nav-right>{domActions}</f7-nav-right>;
  },
};
