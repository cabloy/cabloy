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
      return actions.filter(action => {
        return !['read'].includes(action.name);
      });
    },
    actions_listPopover() {
      if (!this.base_ready) return null;
      let actions = this.actions_itemActions;
      if (!actions) return null;
      // just remove write
      actions = actions.filter(action => {
        return !['write'].includes(action.name);
      });
      // ok
      return actions.length > 0 ? actions : null;
    },
  },
  methods: {
    async actions_fetchActions() {
      if (this.actions.list) return;
      let actions = await this.$api.post('/a/detail/detail/actions', {
        flowTaskId: this.container.flowTaskId,
        atomKey: { atomId: this.base.item.atomId },
        detailClass: this.base.detailClass,
        mode: this.container.mode,
      });
      // filter
      actions = actions.filter(action => {
        const _action = this.getDetailAction(action);
        // filter: disableOnItem
        return !_action.disableOnItem;
      });
      this.actions.list = actions;
    },
    actions_findAction(actionName) {
      if (!this.actions_itemActions) return null;
      return this.actions_itemActions.find(item => item.name === actionName);
    },
    actions_onSubmit() {
      this.$refs.buttonSave.onClick();
    },
    async actions_submit(event, action) {
      const validateInstance = this.validate_getInstance();
      if (!validateInstance) return;
      return await validateInstance.perform(event, { action });
    },
    async actions_onSaveDone(event) {
      await this.actions_onAction(event, 'save');
      this.$f7router.back();
    },
    async actions_onAction(event, action) {
      if (action === 'save') {
        return await this.actions_submit(event, action);
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
      return await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item: this.base.item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // only show on draft
      const actionWrite = this.actions_findAction('write');
      if (actionWrite) {
        const actionIcon = '::save';
        const actionName = 'save';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonSave"
            iconF7={actionIcon}
            tooltip={this.$text('Save')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
        children.push(
          <eb-link
            key="saveDone"
            ref="buttonSaveDone"
            iconF7="::save-and-close"
            tooltip={this.$text('SaveAndClose')}
            propsOnPerform={event => this.actions_onSaveDone(event)}
          ></eb-link>
        );
      }
      //
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
          const _action = this.getDetailAction(action);
          children.push(
            <eb-list-item
              key={action.code}
              link="#"
              popover-close
              propsOnPerform={event => this.actions_onAction(event, action)}
            >
              <f7-icon
                slot="media"
                material={_action.icon && _action.icon.material}
                f7={_action.icon && _action.icon.f7}
              ></f7-icon>
              <div slot="title">{this.getDetailActionTitle(action)}</div>
            </eb-list-item>
          );
        }
        domList = <f7-list inset>{children}</f7-list>;
      }
      return <f7-popover id={this.actions.popoverId}>{domList}</f7-popover>;
    },
  },
};
