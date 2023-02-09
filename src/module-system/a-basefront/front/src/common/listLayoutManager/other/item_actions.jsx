export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      await this.$meta.util.performAction({ ctx: this, action: _action, item });
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async item_onActionView(event, item) {
      let actionName = this.$meta.util.getProperty(this.container.params, 'actionOnClick');
      if (!actionName) {
        if (item.atomStage === 0 && item.atomClosed === 0 && item.atomFlowId === 0) {
          actionName = 'write';
        } else {
          actionName = 'read';
        }
      }
      return await this.item_onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: actionName,
      });
    },
    item_getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    item_getActionTitle(action, item) {
      return this.getActionTitle(action, item);
    },
    item_prepareActions(item) {
      const left = this.item_prepareActions_left(item);
      const right = this.item_prepareActions_right(item);
      return { left, right };
    },
    item_prepareActions_left(item) {
      if (!item || item.atomStage !== 1) return null;
      const actionsLeft = [];
      // star
      actionsLeft.push({
        key: 'star',
        title: this.$text(item.star ? 'Unstar' : 'UserStar'),
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
        title: this.$text('UserLabels'),
        icon: {
          f7: ':outline:label-outline',
          color: '',
        },
        color: 'blue',
        onPerform: event => this.labels_onClick(event, item),
      });
      return actionsLeft;
    },
    item_prepareActions_right(item) {
      if (!item || !item._actions) {
        return null;
      }
      const actionsRight = [];
      for (let index in item._actions) {
        index = parseInt(index);
        const action = item._actions[index];
        const _action = this.getAction(action);
        actionsRight.push({
          key: action.id,
          title: this.item_getActionTitle(action, item),
          icon: {
            f7: _action.icon && _action.icon.f7,
            color: '',
          },
          color: this.item_getActionColor(action, index),
          onPerform: event => this.item_onAction(event, item, action),
        });
      }
      return actionsRight;
    },
    item_renderContextMenu(item, mode) {
      const { left, right, more } = this.item_prepareActions(item);
      return <eb-actions-bar mode={mode} left={left} right={right} more={more}></eb-actions-bar>;
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
    },
  },
};
