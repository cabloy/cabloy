// form fields: mine/star/label/language
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
  data() {},
  methods: {
    onFormSubmit() {
      if (this.filterContainer.immediate) {
        // donothing
      } else {
        this.filterContainer.onPerformSearch();
      }
    },
    _renderFormGeneral() {
      const configTabGeneral = this.filterConfig.tabs.general;
      // params
      const params = {
        module: configTabGeneral.schema.module,
        schema: configTabGeneral.schema.schema,
      };
      // host
      const host = {
        hint: false,
        container: this.layoutManager.container,
        atomClassBase: this.filterContainer.atomClassBase,
      };
      // meta
      const meta = {
        properties: {},
      };
      // render
      return <eb-validate auto host={host} meta={meta} data={this.filterContainer.form} params={params} onSubmit={this.onFormSubmit}></eb-validate>;
    },
  },
  render() {
    return <div>{this._renderFormGeneral()}</div>;
  },
};
