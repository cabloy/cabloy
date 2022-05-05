import Vue from 'vue';
// const tagSelect = Vue.prototype.$meta.module.get('a-basefront').options.components.tagSelect;
export default {
  components: {
    // tagSelect,
  },
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
    onChange() {
      const checked = this.$refs.tagSelect.checked();
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
      return (
        <tagSelect
          ref="tagSelect"
          atomClass={this.filterContainer.atomClass}
          language={this.filterContainer.form.language}
          multiple={false}
          searchQuery={this.searchQuery}
          selectedTags={selectedTags}
          showBlockCurrent={false}
          onChange={this.onChange}
        ></tagSelect>
      );
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
