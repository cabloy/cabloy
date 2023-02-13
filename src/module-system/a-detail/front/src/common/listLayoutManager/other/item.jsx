import Actions from './item_actions.jsx';
import ContextMenu from './item_contextMenu.jsx';

export default {
  mixins: [Actions, ContextMenu],
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.getDetailAction(action);
      if (!_action) return;
      const res = await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
      this.$meta.util.swipeoutClose(event.currentTarget);
      return res;
    },
    async item_onItemClick(event, item) {
      return await this.item_onAction(event, item, {
        module: item.module,
        detailClassName: item.detailClassName,
        name: this.container.mode === 'view' ? 'read' : 'write',
      });
    },
    item_getDetailName(item) {
      return item.detailName;
    },
    item_getMetaSummary(item) {
      return (item._meta && item._meta.summary) || '';
      // return (item._meta && item._meta.summary) || item.detailCode;
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    item_getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    item_getActionTitle(action) {
      return this.getDetailActionTitle(action);
    },
    item_getActions(mode) {
      const actions = this.actions.list;
      if (!actions) return actions;
      if (mode === 'menu' || (!mode && this.$device.desktop)) {
        // show all on menu
        return actions;
      }
      // only read/write/delete
      return actions.filter(item => ['read', 'write', 'delete'].indexOf(item.name) > -1);
    },
    item_renderContextMenu(item, mode) {
      const itemActions = this.item_getActions(mode);
      // domRight
      const domActions = [];
      if (itemActions) {
        for (let index in itemActions) {
          index = parseInt(index);
          const action = itemActions[index];
          const _action = this.getDetailAction(action);
          let domActionTitle;
          if (mode === 'menu' || (!mode && this.$device.desktop)) {
            domActionTitle = <div slot="title">{this.item_getActionTitle(action)}</div>;
          }
          domActions.push(
            <div
              key={action.code}
              color={this.item_getActionColor(action, index)}
              propsOnPerform={event => this.item_onAction(event, item, action)}
            >
              <f7-icon
                slot="media"
                material={_action.icon && _action.icon.material}
                f7={_action.icon && _action.icon.f7}
              ></f7-icon>
              {domActionTitle}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={!!itemActions}>
          {domActions}
        </div>
      );
      return <eb-context-menu mode={mode}>{domRight}</eb-context-menu>;
    },
    item_renderMedia(item, index) {
      return <f7-badge>{index + 1}</f7-badge>;
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
  },
};
