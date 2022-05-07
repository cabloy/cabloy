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
      const domListItem = this.layoutManager.layout_renderBlock({
        blockName: 'itemHeader',
        key: item.atomId,
        info: { item },
        listItem: true,
      });
      // ok
      return (
        <f7-card key={item.atomId} class="card-item col-100 medium-50 large-50">
          <f7-card-header>
            <f7-list>{domListItem}</f7-list>
          </f7-card-header>
          <f7-card-content padding>
            <div>{this.layoutManager.item_getMetaSummary(item)}</div>
          </f7-card-content>
        </f7-card>
      );
    },
  },
  render() {
    const { item } = this.info;
    return this._renderListItem(item);
  },
};
