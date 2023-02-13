export default {
  methods: {
    item_prepareActions_rightmore_checkIfShow(action, actionBase, mode, location) {
      if (mode === 'swipeout') {
        const bRight = actionBase.directShowOnSwipeout;
        if (location === 'right') return bRight;
        if (location === 'more') return !bRight;
      }
      // toolbar/menu
      const bRight = actionBase.directShowOnList;
      if (location === 'right') return bRight;
      if (location === 'more') return !bRight;
    },
    item_prepareActions_rightmore(item, mode, location) {
      const actions = this.actions.list;
      if (!actions) return null;
      const actionsRight = [];
      for (let index in actions) {
        index = parseInt(index);
        const action = actions[index];
        const actionBase = this.getDetailAction(action);
        const valid = this.item_prepareActions_rightmore_checkIfShow(action, actionBase, mode, location);
        if (!valid) continue;
        actionsRight.push({
          key: action.code, // not use action.id
          title: this.item_getActionTitle(action, item),
          icon: {
            f7: actionBase.icon && actionBase.icon.f7,
            color: '',
          },
          color: this.item_getActionColor(action, index),
          onPerform: event => this.item_onAction(event, item, action),
        });
      }
      return actionsRight;
    },
    item_prepareActions(item, mode) {
      const left = null;
      const right = this.item_prepareActions_rightmore(item, mode, 'right');
      const more = this.item_prepareActions_rightmore(item, mode, 'more');
      return { left, right, more };
    },
    // toolbar / menu / swipeout
    item_renderContextMenu_adjustMode(mode) {
      if (mode) return mode;
      return this.$device.desktop ? 'menu' : 'swipeout';
    },
    item_renderContextMenu(item, mode) {
      mode = this.item_renderContextMenu_adjustMode(mode);
      const { left, right, more } = this.item_prepareActions(item, mode);
      return <eb-actions-bar mode={mode} left={left} right={right} more={more}></eb-actions-bar>;
      /* old solution
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
      */
    },
    /* item_getActions(mode) {
      const actions = this.actions.list;
      if (!actions) return actions;
      if (mode === 'menu' || (!mode && this.$device.desktop)) {
        // show all on menu
        return actions;
      }
      // only read/write/delete
      return actions.filter(item => ['read', 'write', 'delete'].indexOf(item.name) > -1);
    },*/
  },
};
