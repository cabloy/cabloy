import Vue from 'vue';
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
    return {
      radioName: Vue.prototype.$meta.util.nextId('radio'),
    };
  },
  methods: {
    onItemClick(event, item) {
      if (this.layoutManager.bulk.selecting) return;
      return this.layoutManager.data.adapter.item_onActionView(event, item);
    },
    onSwipeoutOpened(event, item) {
      this.layoutManager.actions_fetchActions(item);
    },
    onItemChange(event, item) {
      this.layoutManager.bulk_onItemChange(event, item);
    },
    _getItemChecked(item) {
      const index = this.layoutManager.bulk.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      return index > -1;
    },
    _renderListItem(item) {
      // media
      const domMedia = this.layoutManager.bulk.selecting ? null : (
        <div slot="media" class="avatar24-wrapper">
          {this.layoutManager.data.adapter.item_renderMedia(item)}
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this.layoutManager.data.adapter.item_getMetaMediaLabel(item)}</span>
          </div>
          <div class="date">
            {this.layoutManager.data.adapter.item_renderStats(item)}
            <span>{this.$meta.util.formatDateTimeRelative(item.atomUpdatedAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{this.layoutManager.data.adapter.item_getAtomName(item)}</div>
        </div>
      );
      // domSummary
      let domSummary;
      if (this.blockConfig.summary !== false) {
        domSummary = (
          <div slot="root-end" class="summary">
            {this.layoutManager.data.adapter.item_getMetaSummary(item)}
          </div>
        );
      }
      // domAfter
      const domAfterMetaFlags = this.layoutManager.data.adapter.item_renderMetaFlags(item);
      const domAfterLabels = this.layoutManager.data.adapter.item_renderLabels(item);
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
          link={this.layoutManager.bulk.selecting ? false : '#'}
          name={this.radioName}
          checkbox={this.layoutManager.bulk.selecting}
          checked={this._getItemChecked(item)}
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout
          onSwipeoutOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
          onContextmenuOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
          onChange={event => this.onItemChange(event, item)}
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
      return this.layoutManager.data.adapter.item_renderContextMenu(item);
    },
  },
  render() {
    const { item } = this.info;
    return this._renderListItem(item);
  },
};
