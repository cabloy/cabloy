export default {
  data() {
    return {};
  },
  methods: {
    // addChild / users / includes
    info_renderActionsLeft() {
      if (!this.layoutManager.base_ready) return;
      const children = [];
      // addChild
      const actionAddChild = this.layoutManager.actions_findAction('addChild');
      if (actionAddChild) {
        const _action = this.layoutManager.getAction(actionAddChild);
        children.push(
          <eb-link
            key={actionAddChild.id}
            iconF7={_action.icon.f7}
            tooltip={this.layoutManager.actions_getActionTitle(actionAddChild)}
            propsOnPerform={event => this.actions_onAction(event, actionAddChild)}
          ></eb-link>
        );
      }
      // check write action
      const actionWrite = this.layoutManager.actions_findAction('write');
      if (actionWrite) {
        children.push(
          <eb-link
            key="actionsLeft:users"
            iconF7=":outline:group-outline"
            tooltip={this.$text('Users')}
            propsOnPerform={event => this.actions_onAction(event, { name: 'users' })}
          ></eb-link>
        );
        children.push(
          <eb-link
            key="actionsLeft:includes"
            iconF7=":role:role"
            tooltip={this.$text('Includes')}
            propsOnPerform={event => this.actions_onAction(event, { name: 'includes' })}
          ></eb-link>
        );
      }
      // ok
      return children;
    },
    // resourceAuthorization/atomAuthorization
    info_renderActionsRight() {
      if (!this.layoutManager.base_ready) return;
      const children = [];
      for (const actionName of ['resourceAuthorization', 'atomAuthorization']) {
        const action = this.layoutManager.actions_findAction(actionName);
        if (action) {
          const _action = this.layoutManager.getAction(action);
          children.push(
            <eb-link
              key={action.id}
              iconF7={_action.icon.f7}
              tooltip={this.layoutManager.actions_getActionTitle(action)}
              propsOnPerform={event => this.actions_onAction(event, action)}
            ></eb-link>
          );
        }
      }
      // ok
      return children;
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // layout button before save
      const actionLayout = this.actions_findAction('layout');
      if (actionLayout) {
        const actionName = 'layout';
        const actionIcon = '::view-list';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonLayout"
            iconF7={actionIcon}
            tooltip={this.$text('Layout')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      // only show on draft
      const atomClosed = this.base.item.atomClosed === 1;
      const actionWrite = this.actions_findAction('write');
      // support simple
      if (actionWrite && this.base.item.atomStage === this.base.item.atomSimple && !atomClosed) {
        const actionIcon = this.container.mode === 'edit' ? '::save' : '::edit';
        const actionName = this.container.mode === 'edit' ? 'save' : 'write';
        const actionTitle = this.container.mode === 'edit' ? 'Save' : 'Edit';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonSave"
            iconF7={actionIcon}
            tooltip={this.$text(actionTitle)}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      // submit
      if (actionWrite && this.base.item.atomStage === 0 && !atomClosed) {
        const actionName = 'submit';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonSubmit"
            iconF7="::done"
            tooltip={this.$text('Submit')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      //
      if (this.actions_listPopover) {
        children.push(
          <f7-link key="actionsPopover" iconF7="::more-horiz" popover-open={`#${this.actions.popoverId}`}></f7-link>
        );
      }
      //
      return children;
    },
  },
};
