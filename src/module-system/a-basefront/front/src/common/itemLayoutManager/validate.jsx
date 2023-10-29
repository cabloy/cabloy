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
        container: this.container,
        atomClassBase: this.base.atomClassBase,
        atomIdMain: this.base_atomIdMain,
        atomMain: this.base_atomMain,
        flowTaskId: this.base_flowTaskId,
        formAction: this.base_formAction,
        formActionMain: this.base_formActionMain,
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
      const action = Object.assign({}, this.actions_findAction('write'), { name: actionName });
      let actionBase = this.getAction(action);
      // dataOptions
      const dataOptions = {
        atomIdMain: this.base_atomIdMain,
        atomMain: this.base_atomMain,
      };
      if (this.base_flowTaskId) {
        dataOptions.flowTaskId = this.base_flowTaskId;
      }
      if (this.base_formAction) {
        dataOptions.formAction = this.base_formAction;
      }
      if (this.base_formActionMain) {
        dataOptions.formActionMain = this.base_formActionMain;
      }
      // actionBase: not use this.$utils.extend
      actionBase = Object.assign({}, actionBase, { dataOptions });
      // performAction: save
      const itemWrited = await this.$meta.util.performAction({ ctx: this, action: actionBase, item: this.base.item });
      if (actionName === 'save' || actionName === 'submit') {
        await this.validate_onPerformValidate_createDelay({ itemWrited });
      }
      // page dirty
      if (actionName === 'save' || actionName === 'submit') {
        this.page_setDirty(false);
      }
      return itemWrited;
    },
    async validate_onPerformValidate_createDelay({ itemWrited }) {
      if (!this.container.params?.createDelay) {
        // do nothing
        return;
      }
      // create
      const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
      let actionCreate = await useStoreAtomActions.getActionBase({
        atomClass: this.base.atomClass,
        name: 'create',
      });
      // dataOptions
      let dataOptions = this.container.params?.createDelay.dataOptions;
      dataOptions = Object.assign({}, dataOptions, { createContinue: true, noActionWrite: true, itemWrited });
      actionCreate = Object.assign({}, actionCreate, { dataOptions });
      // create
      await this.$meta.util.performAction({ ctx: this, action: actionCreate, item: this.base.item });
      // makeup
      await this.validate_onPerformValidate_createDelay_makeup({ itemWrited });
    },
    async validate_onPerformValidate_createDelay_makeup({ itemWrited }) {
      // clear createDelay
      this.container.params.createDelay = null;
      // container
      this.container.atomId = itemWrited.atomId;
      this.container.itemId = itemWrited.itemId;
      // item
      this.base.item.id = itemWrited.itemId;
      this.base.item.atomId = itemWrited.atomId;
      this.base.item.itemId = itemWrited.itemId;
      //   force validate reactive
      this.base.item = Object.assign({}, this.base.item);
      // actions
      await this.actions_fetchActions();
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
      const meta = {
        schema: this.base.validateSchema,
      };
      return (
        <eb-validate
          ref="validate"
          host={this.validate_host}
          readOnly={this.container.mode !== 'edit'}
          auto
          data={this.base.item}
          meta={meta}
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
