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
    validate_onPerformValidate(event, data) {
      return this.actions_onPerformValidate(event, data);
    },
    validate_render() {
      if (!this.base_ready) return null;
      return (
        <eb-validate ref="validate"
          containerMode={this.container.mode}
          readOnly={this.container.mode !== 'edit'}
          auto data={this.container_data.item}
          meta={
            { schema: this.container_data.schema }
          }
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}>
        </eb-validate>
      );
    },
  },
};
