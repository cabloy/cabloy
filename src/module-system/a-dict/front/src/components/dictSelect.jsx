export default {
  props: {
    dict: {},
    leafOnly: {},
    disabledCategoryIds: {},
    selectedCodes: {},
  },
  data() {
    return {};
  },
  mounted() {
    this.init(this.selectedCodes);
  },
  methods: {
    getInstance() {
      return this.$refs.tree;
    },
    async init(selectedCodes) {
      // root
      const root = {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: false,
          checkbox: true,
          checkOnLabel: true,
        },
      };
      // load
      const tree = this.getInstance();
      await tree.load(root);
      // checkNodes
      await tree.checkNodes(selectedCodes, true, true);
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
    _createNodeRoot(children) {
      const checkbox = !this.leafOnly;
      const disabled = this.disabledCategoryIds && this.disabledCategoryIds.indexOf(0) > -1;
      return [
        {
          id: 0,
          attrs: {
            label: this.$text('Root'),
            toggle: true,
            loadChildren: true,
            checkbox,
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
    _createNodeChildren(children, nodeParent) {
      if (!children) return [];
      const nodes = children.map(item => {
        const isCatalog = !!item.children;
        const checkbox = !this.leafOnly || !isCatalog;
        const folder = !checkbox && isCatalog;
        const disabled = false;
        let nodeId = item.code;
        if (nodeParent) {
          nodeId = `${nodeParent.id}/${nodeId}`;
        }
        const node = {
          id: nodeId,
          attrs: {
            label: item.titleLocale || item.title,
            toggle: isCatalog,
            loadChildren: isCatalog,
            checkbox,
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
      return nodes;
    },
    async onLoadChildren(node) {
      if (node.root) {
        const children = this.dict._dictItems;
        return this._createNodeChildren(children);
      }
      // children
      return this._createNodeChildren(node.data.children, node);
    },
    onNodeChange(node) {
      this.$emit('node:change', node);
      this.$emit('nodeChange', node);
    },
  },
  render() {
    return (
      <eb-treeview
        ref="tree"
        auto={false}
        propsOnLoadChildren={this.onLoadChildren}
        onNodeChange={this.onNodeChange}
      ></eb-treeview>
    );
  },
};
