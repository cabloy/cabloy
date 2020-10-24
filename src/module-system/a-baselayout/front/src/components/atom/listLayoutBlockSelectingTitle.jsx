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
    return {
    };
  },
  computed: {
    selectedAtoms() {
      return this.layoutManager.select_getSelectedAtoms();
    },
  },
  created() {
  },
  methods: {
    onPerformAtomOrders(event) {
      this.layoutManager.order_onPerformPopover(event.currentTarget);
    },
    onPerformFilter() {
      this.layoutManager.onPerformFilter();
    },
    onPerformDone() {
      // ok
      this.layoutManager.contextCallback(200, this.selectedAtoms);
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
