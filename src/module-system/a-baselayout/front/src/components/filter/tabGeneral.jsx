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
    const form = this.filterContainer.form;
    const formGeneral = {
      mine: form.mine,
      star: form.star,
      label: form.label,
      language: form.language,
    };
    return {
      formGeneral,
    };
  },
  computed: {},
  watch: {
    formGeneral: {
      handler() {
        Object.assign(this.filterContainer.form, this.formGeneral);
      },
      deep: true,
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
      return <eb-validate auto host={host} meta={meta} data={this.formGeneral} params={params} onSubmit={this.onFormSubmit}></eb-validate>;
    },
  },
  render() {
    return <div>{this._renderFormGeneral()}</div>;
  },
};
