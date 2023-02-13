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
    let domDone;
    if (this.selectedAtoms.length > 0) {
      domDone = <eb-link iconF7="::done" tooltip={this.$text('Done')} propsOnPerform={this.onPerformDone}></eb-link>;
    }
    return (
      <f7-nav-right>
        <eb-link
          iconF7="::sort"
          tooltip={this.$text('Sort')}
          propsOnPerform={event => this.onPerformAtomOrders(event)}
        ></eb-link>
        <eb-link iconF7="::search" tooltip={this.$text('Search')} propsOnPerform={this.onPerformFilter}></eb-link>
        {domDone}
      </f7-nav-right>
    );
  },
};
