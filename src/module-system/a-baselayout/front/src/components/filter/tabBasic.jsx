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
    itemOnly: {
      type: Boolean,
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
      if (this.itemOnly) return null;
      // host
      const host = this.filterContainer._getFormHost();
      // meta
      const meta = {
        schema: this.layoutManager.layout_extend_onFilterSchema({
          schema: this.filterContainer.schemaBasic,
          type: 'basic',
        }),
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
          searchStates={this.filterContainer.searchStatesBasic}
          onSearchStatesChange={value => {
            // eslint-disable-next-line
            this.filterContainer.searchStatesBasic = value;
            this.filterContainer.onFilterChanged();
          }}
        ></eb-validate>
      );
    },
    _renderFormAtomClass() {
      if (!this.filterContainer.schemaSearch) return null;
      // host
      const host = this.filterContainer._getFormHost();
      // meta
      const meta = {
        schema: this.layoutManager.layout_extend_onFilterSchema({
          schema: this.filterContainer.schemaSearch,
          type: 'atomClass',
        }),
      };
      return (
        <eb-validate
          auto
          host={host}
          data={this.filterContainer.formAtomClass}
          meta={meta}
          onSubmit={this.onFormSubmit}
          searchStates={this.filterContainer.searchStatesSearch}
          onSearchStatesChange={value => {
            // eslint-disable-next-line
            this.filterContainer.searchStatesSearch = value;
            this.filterContainer.onFilterChanged();
          }}
        ></eb-validate>
      );
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
