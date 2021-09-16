export default {
  data() {
    return {};
  },
  computed: {
    validate_host() {
      const stage = this.base_getCurrentStage();
      return {
        stage,
        mode: this.container.mode,
        atomId: this.container.atomId,
      };
    },
  },
  methods: {
    validate_getInstance() {
      return this.$refs.validate;
    },
    validate_onSubmit() {
      this.actions_onSubmit();
    },
    async validate_onPerformValidate(event, options) {
      const actionName = options && options.action;
      return await this.validate_onPerformAction(event, actionName);
    },
    async validate_onPerformAction(event, actionName) {
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      const _action = this.getAction(action);
      const res = await this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item });
      if (actionName === 'save' || actionName === 'submit') {
        this.page_setDirty(false);
      }
      return res;
    },
    validate_onValidateItemChange() {
      this.page_setDirty(true);
    },
    validate_render() {
      if (!this.base_ready) return null;
      return (
        <eb-validate
          ref="validate"
          host={this.validate_host}
          readOnly={this.container.mode !== 'edit'}
          auto
          data={this.base.item}
          params={this.base.validateParams}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}
          onValidateItemChange={this.validate_onValidateItemChange}
        ></eb-validate>
      );
    },
  },
};
