export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
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
    itemKey() {
      return this.blockConfig.itemKey;
    },
  },
  methods: {
    _renderList() {
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (const item of items) {
        const domListItem = this.layoutManager.layout_renderBlock({
          blockName: 'item',
          key: item[this.itemKey],
          info: { item },
        });
        children.push(domListItem);
      }
      // children.push(<div class="card-item card-item-last col-100"></div>);
      return children;
    },
  },
  render() {
    return <div class="atom-list-layout-card-container row">{this._renderList()}</div>;
  },
};
