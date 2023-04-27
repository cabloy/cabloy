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
    _renderItemAfter(item) {
      const children = [];
      if (item.actionBulk === 0 && item.scope === 0) {
        children.push(<f7-badge>{this.$text('Self')}</f7-badge>);
      } else if (item.scopeRoles) {
        for (const scopeRole of item.scopeRoles) {
          children.push(
            <f7-badge key={scopeRole.id} color="teal" tooltip={this.$text('DataScope')}>
              {scopeRole.roleNameLocale}
            </f7-badge>
          );
        }
      }
      return (
        <div slot="after" class="after">
          {children}
        </div>
      );
    },
    _renderItemSummary(item) {
      let summary;
      if (item.actionBulk === 1 && item.actionCode !== 1) {
        summary = this.$text('Bulk');
      } else if (item.actionMode === 1) {
        summary = `${this.$text('WorkFlow Actions')}: ${item.flowDefNameLocale}`;
      }
      return (
        <div slot="root-end" class="summary-no-media">
          {summary}
        </div>
      );
    },
    _renderListItem(item) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.titleLocale}</div>
        </div>
      );
      // domAfter
      const domAfter = this._renderItemAfter(item);
      // domSummary
      const domSummary = this._renderItemSummary(item);
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
    const { item } = this.info;
    return this._renderListItem(item);
  },
};
