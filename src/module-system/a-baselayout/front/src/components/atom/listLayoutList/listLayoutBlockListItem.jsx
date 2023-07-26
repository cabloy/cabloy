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
      return this.layoutManager.item_onActionView(event, item);
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
    _renderMedia(info) {
      if (this.layoutManager.bulk.selecting) return null;
      const media = this.blockConfig.options?.mapper?.media;
      const domMedia = this.layoutManager.item_renderMedia2(info, null, media);
      if (!domMedia) return null;
      return (
        <div slot="media" class="avatar24-wrapper">
          {domMedia}
        </div>
      );
    },
    _renderAtomName(info) {
      let atomNameFieldName = this.blockConfig.options?.mapper?.atomName;
      if (atomNameFieldName === undefined) {
        const atomClassBase = this.layoutManager.base.atomClassBase;
        atomNameFieldName = atomClassBase?.fields?.atomName;
      }
      const domTitle = (
        <div slot="title" class="title">
          <div>{this.layoutManager.item_getAtomName(info.item, atomNameFieldName)}</div>
        </div>
      );
      return domTitle;
    },
    _renderListItem(info) {
      const item = info.item;
      // media
      const domMedia = this._renderMedia(info);
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
      const domTitle = this._renderAtomName(info);
      // domSummary
      let domSummary;
      if (this.blockConfig.summary !== false) {
        domSummary = (
          <div slot="root-end" class="summary">
            {this.layoutManager.item_getMetaSummary(item)}
          </div>
        );
      }
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
      return this.layoutManager.item_renderContextMenu(item);
    },
  },
  render() {
    return this._renderListItem(this.info);
  },
};
