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
      if (!this.actions.list) return null;
      const actions = [];
      for (const action of this.actions.list) {
        // layout
        if (action.name === 'layout') continue;
        // write: support simple
        // if (action.name === 'write' && this.base.item.atomStage === this.base.item.atomSimple) continue;
        if (action.name === 'write' && this.base.item.atomStage !== 2) continue;
        // view
        // if (action.name === 'read' && this.container.mode === 'view') continue;
        if (action.name === 'read') continue;
        // flow actions
        if (action.actionMode === 1) continue;
        // actionBase
        const actionBase = this.getAction(action);
        // directShowOnItem
        if (!actionBase.directShowOnItem) {
          // stage
          if (actionBase.stage) {
            const stages = actionBase.stage.split(',');
            if (!stages.some(item => this.$meta.config.modules['a-base'].stage[item] === this.base.item.atomStage)) {
              continue;
            }
          }
          // ok
          actions.push(action);
        }
      }
      // specials
      //    need not append draft button again
      //      draft: ignore simple
      // if (this.base.item.atomSimple === 0 && this.base.item.atomStage > 0 && !this.actions_findAction('write')) {
      //   actions.push({
      //     module: this.base.atomClass.module,
      //     atomClassName: this.base.atomClass.atomClassName,
      //     name: 'draft',
      //   });
      // }
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
        const atomClassBase = this.getAtomClass(this.base.atomClass);
        if (atomClassBase.history !== false) {
          actions.push({
            module: this.base.atomClass.module,
            atomClassName: this.base.atomClass.atomClassName,
            name: 'history',
          });
        }
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
    async actions_createDelayActions() {
      // just use write action
      const actions = [];
      const actionWrite = {
        code: 3,
        name: 'write',
      };
      actions.push(actionWrite);
      // ok
      this.actions.list = actions;
    },
    async actions_fetchActions() {
      const options = this.base_prepareReadOptions();
      let actions = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: this.container.atomId },
        atomClass: this.base.atomClass,
        options,
      });
      // filter
      actions = actions.filter(action => {
        if (action.actionMode === 1) return true;
        const _action = this.getAction(action);
        // filter: disableOnItem
        return !_action.disableOnItem;
      });
      // ok
      this.actions.list = actions;
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
        return this.validate_onPerformValidateWrapper(event, options);
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
      let actionBase = this.getAction(action);
      if (!actionBase) return;
      actionBase = this.$utils.extend({}, actionBase, { targetEl: event.currentTarget });
      // for write
      if (action.name === 'write') {
        actionBase = this.$utils.extend({}, actionBase, { navigateOptions: { target: '_self' } });
      }
      return this.$meta.util.performAction({ ctx: this, action: actionBase, item: this.base.item });
    },
    async actions_onActionByModeFlow(event, action) {
      const task = action.__task;
      const url = `/a/flowtask/flow?flowId=${task.flowId}&flowTaskId=${task.flowTaskId}`;
      this.$view.navigate(url);
    },
    actions_getActionTitle(action) {
      return this.getActionTitle(action, this.base.item);
    },
    actions_renderButtonView() {
      // need not show view button even on edit mode
      const mode = this.container.mode;
      if (mode === 'edit') {
        return null;
      }
      // hold the following codes for future restructures
      // only show on draft/edit
      const atomClosed = this.base.item.atomClosed === 1;
      const actionView = this.actions_findAction('read');
      if (mode === 'edit' && actionView && this.base.item.atomStage === this.base.item.atomSimple && !atomClosed) {
        const actionIcon = '::visibility';
        const actionName = 'read';
        const actionTitle = 'View';
        return (
          <eb-link
            key={actionName}
            ref="buttonView"
            iconF7={actionIcon}
            tooltip={this.$text(actionTitle)}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      return null;
    },
    actions_renderButtonSave() {
      const actionWrite = this.actions_findAction('write');
      if (!actionWrite) return null;
      const atomClassBase = this.base.atomClassBase;
      // only show on draft
      const atomClosed = this.base.item.atomClosed === 1;
      // support simple
      // if (actionWrite && this.base.item.atomStage === this.base.item.atomSimple && !atomClosed) {
      if (atomClassBase.itemOnly || (this.base.item.atomStage !== 2 && !atomClosed)) {
        const mode = this.container.mode;
        const actionIconDraft = atomClassBase.itemOnly || this.base.item.atomSimple ? '::save' : '::save-as-draft';
        const actionIcon = mode === 'edit' ? actionIconDraft : '::edit';
        const actionName = mode === 'edit' ? 'save' : 'write';
        const actionTitleDraft = atomClassBase.itemOnly || this.base.item.atomSimple ? 'Save' : 'SaveAsDraft';
        const actionTitle = mode === 'edit' ? actionTitleDraft : this.actions_getActionTitle(actionWrite);
        return (
          <eb-link
            key={actionName}
            ref="buttonSave"
            iconF7={actionIcon}
            tooltip={this.$text(actionTitle)}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      return null;
    },
    actions_renderButtonSubmit() {
      const atomClosed = this.base.item.atomClosed === 1;
      const actionWrite = this.actions_findAction('write');
      // submit
      if (actionWrite && this.base.item.atomStage === 0 && !atomClosed) {
        const actionName = 'submit';
        return (
          <eb-link
            key={actionName}
            ref="buttonSubmit"
            iconF7="::save-and-submit"
            tooltip={this.$text('SaveAndSubmit')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      return null;
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // basic
      this.actions_render_buttonBasic({ children });
      // flow actions / directShowOnItem
      this.actions_render_buttonNormal({ children });
      // popover
      this.actions_render_buttonPopover({ children });
      //
      return children;
    },
    actions_render_buttonBasic({ children }) {
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
      const buttonSave = this.actions_renderButtonSave();
      if (buttonSave) children.push(buttonSave);
      const buttonSubmit = this.actions_renderButtonSubmit();
      if (buttonSubmit) children.push(buttonSubmit);
      // only show on draft/edit
      const buttonView = this.actions_renderButtonView();
      if (buttonView) children.push(buttonView);
    },
    actions_render_buttonNormal({ children }) {
      if (!this.actions.list) return;
      const actionNamesRight = ['layout', 'write', 'read'];
      for (const action of this.actions.list) {
        const actionName = action.name;
        if (actionNamesRight.includes(actionName)) continue;
        const actionBase = this.getAction(action);
        if (action.actionMode === 1) {
          children.push(
            <eb-link
              key={action.id}
              iconF7=":flow:activity-user-task"
              propsOnPerform={event => this.actions_onActionByModeFlow(event, action)}
            >
              {action.__task.flowNodeNameLocale}
            </eb-link>
          );
        } else if (actionBase.directShowOnItem) {
          children.push(
            <eb-link
              key={action.id}
              iconF7={actionBase.icon && actionBase.icon.f7}
              propsOnPerform={event => this.actions_onAction(event, action)}
            >
              {this.actions_getActionTitle(action)}
            </eb-link>
          );
        }
      }
    },
    actions_render_buttonPopover({ children }) {
      if (!this.actions_listPopover) return;
      children.push(
        <f7-link
          key="actionsPopover"
          iconF7="::more-horiz"
          tooltip={this.$text('More')}
          popover-open={`#${this.actions.popoverId}`}
        ></f7-link>
      );
    },
    actions_renderPopover() {
      let domList;
      const actions = this.actions_listPopover;
      if (actions) {
        const children = [];
        for (const action of actions) {
          const actionBase = this.getAction(action);
          const actionColor = actionBase.color;
          const iconColor = (actionBase.icon && actionBase.icon.color) || actionColor;
          children.push(
            <eb-list-item
              key={action.id}
              text-color={actionColor}
              link="#"
              popover-close
              propsOnPerform={event => this.actions_onAction(event, action)}
            >
              <f7-icon
                slot="media"
                color={iconColor}
                material={actionBase.icon && actionBase.icon.material}
                f7={actionBase.icon && actionBase.icon.f7}
              ></f7-icon>
              <div slot="title">{this.actions_getActionTitle(action)}</div>
            </eb-list-item>
          );
        }
        domList = <f7-list inset>{children}</f7-list>;
      }
      return <f7-popover id={this.actions.popoverId}>{domList}</f7-popover>;
    },
  },
};
