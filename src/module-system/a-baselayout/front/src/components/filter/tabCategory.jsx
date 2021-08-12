import Vue from 'vue';
const categorySelect = Vue.prototype.$meta.module.get('a-basefront').options.components.categorySelect;
export default {
  components: {
    categorySelect,
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
    onFormSubmit() {
      this.filterContainer.onFormSubmit();
    },
    onNodeChange(node) {
      // eslint-disable-next-line
      this.filterContainer.form.category = node.id;
    },
    _renderCategoryTree() {
      const selectedCategoryIds = [this.filterContainer.form.category];
      return (
        <categorySelect
          ref="tree"
          atomClass={this.filterContainer.atomClass}
          language="zh-cn"
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
    const domCategoryTree = this._renderCategoryTree();
    return domCategoryTree;
  },
};
