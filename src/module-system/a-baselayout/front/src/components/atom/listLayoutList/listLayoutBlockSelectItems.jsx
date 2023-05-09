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
    onItemClick(event, item) {
      return this.layoutManager.item_onActionView(event, item);
    },
    onActionSelectRemove(event, item) {
      // close
      this.$meta.util.swipeoutClose(event.currentTarget);
      // remove from selectedAtomIds
      const selectedAtomIds = this.layoutManager.container.params?.selectedAtomIds;
      if (selectedAtomIds) {
        const index = selectedAtomIds.findIndex(_item => _item === item.atomId);
        if (index !== -1) {
          selectedAtomIds.splice(index, 1);
        }
      }
      // remove from list
      const items = this.layoutManager.base_getItems();
      const index = items.findIndex(_item => _item.atomId === item.atomId);
      if (index !== -1) {
        items.splice(index, 1);
      }
    },
    _renderListItem(item) {
      // media
      const domMedia = (
        <div slot="media" class="avatar24-wrapper">
          {this.layoutManager.item_renderMedia(item)}
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this.layoutManager.item_getMetaMediaLabel(item)}</span>
          </div>
          <div class="date">
            {this.layoutManager.item_renderStats(item)}
            <span>{this.$meta.util.formatDateTimeRelative(item.atomUpdatedAt || item.updatedAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{this.layoutManager.item_getAtomName(item)}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          {this.layoutManager.item_getMetaSummary(item)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = this.layoutManager.item_renderMetaFlags(item);
      const domAfterLabels = this.layoutManager.item_renderLabels(item);
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
          {domAfterLabels}
        </div>
      );
      // ok
      return (
        <eb-list-item
          class="item"
          key={item.atomId}
          link="#"
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout
        >
          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
          {this._renderListItemContextMenu(item)}
        </eb-list-item>
      );
    },
    _renderListItemContextMenu(item) {
      return (
        <eb-context-menu>
          <div slot="right">
            <div color="teal" propsOnPerform={event => this.onActionSelectRemove(event, item)}>
              {this.$text('Remove')}
            </div>
          </div>
        </eb-context-menu>
      );
    },
    _renderList() {
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (const item of items) {
        children.push(this._renderListItem(item));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div>{this._renderList()}</div>;
  },
};
