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
    return {};
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
