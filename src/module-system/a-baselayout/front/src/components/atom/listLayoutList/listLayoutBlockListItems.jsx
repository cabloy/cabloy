import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ebAtomActions],
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
  methods: {
    onItemClick(event, item) {
      if (this.layoutManager.bulk.selecting) return;
      return this.layoutManager.data.adapter.item_onClick(event, item);
    },
    onSwipeoutOpened(event, item) {
      this.layoutManager.actions_fetchActions(item);
    },
    onItemChange(event, item) {
      this.layoutManager.bulk_onItemChange(event, item);
    },
    _getLabel(id) {
      if (!this.layoutManager.base_userLabels) return null;
      return this.layoutManager.base_userLabels[id];
    },
    _getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    _getActionTitle(action, item) {
      return this.getActionTitle(action, item);
    },
    _getItemChecked(item) {
      const index = this.layoutManager.bulk.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      return index > -1;
    },
    _renderListItem(item) {
      // media
      const domMedia = this.layoutManager.bulk.selecting ? null : (
        <div slot="media">
          <img class="avatar avatar24" src={this.layoutManager.data.adapter.item_getMetaMedia(item)} />
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this.layoutManager.data.adapter.item_getMetaMediaLabel(item)}</span>
          </div>
          <div class="date">
            {item.star > 0 && <span>⭐</span>}
            {item.attachmentCount > 0 && <span>🧷</span>}
            {item.attachmentCount > 1 && <span>{`${item.attachmentCount}`}</span>}
            {item.commentCount > 0 && <span>💬</span>}
            {item.commentCount > 1 && <span>{`${item.commentCount}`}</span>}
            <span>{this.$meta.util.formatDateTimeRelative(item.atomUpdatedAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.atomNameLocale || item.atomName}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          {this.layoutManager.data.adapter.item_getMetaSummary(item)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      // flow
      if (item.flowNodeNameCurrentLocale) {
        domAfterMetaFlags.push(
          <f7-badge key="flowNodeNameCurrent" color="orange">
            {item.flowNodeNameCurrentLocale}
          </f7-badge>
        );
      }
      // flags
      const itemFlags = this.layoutManager.data.adapter.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      const domAfterLabels = [];
      if (item.labels && this.layoutManager.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this._getLabel(label);
          domAfterLabels.push(
            <f7-badge key={label} style={{ backgroundColor: _label.color }}>
              {_label.text}
            </f7-badge>
          );
        }
      }
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
      // domLeft
      let domLeft;
      if (item.atomStage === 1) {
        const domLeftStar = (
          <div color="teal" propsOnPerform={event => this.layoutManager.data.adapter.star_onSwitch(event, item)}>
            <f7-icon slot="media" material={item.star ? 'star_border' : 'star'}></f7-icon>
            {this.$device.desktop && <div slot="title">{this.$text(item.star ? 'Unstar' : 'UserStar')}</div>}
          </div>
        );
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.layoutManager.data.adapter.labels_onClick(event, item)}>
            <f7-icon slot="media" material="label"></f7-icon>
            {this.$device.desktop && <div slot="title">{this.$text('UserLabels')}</div>}
          </div>
        );
        domLeft = (
          <div slot="left">
            {domLeftStar}
            {domLeftLabel}
          </div>
        );
      }
      // domRight
      const domActions = [];
      if (item._actions) {
        for (let index in item._actions) {
          index = parseInt(index);
          const action = item._actions[index];
          const _action = this.getAction(action);
          domActions.push(
            <div key={action.id} color={this._getActionColor(action, index)} propsOnPerform={event => this.layoutManager.data.adapter.item_onAction(event, item, action)}>
              <f7-icon slot="media" material={_action.icon.material}></f7-icon>
              {this.$device.desktop && <div slot="title">{this._getActionTitle(action, item)}</div>}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={!!item._actions}>
          {domActions}
        </div>
      );

      return (
        <eb-context-menu>
          {domLeft}
          {domRight}
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
