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
    return {
      searchQuery: null,
    };
  },
  methods: {
    getComponentInstance() {
      return this.$refs.tagSelect.getComponentInstance();
    },
    onChange() {
      const checked = this.getComponentInstance().checked();
      // eslint-disable-next-line
      this.filterContainer.form.tag = checked;
    },
    onPerformSelectLanguage() {
      return this.filterContainer.onPerformSelectLanguage();
    },
    _renderSelectLanguage() {
      return <eb-button propsOnPerform={this.onPerformSelectLanguage}>{this.$text('Select Language')}</eb-button>;
    },
    _renderTagSelect() {
      const selectedTags = this.filterContainer.form.tag;
      const options = {
        props: {
          atomClass: this.filterContainer.atomClass,
          language: this.filterContainer.form.language,
          multiple: false,
          searchQuery: this.searchQuery,
          selectedTags,
          showBlockCurrent: false,
        },
        on: {
          change: this.onChange,
        },
      };
      return <eb-component ref="tagSelect" module="a-basefront" name="tagSelect" options={options}></eb-component>;
    },
  },
  render() {
    let domSelectLanguage;
    let domTagSelect;
    if (this.filterContainer.atomClassBase.language && !this.filterContainer.form.language) {
      domSelectLanguage = this._renderSelectLanguage();
    } else {
      domTagSelect = this._renderTagSelect();
    }
    return (
      <div>
        {domSelectLanguage}
        {domTagSelect}
      </div>
    );
  },
};
