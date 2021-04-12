export default {
  data() {
    return {
    };
  },
  methods: {
    validate_getInstance() {
      return this.$refs.validate;
    },
    validate_onSubmit() {
      this.actions_onSubmit();
    },
    validate_onPerformValidate(event, options) {
      const actionName = options && options.action;
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      const _action = this.getAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item });
    },
    validate_render() {
      if (!this.base_ready) return null;
      const host = {
        mode: this.container.mode,
        atomId: this.container.atomId,
      };
      return (
        <eb-validate ref="validate"
          host={host}
          readOnly={this.container.mode !== 'edit'}
          auto data={this.base.item}
          params={this.base.validateParams}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}>
        </eb-validate>
      );
    },
  },
};
