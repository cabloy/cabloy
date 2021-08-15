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
    async onItemClick(event, item) {
      return this.layoutManager.data.adapter.item_onItemClick(event, item);
    },
    onSwipeoutOpened(/* event, item*/) {},
    _getItemMetaSummary(item) {
      return (item._meta && item._meta.summary) || '';
      // return (item._meta && item._meta.summary) || item.detailCode;
    },
    _getItemMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    _renderListItem(item, index) {
      // media
      const domMedia = (
        <div slot="media">
          <f7-badge>{index + 1}</f7-badge>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.detailName}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          {this._getItemMetaSummary(item)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
        </div>
      );
      // ok
      return (
        <eb-list-item
          class="item"
          key={item.detailId}
          link="#"
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout
          onSwipeoutOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
          onContextmenuOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
        >
          {domMedia}
          {domTitle}
          {domSummary}
          {domAfter}
          {this._renderListItemContextMenu(item)}
        </eb-list-item>
      );
    },
    _renderListItemContextMenu(item) {
      return this.layoutManager.data.adapter.item_renderContextMenu(item);
    },
    _renderList() {
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderListItem(items[index], index));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div class="detail-list-main-container">{this._renderList()}</div>;
  },
};
