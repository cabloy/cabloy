export default {
  methods: {
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
  },
};
