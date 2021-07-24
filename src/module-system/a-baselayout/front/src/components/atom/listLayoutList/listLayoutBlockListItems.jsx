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
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.onActionsChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.onActionsChanged);
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
      this.layoutManager.actions_fetchActions(item);
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
      this.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, {
        target: '_self',
      });
      this.$meta.util.swipeoutClose(event.target);
    },
    onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item }).then(() => {
        this.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarChanged(data) {
      const items = this.layout.items;
      const params = this.layoutManager.base_prepareSelectParams({ setOrder: false });
      const star = params.options.star;
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (star) {
        // switch
        if (data.star === 0 && index !== -1) {
          items.splice(index, 1);
        } else if (data.star === 1 && index === -1) {
          this.layout.onPageRefresh();
        } else if (index !== -1) {
          items[index].star = data.star;
        }
      } else {
        // just change
        if (index !== -1) {
          items[index].star = data.star;
        }
      }
    },
    onLabelsChanged(data) {
      const items = this.layout.items;
      const params = this.layoutManager.base_prepareSelectParams({ setOrder: false });
      const label = params.options.label;
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (label) {
        // switch
        const exists = data.labels.indexOf(String(label)) > -1;
        if (!exists && index !== -1) {
          items.splice(index, 1);
        } else if (exists && index === -1) {
          this.layout.onPageRefresh();
        } else if (index !== -1) {
          items[index].labels = JSON.stringify(data.labels);
        }
      } else {
        // just change
        if (index !== -1) {
          items[index].labels = JSON.stringify(data.labels);
        }
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
        const options = this.layoutManager.base_prepareReadOptions();
        this.$api
          .post('/a/base/atom/read', {
            key,
            options,
          })
          .then(data => {
            Vue.set(this.layout.items, index, data);
          });
      }
    },
    onActionsChanged(data) {
      const key = data.key;
      const index = this.layout.items.findIndex(item => item.atomId === key.atomId);
      if (index !== -1) {
        Vue.set(this.layout.items[index], '_actions', null);
      }
    },
    onItemChange(event, item) {
      this.layoutManager.bulk_onItemChange(event, item);
    },
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
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
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      if (item.atomDisabled) {
        flags = [this.$text('Disabled')].concat(flags);
      }
      return flags;
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
          <div>{item.atomNameLocale || item.atomName}</div>
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
      // flow
      if (item.flowNodeNameCurrentLocale) {
        domAfterMetaFlags.push(
          <f7-badge key="flowNodeNameCurrent" color="orange">
            {item.flowNodeNameCurrentLocale}
          </f7-badge>
        );
      }
      // flags
      for (const flag of this._getItemMetaFlags(item)) {
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
          <div color="blue" propsOnPerform={event => this.onLabel(event, item)}>
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
