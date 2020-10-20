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
  created() {
  },
  methods: {
    onPerformFilter() {
      this.layoutManager.onPerformFilter();
    },
    onPerformAtomOrders(event) {
      this.layoutManager.onPerformAtomOrders(event.currentTarget);
    },
    onPerformActionsCreate(event) {
      this.layoutManager.onPerformActionsCreate(event.currentTarget);
    },
    _renderActionCreate() {
      if (this.layoutManager.atomClass) return;
      if (!this.layoutManager.showPopoverActionsCreate) return;
      return (
        <eb-link iconMaterial="add" propsOnPerform={event => this.onPerformActionsCreate(event)}></eb-link>
      );
    },
  },
  render() {
    return (
      <f7-nav-right>
        {this._renderActionCreate()}
        <eb-link iconMaterial="sort" propsOnPerform={event => this.onPerformAtomOrders(event)}></eb-link>
        <eb-link iconMaterial="search" propsOnPerform={this.onPerformFilter}></eb-link>
      </f7-nav-right>
    );
  },
};
