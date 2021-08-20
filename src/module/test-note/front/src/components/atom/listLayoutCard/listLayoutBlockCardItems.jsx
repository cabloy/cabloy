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
  methods: {
    _renderListItem(item) {
      const domListItem = this.layoutManager.layout_renderBlock({
        blockName: 'item',
        key: item.atomId,
        info: { item },
        listItem: true,
      });
      // ok
      return (
        <f7-card key={item.atomId}>
          <f7-card-header>
            <f7-list>{domListItem}</f7-list>
          </f7-card-header>
          <f7-card-content>{item.content}</f7-card-content>
        </f7-card>
      );
    },
    _renderList() {
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (const item of items) {
        children.push(this._renderListItem(item));
      }
      return children;
    },
  },
  render() {
    return <div class="atom-list-layout-card-container">{this._renderList()}</div>;
  },
};
