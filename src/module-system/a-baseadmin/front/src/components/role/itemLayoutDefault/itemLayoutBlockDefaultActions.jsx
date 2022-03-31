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
      console.log(actionAddChild);
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
      // ok
      return children;
    },
    info_renderActionsRight() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // atom closed
      if (item.atomStage === 0 && item.atomClosed === 1) {
        children.push(
          <f7-badge key="atomClosed" color="orange">
            {this.$text('Closed')}
          </f7-badge>
        );
      }
      // flow
      if (item.atomStage === 0 && item.flowNodeNameCurrentLocale) {
        children.push(
          <f7-badge key="flowNodeNameCurrent" color="orange">
            {item.flowNodeNameCurrentLocale}
          </f7-badge>
        );
      }
      // avatar
      children.push(this.info_renderAvatar());
      // date
      children.push(this.info_renderDate());
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
