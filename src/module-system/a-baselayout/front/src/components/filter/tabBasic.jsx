export default {
  props: {
    layoutManager: {
      type: Object,
    },
    filterConfig: {
      type: Object,
    },
    filterContainer: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    formBasic() {
      const form = this.filterContainer.form;
      return {
        atomName: form.atomName,
        stage: form.stage,
      };
    },
  },
  created() {},
  methods: {
    onFormSubmit() {
      if (this.filterContainer.immediate) {
        // donothing
      } else {
        this.filterContainer.onPerformSearch();
      }
    },
    _renderFormBasic() {
      const configTabBasic = this.filterConfig.tabs.basic;
      const params = {
        module: configTabBasic.schema.module,
        schema: configTabBasic.schema.schema,
      };
      const host = {
        hint: false,
      };
      return <eb-validate ref="validate" auto host={host} data={this.formBasic} params={params} onSubmit={this.onFormSubmit}></eb-validate>;
    },
    _renderFormAtomClass() {},
  },
  render() {
    return (
      <div>
        {this._renderFormBasic()}
        {this._renderFormAtomClass()}
      </div>
    );
  },
};
