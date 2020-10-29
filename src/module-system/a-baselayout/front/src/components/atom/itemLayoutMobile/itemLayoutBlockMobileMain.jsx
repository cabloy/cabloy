export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    getValidateInstance() {
      return this.$refs.validate;
    },
    onSave(event) {
      return this.layoutManager.actions_submit(event, 'save');
    },
    onSubmit() {
      this.layoutManager.actions_onSubmit();
    },
    onPerformValidate(event, actionName) {
      const action = this.$utils.extend({}, this.layoutManager.actions_findAction('write'), { name: actionName });
      const _action = this.layoutManager.getAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.layoutManager.base.item }).then(() => {
        if (actionName === 'save') return true; // toast on success
        if (actionName === 'submit') this.$f7router.back();
      });
    },
    _renderValidate() {
      if (!this.layoutManager.base_ready) return null;
      return (
        <eb-validate ref="validate"
          readOnly={this.layoutManager.container.mode !== 'edit'}
          auto data={this.layoutManager.base.item}
          params={this.layoutManager.base.validateParams}
          propsOnPerform={this.onPerformValidate}
          propsOnSave={this.onSave}
          onSubmit={this.onSubmit}>
        </eb-validate>
      );
    },
  },
  render() {
    return this._renderValidate();
  },
};
