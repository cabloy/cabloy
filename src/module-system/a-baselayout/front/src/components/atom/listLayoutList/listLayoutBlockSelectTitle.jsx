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
  created() {},
  methods: {
    onPerformAdd() {
      return this.layoutManager.select_openPageSelecting();
    },
    onPerformDone() {
      // selectedAtoms
      const selectedAtoms = this.getSelectedAtoms();
      // ok
      this.layoutManager.contextCallback(200, selectedAtoms);
      this.$f7router.back();
    },
    getSelectedAtoms() {
      const selectedAtoms = this.layoutManager.select_getSelectedAtoms();
      let res;
      if (this.layoutManager.container.params?.selectMode === 'single') {
        res = selectedAtoms && selectedAtoms.length > 0 ? selectedAtoms[0] : null;
      } else {
        res = selectedAtoms && selectedAtoms.length > 0 ? selectedAtoms : null;
      }
      return res;
    },
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
        <eb-link iconF7="::done" propsOnPerform={this.onPerformDone}></eb-link>
      </f7-nav-right>
    );
  },
};
