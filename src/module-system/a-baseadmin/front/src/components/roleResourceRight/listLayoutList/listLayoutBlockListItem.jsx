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
    async onItemClick(event, item) {
      if (this.layoutManager.bulk.selecting) return;
      // view resource info
      const atomClass = { module: item.moduleTarget, atomClassName: item.atomClassNameTarget };
      const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
      const actionRead = await useStoreAtomActions.getActionBase({ atomClass, name: 'read' });
      return await this.$meta.util.performAction({
        ctx: this,
        action: actionRead,
        item: { atomId: item.atomIdTarget },
      });
    },
    onSwipeoutOpened(event, item) {
      this.layoutManager.actions_fetchActions(item);
    },
    onItemChange(event, item) {
      this.layoutManager.bulk_onItemChange(event, item);
    },
    _getTypeCategory(item) {
      return `${item.resourceTypeLocale} / ${item.atomCategoryNameLocale}`;
    },
    _getItemChecked(item) {
      const index = this.layoutManager.bulk.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      return index > -1;
    },
    _renderItemHeader(item) {
      if (!item.roleNameBaseLocale) return null;
      const desp = `${this.$text('From')}: ${item.roleNameBaseLocale}`;
      return (
        <div slot="root-start" class="header">
          <div></div>
          <div>{desp}</div>
        </div>
      );
    },
    _renderItemAfter(item) {
      const children = [];
      if (item.resourceType) {
        children.push(<f7-badge>{this._getTypeCategory(item)}</f7-badge>);
      }
      return (
        <div slot="after" class="after">
          {children}
        </div>
      );
    },
    _renderListItem(item) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.atomNameLocale || item.atomName}</div>
        </div>
      );
      // domHeader
      const domHeader = this._renderItemHeader(item);
      // domAfter
      const domAfter = this._renderItemAfter(item);
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
          {domHeader}
          {domTitle}
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
