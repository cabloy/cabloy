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
    _renderActionsCreate() {
      if (this.layoutManager.atomClass) return;
      if (!this.layoutManager.showPopoverActionsCreate) return;
      return (
        <eb-link iconMaterial="add" propsOnPerform={event => this.onPerformActionsCreate(event)}></eb-link>
      );
    },
    _renderActionFilter() {
      if (this.layoutManager.params && this.layoutManager.params.disableFilter === true) return null;
      return (
        <eb-link iconMaterial="search" propsOnPerform={this.onPerformFilter}></eb-link>
      );
    },
  },
  render() {
    return (
      <f7-nav-right>
        {this._renderActionsCreate()}
        <eb-link iconMaterial="sort" propsOnPerform={event => this.onPerformAtomOrders(event)}></eb-link>
        {this._renderActionFilter()}
      </f7-nav-right>
    );
  },
};
