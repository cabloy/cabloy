import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomActions ],
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
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
  },
  methods: {
    onItemClick(event, item) {
      if (this.layoutManager.bulk.selecting) return;
      return this.onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read',
      });
    },
    onSwipeoutOpened(event, item) {
      if (item._actions) return;
      this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        basic: true,
      }).then(data => {
        Vue.set(item, '_actions', data);
      });
    },
    onLabel(event, item) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // navigate
      this.$view.navigate(`/a/base/atom/labels?atomId=${item.atomId}`, {
        target: '_self',
      });
      this.$meta.util.swipeoutClose(event.target);
    },
    onStarSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return this._onStarSwitch(event, item, star, 'swipeoutClose');
    },
    onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item })
        .then(() => {
          this.$meta.util.swipeoutClose(event.target);
        });
    },
    onStarChanged(data) {
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (index !== -1) {
        this.layout.items[index].star = data.star;
      }
    },
    onLabelsChanged(data) {
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (index !== -1) {
        this.layout.items[index].labels = JSON.stringify(data.labels);
      }
    },
    onActionChanged(data) {
      const key = data.key;
      const action = data.action;
      // create
      if (action.menu === 1 && action.action === 'create') {
        // do nothing
        return;
      }
      // delete
      const index = this.layout.items.findIndex(item => item.atomId === key.atomId);
      if (action.name === 'delete') {
        if (index !== -1) {
          this.layout.items.splice(index, 1);
        }
        return;
      }
      // others
      if (index !== -1) {
        this.$api.post('/a/base/atom/read', {
          key,
        }).then(data => {
          Vue.set(this.layout.items, index, data);
        });
      }
    },
    onItemChange(event, item) {
      this.layoutManager.bulk_onItemChange(event, item);
    },
    _onStarSwitch(event, item, star, swipeoutAction) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
        this.$meta.util[swipeoutAction](event.target);
      });
    },
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 32);
    },
    _getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    _getItemMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      if (this.layoutManager.container.atomClass) {
        return summary;
      }
      const atomClass = this.layoutManager.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      if (!atomClass) return summary;
      return `${atomClass.titleLocale} ${summary}`;
    },
    _getItemMetaFlags(item) {
      const flags = (item._meta && item._meta.flags);
      if (!flags) return [];
      if (Array.isArray(flags)) return flags;
      return flags.split(',');
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
      return this.getActionTitle(action, item.atomStage);
    },
    _getItemChecked(item) {
      const index = this.layoutManager.bulk.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      return index > -1;
    },
    _getColumns() {
      return this.blockConfig.columns;
    },
    _renderListItem(item) {
      // media
      const domMedia = this.layoutManager.bulk.selecting ? null : (
        <div slot="media">
          <img class="avatar avatar24" src={this._getItemMetaMedia(item)} />
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this._getItemMetaMediaLabel(item)}</span>
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
          <div>{item.atomName}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          { this._getItemMetaSummary(item) }
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(
          <f7-badge key="flag">{flag}</f7-badge>
        );
      }
      const domAfterLabels = [];
      if (item.labels && this.layoutManager.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this._getLabel(label);
          domAfterLabels.push(
            <f7-badge key={label} style={ { backgroundColor: _label.color } }>{ _label.text}</f7-badge>
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
        <eb-list-item class="item" key={item.atomId}
          link={this.layoutManager.bulk.selecting ? false : '#'}
          name={this.radioName}
          checkbox={this.layoutManager.bulk.selecting}
          checked={this._getItemChecked(item)}
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout onSwipeoutOpened={event => { this.onSwipeoutOpened(event, item); } }
          onContextmenuOpened={event => { this.onSwipeoutOpened(event, item); } }
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
          <div color="teal" propsOnPerform={event => this.onStarSwitch(event, item)}>
            <f7-icon slot="media" material={item.star ? 'star_border' : 'star'}></f7-icon>
            {this.$device.desktop && <div slot="title">{this.$text(item.star ? 'Unstar' : 'Star')}</div>}
          </div>
        );
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.onLabel(event, item)}>
            <f7-icon slot="media" material="label"></f7-icon>
            {this.$device.desktop && <div slot="title">{this.$text('Labels')}</div>}
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
            <div key={action.id} color={this._getActionColor(action, index)} propsOnPerform={event => this.onAction(event, item, action)}>
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
    _renderTable() {
      return (
        <a-table
          bordered
          columns={this._getColumns()}
          rowKey={item => item.atomId}
          dataSource={this.layout.getDataSource()}
          loading={this.layout.loading}
          pagination={false}
        >
        </a-table>
      );
    },
  },
  render() {
    return this._renderTable();
  },
};
