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
      for (const action of this.actions.list) {
        // layout
        if (action.name === 'layout') continue;
        // write: support simple
        // if (action.name === 'write' && this.base.item.atomStage === this.base.item.atomSimple) continue;
        if (action.name === 'write' && this.base.item.atomStage !== 2) continue;
        // view
        // if (action.name === 'read' && this.container.mode === 'view') continue;
        if (action.name === 'read') continue;
        // stage
        const actionBase = this.getAction(action);
        if (actionBase.stage) {
          const stages = actionBase.stage.split(',');
          if (!stages.some(item => this.$meta.config.modules['a-base'].stage[item] === this.base.item.atomStage)) {
            continue;
          }
        }
        // ok
        actions.push(action);
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
    actions_getActionTitle(action) {
      return this.getActionTitle(action, this.base.item);
    },
    actions_renderButtonView() {
      // only show on draft/edit
      const atomClosed = this.base.item.atomClosed === 1;
      const mode = this.container.mode;
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
      // only show on draft
      const atomClosed = this.base.item.atomClosed === 1;
      const actionWrite = this.actions_findAction('write');
      // support simple
      // if (actionWrite && this.base.item.atomStage === this.base.item.atomSimple && !atomClosed) {
      if (actionWrite && this.base.item.atomStage !== 2 && !atomClosed) {
        const mode = this.container.mode;
        const actionIcon = mode === 'edit' ? '::save' : '::edit';
        const actionName = mode === 'edit' ? 'save' : 'write';
        const actionTitleDraft = this.base.item.atomSimple ? 'Save' : 'SaveAsDraft';
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
            iconF7="::done"
            tooltip={this.$text('SaveAndSubmit')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      return null;
    },
    actions_render() {
      if (!this.base_ready) return null;
      const actionNamesRight = ['layout', 'write', 'read'];
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
      const buttonSave = this.actions_renderButtonSave();
      if (buttonSave) children.push(buttonSave);
      const buttonSubmit = this.actions_renderButtonSubmit();
      if (buttonSubmit) children.push(buttonSubmit);
      // only show on draft/edit
      const buttonView = this.actions_renderButtonView();
      if (buttonView) children.push(buttonView);
      // flow actions / directShowOnItem
      for (const action of this.actions.list) {
        const actionName = action.name;
        if (actionNamesRight.includes(actionName)) continue;
        const actionBase = this.getAction(action);
        if (action.actionMode === 1) {
          <eb-link
            key={action.id}
            iconF7=":flow:activity-user-task"
            tooltip={action.__task.flowNodeNameLocale}
            propsOnPerform={event => this.actions_onActionByModeFlow(event, action)}
          ></eb-link>;
        } else if (actionBase.directShowOnItem) {
          <eb-link
            key={action.id}
            iconF7={actionBase.icon && actionBase.icon.f7}
            tooltip={this.actions_getActionTitle(action)}
            propsOnPerform={event => this.actions_onAction(event, action)}
          ></eb-link>;
        }
      }
      // popover
      if (this.actions_listPopover) {
        children.push(
          <f7-link
            key="actionsPopover"
            iconF7="::more-horiz"
            tooltip={this.$text('More')}
            popover-open={`#${this.actions.popoverId}`}
          ></f7-link>
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
          const actionBase = this.getAction(action);
          children.push(
            <eb-list-item
              key={action.id}
              link="#"
              popover-close
              propsOnPerform={event => this.actions_onAction(event, action)}
            >
              <f7-icon
                slot="media"
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
