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
  },
  render() {
    return (
      <f7-nav-right>
        <eb-link iconMaterial="search" propsOnPerform={this.onPerformFilter}></eb-link>
        <eb-link iconMaterial="sort" propsOnPerform={$event => { this.onPerformAtomOrders($event); }}></eb-link>
      </f7-nav-right>
    );
  },
};
