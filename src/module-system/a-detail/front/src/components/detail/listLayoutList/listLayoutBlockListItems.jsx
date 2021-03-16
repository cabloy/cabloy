import Vue from 'vue';
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebDetailActions ],
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
    };
  },
  mounted() {
    this.$meta.eventHub.$on('detail:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('detail:action', this.onActionChanged);
  },
  methods: {
    getItemActions() {
      const actions = this.layoutManager.action.actions;
      if (!actions) return actions;
      if (this.$device.desktop) {
        // just remove save
        return actions.filter(item => [ 'save' ].indexOf(item.name) === -1);
      }
      // only read/write/delete
      return actions.filter(item => [ 'read', 'write', 'delete' ].indexOf(item.name) > -1);
    },
    onItemClick(event, item) {
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
        basic: !this.$device.desktop,
      }).then(data => {
        Vue.set(item, '_actions', data);
      });
    },
    onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item })
        .then(() => {
          this.$meta.util.swipeoutClose(event.target);
        });
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
        this.$api.post('/a/base/atom/read', {
          key,
          options,
        }).then(data => {
          Vue.set(this.layout.items, index, data);
        });
      }
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
      return (item._meta && item._meta.summary) || '';
      // return (item._meta && item._meta.summary) || item.detailCode;
    },
    _getItemMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    _getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    _getActionTitle(action) {
      return this.getDetailActionTitle(action);
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
          { this._getItemMetaSummary(item) }
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(
          <f7-badge key={flag}>{flag}</f7-badge>
        );
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={item.detailId}
          link='#'
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout onSwipeoutOpened={event => { this.onSwipeoutOpened(event, item); } }
          onContextmenuOpened={event => { this.onSwipeoutOpened(event, item); } }
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
      const itemActions = this.getItemActions();
      // domRight
      const domActions = [];
      if (itemActions) {
        for (let index in itemActions) {
          index = parseInt(index);
          const action = itemActions[index];
          const _action = this.getDetailAction(action);
          domActions.push(
            <div key={action.code} color={this._getActionColor(action, index)} propsOnPerform={event => this.onAction(event, item, action)}>
              <f7-icon slot="media" material={_action.icon.material}></f7-icon>
              {this.$device.desktop && <div slot="title">{this._getActionTitle(action)}</div>}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={!!itemActions}>
          {domActions}
        </div>
      );

      return (
        <eb-context-menu>
          {domRight}
        </eb-context-menu>
      );
    },
    _renderList() {
      const items = this.layout.items;
      const children = [];
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderListItem(items[index], index));
      }
      return (
        <f7-list>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <div class="detail-list-main-container">
        {this._renderList()}
      </div>
    );
  },
};
