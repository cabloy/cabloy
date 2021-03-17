import Vue from 'vue';
export default {
  data() {
    return {
      actions: {
        list: null,
        popoverId: Vue.prototype.$meta.util.nextId('popover'),
      },
    };
  },
  computed: {
    actions_itemActions() {
      if (!this.actions.list) return null;
      const actions = this.actions.list;
      // just remove read
      //    should show write/moveUp/moveDown
      return actions.filter(item => [ 'read' ].indexOf(item.name) === -1);
    },
    actions_listPopover() {
      if (!this.base_ready) return null;
      let actions = this.actions_itemActions;
      if (!actions) return null;
      // just remove write
      actions = actions.filter(item => [ 'write' ].indexOf(item.name) === -1);
      // ok
      return actions.length > 0 ? actions : null;
    },
  },
  methods: {
    async actions_fetchActions() {
      if (this.actions.list) return;
      this.actions.list = await this.$api.post('/a/detail/detail/actions', {
        atomKey: { atomId: this.base.item.atomId },
        detailClass: this.base.detailClass,
        mode: this.container.mode,
      });
    },
    actions_findAction(actionName) {
      if (!this.actions_itemActions) return null;
      return this.actions_itemActions.find(item => item.name === actionName);
    },
    actions_onSubmit() {
      this.$refs.buttonSave.onClick();
    },
    actions_submit(event, action) {
      const validateInstance = this.validate_getInstance();
      if (!validateInstance) return;
      return validateInstance.perform(event, { action });
    },
    actions_onAction(event, action) {
      if (action === 'save') {
        return this.actions_submit(event, action);
      }
      if (typeof action === 'string') {
        action = {
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: action,
        };
      }
      // action
      const _action = this.getDetailAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item });
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // only show on draft
      const actionWrite = this.actions_findAction('write');
      if (actionWrite) {
        const actionIcon = 'save';
        const actionName = 'save';
        children.push(
          <eb-link key={actionName} ref="buttonSave" iconMaterial={actionIcon} propsOnPerform={event => this.actions_onAction(event, actionName)}></eb-link>
        );
      }
      //
      if (this.actions_listPopover) {
        children.push(
          <f7-link key="actionsPopover" iconMaterial="more_horiz" popover-open={`#${this.actions.popoverId}`}></f7-link>
        );
      }
      //
      return children;
    },
    actions_renderPopover() {
      let domList;
      const actions = this.actions_listPopover;
      if (actions) {
        const children = [];
        for (const action of actions) {
          const _action = this.getDetailAction(action);
          children.push(
            <eb-list-item key={action.code} link="#" popover-close propsOnPerform={event => this.actions_onAction(event, action)}>
              <f7-icon slot="media" material={_action.icon && _action.icon.material }></f7-icon>
              <div slot="title">{this.getDetailActionTitle(action)}</div>
            </eb-list-item>
          );
        }
        domList = (
          <f7-list inset>
            {children}
          </f7-list>
        );
      }
      return (
        <f7-popover id={this.actions.popoverId}>
          {domList}
        </f7-popover>
      );
    },
  },
};
