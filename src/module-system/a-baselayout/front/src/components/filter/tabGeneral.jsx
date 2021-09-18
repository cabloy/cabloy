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
  data() {
    return {};
  },
  methods: {
    onFormSubmit() {
      this.filterContainer.onFormSubmit();
    },
    _renderFormGeneral() {
      // host
      const host = {
        hint: false,
        container: this.layoutManager.container,
        atomClassBase: this.filterContainer.atomClassBase,
      };
      // meta
      const meta = {
        schema: this.filterContainer.schemaGeneral,
        properties: {},
      };
      // render
      return (
        <eb-validate
          auto
          host={host}
          meta={meta}
          data={this.filterContainer.form}
          onSubmit={this.onFormSubmit}
          searchStates={this.filterContainer.searchStatesGeneral}
          onSearchStatesChange={value => {
            // eslint-disable-next-line
            this.filterContainer.searchStatesGeneral = value;
          }}
        ></eb-validate>
      );
    },
  },
  render() {
    return <div>{this._renderFormGeneral()}</div>;
  },
};
