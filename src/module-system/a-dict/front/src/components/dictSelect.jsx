export default {
  props: {
    dict: {},
    leafOnly: {},
    disabledCategoryIds: {},
    selectedCodes: {},
  },
  data() {
    return {
      inited: false,
    };
  },
  mounted() {
    this.init(this.selectedCodes);
  },
  methods: {
    getInstance() {
      return this.$refs.tree;
    },
    async init(/* selectedCodes*/) {
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
      //   should not implement this feature for performance
      // await tree.checkNodes(selectedCodes, true, true);
      // inited
      this.inited = true;
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
    _createNodeChildren(children) {
      if (!children) return [];
      const nodes = children.map(item => {
        const isCatalog = !!item.children;
        const checkbox = !this.leafOnly || !isCatalog;
        const folder = !checkbox && isCatalog;
        const disabled = false;
        const nodeId = item.code;
        const node = {
          id: nodeId,
          attrs: {
            label: item.titleLocale || item.title,
            toggle: isCatalog,
            loadChildren: isCatalog,
            checkbox,
            checkOnLabel: false, // checkbox,
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
    _getCodeFromElementId(elementId) {
      const arr = elementId.split('-');
      arr.shift();
      return arr.join('/');
    },
    async onLoadChildren(node) {
      if (node.root) {
        const children = this.dict._dictItems;
        return this._createNodeChildren(children);
      }
      // children
      return this._createNodeChildren(node.data.children);
    },
    onNodeClick(node) {
      this.$emit('dictItemClick', {
        ...node,
        id: this._getCodeFromElementId(node.attrs.id),
      });
    },
    async selectDictItem(codeMatch) {
      const tree = this.getInstance();
      const codes = codeMatch.code.split('/');
      let nodeParent = tree.treeviewRoot;
      for (let index = 0; index < codes.length; index++) {
        // force load children
        await tree._loadChildren(nodeParent);
        // find
        nodeParent = nodeParent.children.find(item => {
          const nodeId = this._getCodeFromElementId(item.attrs.id);
          return nodeId === codes.slice(0, index + 1).join('/');
        });
        if (!nodeParent) break;
      }
      if (nodeParent) {
        await tree.checkNodes([nodeParent.id], false, true);
        this.$nextTick(() => {
          const $el = tree.getElementByNode(nodeParent);
          $el[0].scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
        });
      }
    },
  },
  render() {
    return (
      <eb-treeview
        ref="tree"
        auto={false}
        propsOnLoadChildren={this.onLoadChildren}
        onNodeClick={this.onNodeClick}
      ></eb-treeview>
    );
  },
};
