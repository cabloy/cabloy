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
    actions_listPopover() {
      if (!this.base_ready) return null;
      const actions = [];
      const atomClosed = this.base.item.atomClosed === 1;
      // submit
      const submit = this.actions_findAction('write') && this.base.item.atomStage === 0 && !atomClosed;
      if (submit) {
        actions.push({
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: 'submit',
        });
      }
      // others
      for (const action of this.actions.list) {
        // write
        if (action.name === 'write' && this.base.item.atomStage === 0) continue;
        // view
        if (action.name === 'read' && this.container.mode === 'view') continue;
        // stage
        const _action = this.getAction(action);
        if (_action.stage) {
          const stages = _action.stage.split(',');
          if (!stages.some(item => this.$meta.config.modules['a-base'].stage[item] === this.base.item.atomStage)) continue;
        }
        // ok
        actions.push(action);
      }
      // specials
      //    draft
      if (this.base.item.atomStage > 0 && !this.actions_findAction('write')) {
        actions.push({
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: 'draft',
        });
      }
      //    formal
      if (this.base.item.atomIdFormal) {
        actions.push({
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: 'formal',
        });
      }
      //    history
      if (this.base.item.atomIdFormal || this.base.item.atomStage === 1) {
        actions.push({
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: 'history',
        });
      }
      //    workflow
      if (this.base.item.atomStage === 0 && this.base.item.atomFlowId > 0) {
        actions.push({
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: 'workflow',
        });
      }
      // ok
      return actions.length > 0 ? actions : null;
    },
  },
  methods: {
    async actions_fetchActions() {
      this.actions.list = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: this.container.atomId },
      });
    },
    actions_findAction(actionName) {
      if (!this.actions.list) return null;
      return this.actions.list.find(item => item.name === actionName);
    },
    actions_onSubmit() {
      this.$refs.buttonSave.onClick();
    },
    actions_submit(event, action) {
      const options = { action };
      const validateInstance = this.validate_getInstance();
      if (!validateInstance) {
        return this.validate_onPerformValidate(event, options);
      }
      return validateInstance.perform(event, options);
    },
    actions_onAction(event, action) {
      if (action === 'save' || action === 'submit') {
        return this.actions_submit(event, action);
      }
      if (action.name === 'submit') {
        return this.actions_submit(event, action.name);
      }
      if (typeof action === 'string') {
        action = {
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: action,
        };
      }
      // action
      let _action = this.getAction(action);
      // for write
      if (action.name === 'write') {
        _action = this.$utils.extend({}, _action, { navigateOptions: { target: '_self' } });
      }
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item });
    },
    actions_getActionTitle(action) {
      return this.getActionTitle(action, this.base.item);
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // only show on draft
      const atomClosed = this.base.item.atomClosed === 1;
      const actionWrite = this.actions_findAction('write');
      if (actionWrite && this.base.item.atomStage === 0 && !atomClosed) {
        const actionIcon = this.container.mode === 'edit' ? 'save' : 'edit';
        const actionName = this.container.mode === 'edit' ? 'save' : 'write';
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
          const _action = this.getAction(action);
          children.push(
            <eb-list-item key={action.id} link="#" popover-close propsOnPerform={event => this.actions_onAction(event, action)}>
              <f7-icon slot="media" material={_action.icon && _action.icon.material }></f7-icon>
              <div slot="title">{this.actions_getActionTitle(action)}</div>
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
