export default {
  methods: {
    item_prepareActions_left(item, mode) {
      const actionsLeft = [];
      // toolbar
      if (mode === 'toolbar') {
        // select
        if (this.bulk_enableSelect) {
          const selectedAtoms = this.bulk.selectedAtoms;
          actionsLeft.push({
            key: 'actionsLeftB:select',
            title: this.bulk.selecting ? this.$text('Deselect') : this.$text('Select'),
            icon: {
              f7: '::grading',
              badge: this.bulk.selecting ? selectedAtoms.length.toString() : 0,
            },
            color: 'teal',
            onPerform: event => this.bulk_onSelectingSwitch(event),
          });
        }
      }
      // check formal
      if (!item || item.atomStage !== 1) return actionsLeft;
      // star
      actionsLeft.push({
        key: 'star',
        title: this.$text(item.star ? 'Unstar' : 'UserStarShort'),
        icon: {
          f7: item.star ? '::star' : ':outline:star-outline',
          color: item.star ? 'orange' : '',
        },
        color: 'teal',
        onPerform: event => this.star_onSwitch(event, item),
      });
      // label
      actionsLeft.push({
        key: 'label',
        title: this.$text('UserLabelsShort'),
        icon: {
          f7: ':outline:label-outline',
          color: '',
        },
        color: mode === 'swipeout' ? 'blue' : 'teal',
        onPerform: event => this.labels_onClick(event, item),
      });
      return actionsLeft;
    },
    item_prepareActions_rightmore_checkIfShow(action, actionBase, mode, location) {
      if (mode === 'swipeout') {
        const bRight = action.actionMode === 1 || actionBase.directShowOnSwipeout;
        if (location === 'right') return bRight;
        if (location === 'more') return !bRight;
      }
      // toolbar/menu
      const bRight = action.actionMode === 1 || actionBase.directShowOnList;
      if (location === 'right') return bRight;
      if (location === 'more') return !bRight;
    },
    item_prepareActions_rightmore(item, mode, location) {
      if (!item || !item._actions) {
        return null;
      }
      const actionsRight = [];
      for (let index in item._actions) {
        index = parseInt(index);
        const action = item._actions[index];
        const actionBase = this.getAction(action);
        const valid = this.item_prepareActions_rightmore_checkIfShow(action, actionBase, mode, location);
        if (!valid) continue;
        if (action.actionMode === 1) {
          actionsRight.push({
            key: action.id,
            title: action.__task.flowNodeNameLocale,
            icon: {
              f7: ':tools:pomotodo',
              color: '',
            },
            color: 'orange', // 'teal', // this.item_getActionColor(action, index),
            onPerform: event => this.item_onActionByModeFlow(event, item, action),
          });
        } else {
          actionsRight.push({
            key: action.id,
            title: this.item_getActionTitle(action, item),
            icon: {
              f7: actionBase.icon && actionBase.icon.f7,
              color: '',
            },
            color: actionBase.color, // this.item_getActionColor(action, index),
            onPerform: event => this.item_onAction(event, item, action),
          });
        }
      }
      return actionsRight;
    },
    item_prepareActions(item, mode) {
      const left = this.item_prepareActions_left(item, mode);
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
      // domLeft
      let domLeft;
      if (item && item.atomStage === 1) {
        // star
        let domLeftStarTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domLeftStarTitle = <div slot="title">{this.$text(item.star ? 'Unstar' : 'UserStar')}</div>;
        }
        const domLeftStar = (
          <div color="teal" propsOnPerform={event => this.star_onSwitch(event, item)}>
            <f7-icon
              slot="media"
              color={item.star ? 'orange' : ''}
              f7={item.star ? '::star' : ':outline:star-outline'}
            ></f7-icon>
            {domLeftStarTitle}
          </div>
        );
        // label
        let domLeftLabelTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domLeftLabelTitle = <div slot="title">{this.$text('UserLabels')}</div>;
        }
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.labels_onClick(event, item)}>
            <f7-icon slot="media" f7=":outline:label-outline"></f7-icon>
            {domLeftLabelTitle}
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
      if (item && item._actions) {
        for (let index in item._actions) {
          index = parseInt(index);
          const action = item._actions[index];
          const _action = this.getAction(action);
          let domActionTitle;
          if (mode === 'menu' || (!mode && this.$device.desktop)) {
            domActionTitle = <div slot="title">{this.item_getActionTitle(action, item)}</div>;
          }
          domActions.push(
            <div
              key={action.id}
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
        <div slot="right" ready={item && !!item._actions}>
          {domActions}
        </div>
      );
      return (
        <eb-context-menu mode={mode}>
          {domLeft}
          {domRight}
        </eb-context-menu>
      );
      */
    },
  },
};
