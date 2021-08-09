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
    const formBasic = {
      atomName: form.atomName,
      stage: form.stage,
      atomClass: form.atomClass,
    };
    return {
      formBasic,
    };
  },
  computed: {},
  watch: {
    'formBasic.atomClass': function () {
      // clear formAtomClass
      // eslint-disable-next-line
      this.filterContainer.formAtomClass = {};
      this.filterContainer.atomClassChanged();
    },
    formBasic: {
      handler() {
        Object.assign(this.filterContainer.form, this.formBasic);
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    onFormSubmit() {
      if (this.filterContainer.immediate) {
        // donothing
      } else {
        this.filterContainer.onPerformSearch();
      }
    },
    _renderFormBasic() {
      const configTabBasic = this.filterConfig.tabs.basic;
      // params
      const params = {
        module: configTabBasic.schema.module,
        schema: configTabBasic.schema.schema,
      };
      // host
      const host = {
        hint: false,
        container: this.layoutManager.container,
      };
      // meta
      const meta = {
        properties: {
          stage: {
            ebOptions: this.filterContainer.stages,
          },
        },
      };
      // render
      return <eb-validate ref="validate" auto host={host} meta={meta} data={this.formBasic} params={params} onSubmit={this.onFormSubmit}></eb-validate>;
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
