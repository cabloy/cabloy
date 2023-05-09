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
  },
  data() {
    return {
      radioName: Vue.prototype.$meta.util.nextId('radio'),
    };
  },
  computed: {
    selectedAtoms() {
      return this.layoutManager.select_getSelectedAtoms();
    },
  },
  methods: {
    onItemChange(event, item) {
      return this.layoutManager.select_onItemChange(event, item);
    },
    onActionView(event, item) {
      return this.layoutManager.item_onActionView(event, item);
    },
    _getItemChecked(item) {
      const index = this.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      return index > -1;
    },
    _renderListItem(item) {
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
          name={this.radioName}
          radio={this.layoutManager.container.params?.selectMode === 'single'}
          checkbox={this.layoutManager.container.params?.selectMode === 'multiple'}
          checked={this._getItemChecked(item)}
          swipeout
          onChange={event => this.onItemChange(event, item)}
        >
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
            <div color="teal" propsOnPerform={event => this.onActionView(event, item)}>
              {this.$text('View')}
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
