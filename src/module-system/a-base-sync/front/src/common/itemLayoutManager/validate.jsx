export default {
  data() {
    return {
    };
  },
  methods: {
    validate_getInstance() {
      return this.$refs.validate;
    },
    validate_onSave(event) {
      return this.actions_submit(event, 'save');
    },
    validate_onSubmit() {
      this.actions_onSubmit();
    },
    validate_onPerformValidate(event, actionName) {
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      const _action = this.getAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item }).then(() => {
        if (actionName === 'save') return true; // toast on success
        if (actionName === 'submit') this.$f7router.back();
      });
    },
    validate_render() {
      if (!this.base_ready) return null;
      return (
        <eb-validate ref="validate"
          readOnly={this.container.mode !== 'edit'}
          auto data={this.base.item}
          params={this.base.validateParams}
          propsOnPerform={this.validate_onPerformValidate}
          propsOnSave={this.validate_onSave}
          onSubmit={this.validate_onSubmit}>
        </eb-validate>
      );
    },
  },
};
