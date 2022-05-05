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
    getComponentInstance() {
      return this.$refs.categorySelect.getComponentInstance();
    },
    onNodeChange(node) {
      if (node.attrs.checked) {
        // eslint-disable-next-line
        this.filterContainer.form.category = node.id;
      }
    },
    onPerformSelectLanguage() {
      return this.filterContainer.onPerformSelectLanguage();
    },
    async onPerformClearCategory() {
      const tree = this.getComponentInstance().getInstance();
      await tree.uncheckNodes(this.filterContainer.form.category);
      // eslint-disable-next-line
      this.filterContainer.form.category = 0;
    },
    _renderSelectLanguage() {
      return <eb-button propsOnPerform={this.onPerformSelectLanguage}>{this.$text('Select Language')}</eb-button>;
    },
    _renderClearCategory() {
      return <eb-button propsOnPerform={this.onPerformClearCategory}>{this.$text('Clear Category')}</eb-button>;
    },
    _renderCategoryTree() {
      const selectedCategoryIds = [this.filterContainer.form.category];
      const options = {
        props: {
          atomClass: this.filterContainer.atomClass,
          language: this.filterContainer.form.language,
          categoryIdStart: 0,
          multiple: false,
          catalogOnly: false,
          leafOnly: true,
          selectedCategoryIds,
        },
        on: {
          nodeChange: this.onNodeChange,
        },
      };
      return (
        <eb-component ref="categorySelect" module="a-basefront" name="categorySelect" options={options}></eb-component>
      );
    },
  },
  render() {
    let domSelectLanguage;
    let domClearCategory;
    let domCategoryTree;
    if (this.filterContainer.atomClassBase.language && !this.filterContainer.form.language) {
      domSelectLanguage = this._renderSelectLanguage();
    } else {
      domClearCategory = this._renderClearCategory();
      domCategoryTree = this._renderCategoryTree();
    }
    return (
      <div>
        {domSelectLanguage}
        {domClearCategory}
        {domCategoryTree}
      </div>
    );
  },
};
