export default {
  data() {
    return {};
  },
  computed: {
    validate_host() {
      return {
        mode: this.container.mode,
        atomId: this.container_data.item.atomId,
        flowTaskId: this.container.flowTaskId,
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
    validate_onPerformValidate(event, data) {
      return this.actions_onPerformValidate(event, data);
    },
    validate_render() {
      if (!this.base_ready) return null;
      const meta = {
        schema: this.container_data.schema,
      };
      return (
        <eb-validate
          ref="validate"
          host={this.validate_host}
          readOnly={this.container.mode !== 'edit'}
          auto
          data={this.container_data.item}
          meta={meta}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}
        ></eb-validate>
      );
    },
  },
};
