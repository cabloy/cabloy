export default {
  data() {
    return {};
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
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      const _action = this.getDetailAction(action);
      const res = await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item: this.base.item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
      // only has save action, without submit
      if (actionName === 'save') {
        this.page_setDirty(false);
      }
      return res;
    },
    validate_onValidateItemChange() {
      if (this.container.mode !== 'edit') return;
      this.page_setDirty(true);
    },
    validate_render() {
      if (!this.base_ready) return null;
      const stage = this.base_getCurrentStage();
      const host = {
        stage,
        mode: this.container.mode,
        flowTaskId: this.container.flowTaskId,
        detailId: this.container.detailId,
      };
      return (
        <eb-validate
          ref="validate"
          host={host}
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
