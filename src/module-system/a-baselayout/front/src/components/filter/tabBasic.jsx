// form fields: atomName/stage/atomClass
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
  methods: {
    onFormSubmit() {
      this.filterContainer.onFormSubmit();
    },
    _renderFormBasic() {
      // host
      const host = {
        hint: false,
        container: this.layoutManager.container,
        stages: this.filterContainer.stages,
      };
      // meta
      const meta = {
        schema: this.filterContainer.schemaBasic,
        properties: {
          stage: {
            ebOptions: this.filterContainer.stages,
          },
        },
      };
      // render
      return <eb-validate auto host={host} meta={meta} data={this.filterContainer.form} onSubmit={this.onFormSubmit}></eb-validate>;
    },
    _renderFormAtomClass() {
      if (!this.filterContainer.schemaSearch) return null;
      // host
      const host = {
        hint: false,
        container: this.layoutManager.container,
      };
      // meta
      const meta = {
        schema: this.filterContainer.schemaSearch,
      };
      return <eb-validate auto host={host} data={this.filterContainer.formAtomClass} meta={meta} onSubmit={this.onFormSubmit}></eb-validate>;
    },
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
