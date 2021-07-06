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
    onPerformAtomOrders(event) {
      this.layoutManager.order_onPerformPopover(event.currentTarget);
    },
    onPerformFilter() {
      this.layoutManager.filter_onPerform();
    },
    onPerformDone() {
      // ok
      const selectMode = this.layoutManager.container.params.selectMode;
      const res = selectMode === 'single' ? this.selectedAtoms[0] : this.selectedAtoms;
      this.layoutManager.contextCallback(200, res);
      this.$f7router.back();
    },
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconMaterial="sort" propsOnPerform={event => this.onPerformAtomOrders(event)}></eb-link>
        <eb-link iconMaterial="search" propsOnPerform={this.onPerformFilter}></eb-link>
        {this.selectedAtoms.length > 0 && <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>}
      </f7-nav-right>
    );
  },
};
