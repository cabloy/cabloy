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
      const host = this.filterContainer._getFormHost();
      // meta
      const meta = {
        schema: this.layoutManager.layout_extend_onFilterSchema({
          schema: this.filterContainer.schemaGeneral,
          type: 'general',
        }),
        properties: {
          stage: {
            ebOptions: this.filterContainer.stages,
          },
        },
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
            this.filterContainer.onFilterChanged();
          }}
        ></eb-validate>
      );
    },
  },
  render() {
    return <div>{this._renderFormGeneral()}</div>;
  },
};
