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
    info: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderListItem(item) {
      if (this.layoutManager.item_renderListItem) {
        return this.layoutManager.item_renderListItem(item);
      }
      return <div>{'should specified: item_renderListItem'}</div>;
    },
  },
  render() {
    const { item } = this.info;
    return this._renderListItem(item);
  },
};
