import Vue from 'vue';
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ebDetailActions],
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
  mounted() {
    this.$meta.eventHub.$on('detail:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('detail:action', this.onActionChanged);
  },
  methods: {
    getItemActions() {
      const actions = this.layoutManager.actions.list;
      if (!actions) return actions;
      if (this.$device.desktop) {
        return actions;
      }
      // only read/write/delete
      return actions.filter(item => ['read', 'write', 'delete'].indexOf(item.name) > -1);
    },
    async onItemClick(event, item) {
      return await this.onAction(event, item, {
        module: item.module,
        detailClassName: item.detailClassName,
        name: this.layoutManager.container.mode === 'view' ? 'read' : 'write',
      });
    },
    onSwipeoutOpened(event, item) {},
    async onAction(event, item, action) {
      const _action = this.getDetailAction(action);
      if (!_action) return;
      const res = await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item,
          meta: {
            flowTaskId: this.layoutManager.container.flowTaskId,
          },
        },
      });
      this.$meta.util.swipeoutClose(event.target);
      return res;
    },
    async onActionChanged(data) {
      const { atomKey, detailClass } = data;
      if (
        atomKey.atomId !== this.layoutManager.container.atomId ||
        detailClass.module !== this.layoutManager.container.detailClass.module ||
        detailClass.detailClassName !== this.layoutManager.container.detailClass.detailClassName
      )
        return;

      const changed = await this._onActionChanged(data);
      if (changed) {
        // details:change
        this.$meta.eventHub.$emit('details:change', {
          ...data,
          details: this.layout.getItemsAll(),
        });
      }
    },
    async _onActionChanged(data) {
      const { key, action, result } = data;
      // create
      if (action.name === 'create') {
        // load
        await this.layout.loadDetails();
        return true;
      }
      // delete
      const index = this.layout.items.findIndex(item => item.detailId === key.detailId);
      if (action.name === 'delete') {
        if (index !== -1) {
          this.layout.items.splice(index, 1);
          return true;
        }
        return false;
      }
      // move
      if (action.name === 'moveUp' || action.name === 'moveDown') {
        if (!result) return false;
        const a = action.name === 'moveUp' ? result.to : result.from;
        const b = action.name === 'moveUp' ? result.from : result.to;
        const aIndex = this.layout.items.findIndex(item => item.detailId === a);
        const bIndex = this.layout.items.findIndex(item => item.detailId === b);
        if (aIndex === -1 || bIndex === -1) {
          // load
          await this.layout.loadDetails();
          return false;
        }
        const row = this.layout.items.splice(bIndex, 1);
        this.layout.items.splice(aIndex, 0, row[0]);
        return false;
      }
      // others
      if (index !== -1) {
        const options = this.layoutManager.base_prepareReadOptions();
        const res = await this.$api.post('/a/detail/detail/read', {
          flowTaskId: this.layoutManager.container.flowTaskId,
          key,
          options,
        });
        Vue.set(this.layout.items, index, res);
        return true;
      }
      // default
      return false;
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
          {this._getItemMetaSummary(item)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
        </div>
      );
      // ok
      return (
        <eb-list-item
          class="item"
          key={item.detailId}
          link="#"
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout
          onSwipeoutOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
          onContextmenuOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
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

      return <eb-context-menu>{domRight}</eb-context-menu>;
    },
    _renderList() {
      const items = this.layout.items;
      const children = [];
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderListItem(items[index], index));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div class="detail-list-main-container">{this._renderList()}</div>;
  },
};
