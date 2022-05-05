import Vue from 'vue';
// const categorySelect = Vue.prototype.$meta.module.get('a-basefront').options.components.categorySelect;
export default {
  components: {
    // categorySelect,
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
    return {};
  },
  methods: {
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
      const tree = this.$refs.tree.getInstance();
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
      return null;
      const selectedCategoryIds = [this.filterContainer.form.category];
      return (
        <categorySelect
          ref="tree"
          atomClass={this.filterContainer.atomClass}
          language={this.filterContainer.form.language}
          categoryIdStart={0}
          multiple={false}
          catalogOnly={false}
          leafOnly={true}
          selectedCategoryIds={selectedCategoryIds}
          onNodeChange={this.onNodeChange}
        ></categorySelect>
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
