export default {
  data() {
    return {
      validate: {
        errors: null,
      },
    };
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
    async validate_onPerformValidateWrapper(event, options) {
      try {
        const res = await this.validate_onPerformValidate(event, options);
        if (res === true) {
          this.$view.toast.show({ text: this.$text('Operation Succeeded') });
        } else if (typeof res === 'string') {
          this.$view.toast.show({ text: res });
        }
      } catch (err) {
        if (err.code === 422) {
          // eslint-disable-next-line
          this.validate.errors = err.message;
          const message = this.$text('Data Validation Error');
          this.$view.toast.show({ text: message });
          // need not switch layout, because saveDraftOnly take effect
          // this.$nextTick(() => {
          //   // switch layout
          //   this.layout_switchLayout('default');
          // });
          return;
        }
        if (err.message) {
          this.$view.toast.show({ text: err.message });
          throw err;
        }
      }
    },
    async validate_onPerformValidate(event, options) {
      const actionName = options && options.action;
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      let _action = this.getAction(action);
      if (actionName === 'save' && this.container.params.createDelay) {
        let dataOptions = this.container.params.createDelay.dataOptions;
        dataOptions = this.$utils.extend({}, dataOptions, { createContinue: true });
        _action = this.$utils.extend({}, _action, { dataOptions });
      }
      const res = await this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item });
      // todo: clear params.createDelay and others
      // page dirty
      if (actionName === 'save' || actionName === 'submit') {
        this.page_setDirty(false);
      }
      return res;
    },
    validate_onValidateItemChange() {
      if (this.container.mode !== 'edit') return;
      this.page_setDirty(true);
    },
    validate_errorsSet(errors) {
      this.validate.errors = errors;
    },
    validate_errorsReset() {
      this.validate.errors = null;
    },
    validate_render(options) {
      options = options || {};
      if (!this.base_ready) return null;
      return (
        <eb-validate
          ref="validate"
          host={this.validate_host}
          readOnly={this.container.mode !== 'edit'}
          auto
          data={this.base.item}
          params={this.base.validateParams}
          errors={this.validate.errors}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={options.validate_onSubmit || this.validate_onSubmit}
          onValidateItemChange={this.validate_onValidateItemChange}
          onErrorsSet={this.validate_errorsSet}
          onErrorsReset={this.validate_errorsReset}
        ></eb-validate>
      );
    },
  },
};
