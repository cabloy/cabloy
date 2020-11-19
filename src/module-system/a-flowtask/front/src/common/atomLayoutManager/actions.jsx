export default {
  data() {
    return {
    };
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
    actions_submit(event, action) {
      const validateInstance = this.validate_getInstance();
      if (!validateInstance) return;
      return validateInstance.perform(event, action);
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
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item }).then(res => {
        if (res) this.$f7router.back();
      });
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = this.container_flowLayoutManager._timeline_renderFlowTaskActionsChildren({
        task: this.container_task, enableView: false,
      });
      return children;
    },
  },
};
