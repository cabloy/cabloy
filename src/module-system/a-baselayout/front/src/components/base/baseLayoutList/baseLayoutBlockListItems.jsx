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
      return this.layoutManager.data.provider.itemKey;
    },
  },
  methods: {
    _calcIndexTotal(pageInfo, index) {
      let indexTotal;
      if (!pageInfo || pageInfo.pageCurrent === 0) {
        indexTotal = index;
      } else {
        indexTotal = (pageInfo.pageCurrent - 1) * pageInfo.pageSize + index;
      }
      return indexTotal;
    },
    _renderList() {
      const pageInfo = this.layoutManager.data.adapter.getPageInfo();
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const info = { item, index, indexTotal: this._calcIndexTotal(pageInfo, index) };
        const domListItem = this.layoutManager.layout_renderBlock({
          blockName: 'item',
          key: item[this.itemKey],
          info,
          listItem: true,
        });
        children.push(domListItem);
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div>{this._renderList()}</div>;
  },
};
