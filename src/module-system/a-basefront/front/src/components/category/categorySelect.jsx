export default {
  props: {
    atomClass: {},
    language: {},
    categoryIdStart: {},
    multiple: {},
    catalogOnly: {},
    leafOnly: {},
    disabledCategoryIds: {},
    selectedCategoryIds: {},
    // setLocale: {},
    checkbox: {
      default: true,
    },
    categoryHidden: {
      default: undefined,
    },
  },
  data() {
    return {};
  },
  watch: {
    atomClass() {
      this.reload();
    },
    language() {
      this.reload();
    },
  },
  mounted() {
    this.init(this.selectedCategoryIds);
  },
  methods: {
    getInstance() {
      return this.$refs.tree;
    },
    async init(selectedCategoryIds) {
      // root
      const root = {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: this.multiple,
          checkbox: this.checkbox,
          checkOnLabel: true,
        },
      };
      // load
      const tree = this.getInstance();
      await tree.load(root);
      // checkNodes
      await tree.checkNodes(selectedCategoryIds, true, true);
    },
    async reload() {
      await this.init(null);
    },
    _findChildren(children, categoryId) {
      for (const item of children) {
        if (item.id === categoryId) return item.children;
        if (item.children) {
          const res = this._findChildren(item.children, categoryId);
          if (res) return res;
        }
      }
      return null;
    },
    _renderNodeLabelStart(node) {
      // root
      if (node.id === 0) return this.$text('All');
      // others
      const item = node.data;
      return item.categoryNameLocale || item.categoryName || `[${this.$text('New Category')}]`;
    },
    _createNodeRoot(children) {
      const checkbox = !this.leafOnly;
      const checkboxShow = this.checkbox && checkbox;
      const disabled = this.disabledCategoryIds && this.disabledCategoryIds.indexOf(0) > -1;
      return [
        {
          id: 0,
          attrs: {
            // label: this.$text('All'),
            toggle: true,
            loadChildren: true,
            checkbox: checkboxShow,
            checkOnLabel: checkbox,
            selectable: checkbox,
            itemToggle: !checkbox,
            disabled,
          },
          data: {
            id: 0,
            categoryCatalog: 1,
            children,
          },
        },
      ];
    },
    _createNodeChildren(children) {
      if (!children) return [];
      let nodes = children.map(item => {
        const checkbox = !this.leafOnly || item.categoryCatalog === 0;
        const checkboxShow = this.checkbox && checkbox;
        const folder = !checkbox && item.categoryCatalog === 1;
        const disabled = this.disabledCategoryIds && this.disabledCategoryIds.indexOf(item.id) > -1;
        const node = {
          id: item.id,
          attrs: {
            // label: item.categoryNameLocale || item.categoryName || `[${this.$text('New Category')}]`,
            toggle: item.categoryCatalog === 1,
            loadChildren: item.categoryCatalog === 1,
            checkbox: checkboxShow,
            checkOnLabel: checkbox,
            selectable: checkbox,
            itemToggle: !checkbox,
            folder,
            disabled,
          },
          data: item,
        };
        return node;
      });
      nodes = nodes.filter(item => {
        return !this.catalogOnly || item.data.categoryCatalog === 1;
      });
      return nodes;
    },
    async onLoadChildren(node) {
      if (node.root) {
        const treeChildren = await this.$store.dispatch('a/base/getCategoryTree', {
          atomClass: this.atomClass,
          language: this.language,
          categoryHidden: this.categoryHidden,
        });
        // append root node
        if (this.categoryIdStart === undefined) {
          return this._createNodeRoot(treeChildren);
        }
        // children
        let children;
        if (this.categoryIdStart === 0) {
          children = treeChildren;
        } else {
          children = this._findChildren(treeChildren, this.categoryIdStart);
        }
        return this._createNodeChildren(children);
      }
      // children
      return this._createNodeChildren(node.data.children);
    },
    onNodeChange(node) {
      this.$emit('node:change', node);
      this.$emit('nodeChange', node);
    },
    onNodeSelect(node) {
      this.$emit('node:select', node);
      this.$emit('nodeSelect', node);
    },
    onNodeClick(node, event) {
      this.$emit('node:click', node, event);
      this.$emit('nodeClick', node, event);
    },
  },
  render() {
    return (
      <eb-treeview
        ref="tree"
        auto={false}
        propsOnLoadChildren={this.onLoadChildren}
        onNodeChange={this.onNodeChange}
        onNodeSelect={this.onNodeSelect}
        onNodeClick={this.onNodeClick}
        {...{
          scopedSlots: {
            'label-start': ({ node }) => {
              return this._renderNodeLabelStart(node);
            },
          },
        }}
      ></eb-treeview>
    );
  },
};
