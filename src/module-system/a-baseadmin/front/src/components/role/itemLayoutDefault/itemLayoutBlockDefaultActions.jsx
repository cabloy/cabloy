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
      this._renderActionsGeneral(children, ['addChild']);
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
      this._renderActionsGeneral(children, ['resourceAuthorization', 'atomAuthorization']);
      // ok
      return children;
    },
    actions_render() {
      if (!this.layoutManager.base_ready) return null;
      const children = [];
      // write
      const actionWrite = this.layoutManager.actions_findAction('write');
      // support simple
      if (actionWrite) {
        const mode = this.layoutManager.container.mode;
        const actionIcon = mode === 'edit' ? '::save' : '::edit';
        const actionName = mode === 'edit' ? 'save' : 'write';
        const actionTitle = mode === 'edit' ? 'Save' : 'Edit';
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
      // delete / clone / move
      this._renderActionsGeneral(children, ['delete', 'clone', 'move']);
      // ok
      return children;
    },
    _renderActionsGeneral(children, actionNames) {
      for (const actionName of actionNames) {
        const action = this.layoutManager.actions_findAction(actionName);
        if (action) {
          const _action = this.layoutManager.getAction(action);
          children.push(
            <eb-link
              key={action.id}
              iconF7={_action.icon && _action.icon.f7}
              tooltip={this.layoutManager.actions_getActionTitle(action)}
              propsOnPerform={event => this.actions_onAction(event, action)}
            ></eb-link>
          );
        }
      }
    },
  },
};
