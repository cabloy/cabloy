import Vue from 'vue';
export default {
  data() {
    return {
      actions: {
        list: null,
        layoutPopoverId: Vue.prototype.$meta.util.nextId('popover'),
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
    actions_onActionLayout(event, layout) {
      console.log(layout);
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // layout
      children.push(
        <f7-link key="actionsLayout" iconMaterial="view_list" popover-open={`#${this.actions.layoutPopoverId}`}></f7-link>
      );
      //
      return children;
    },
    actions_renderPopover() {
      if (!this.base_ready) return null;
      // layouts
      const layouts = this.$meta.util.getProperty(this.base.config, 'render.tree.info.layouts');
      const children = [];
      for (const layout of layouts) {
        children.push(
          <eb-list-item key={layout.name} link="#" popover-close propsOnPerform={event => this.actions_onActionLayout(event, layout)}>
            <f7-icon slot="media" material={this.layout.current === layout.name ? 'done' : ''}></f7-icon>
            <div slot="title">{this.$text(layout.title)}</div>
          </eb-list-item>
        );
      }
      // list
      const domList = (
        <f7-list inset>
          {children}
        </f7-list>
      );
      return (
        <f7-popover id={this.actions.layoutPopoverId}>
          {domList}
        </f7-popover>
      );
    },
  },
};
