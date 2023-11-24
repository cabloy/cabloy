export default {
  props: {
    dict: {},
    leafOnly: {},
    disabledCodes: {},
    selectedCodes: {},
    checkbox: {
      default: true,
    },
    checkOnLabel: {
      default: false,
    },
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
    async init(selectedCodes) {
      // root
      const root = {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: false,
          checkbox: this.checkbox,
          checkOnLabel: true,
        },
      };
      // load
      const tree = this.getInstance();
      await tree.load(root);
      // checkNodes
      if (selectedCodes && selectedCodes.length > 0) {
        for (const code of selectedCodes) {
          await this.selectDictItem(code);
        }
      }
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
    _createNodeChildren(children, nodeParent) {
      if (!children) return [];
      const nodes = children.map(item => {
        const isCatalog = !!item.children;
        const checkbox = !this.leafOnly || !isCatalog;
        const checkboxShow = this.checkbox && checkbox;
        const folder = !checkbox && isCatalog;
        let nodeId = item.code;
        if (nodeParent) {
          nodeId = `${nodeParent.id}_${nodeId}`;
        }
        const disabled = this.disabledCodes && this.disabledCodes.indexOf(this._getCodeFromNodeId(nodeId)) > -1;
        const node = {
          id: nodeId,
          attrs: {
            label: item.titleLocale || item.title,
            toggle: isCatalog,
            loadChildren: isCatalog,
            checkbox: checkboxShow,
            checkOnLabel: this.checkOnLabel,
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
    _getCodeFromNodeId(nodeId) {
      return String(nodeId).replace(/_/g, '/');
    },
    async onLoadChildren(node) {
      if (node.root) {
        return this._createNodeChildren(this.dict._dictItems);
      }
      // children
      return this._createNodeChildren(node.data.children, node);
    },
    onNodeClick(node) {
      this.$emit('dictItemClick', {
        ...node,
        id: this._getCodeFromNodeId(node.id),
      });
    },
    onPerformClearSelected() {
      this.$emit('dictItemClick', null);
    },
    async selectDictItem(code) {
      const tree = this.getInstance();
      const codes = String(code).split('/');
      let nodeParent = tree.treeviewRoot;
      for (let index = 0; index < codes.length; index++) {
        // force load children
        await tree._loadChildren(nodeParent);
        // find
        nodeParent = nodeParent.children.find(item => {
          const nodeId = this._getCodeFromNodeId(item.id);
          return nodeId === codes.slice(0, index + 1).join('/');
        });
        if (!nodeParent) break;
      }
      if (nodeParent) {
        await tree.checkNodes([nodeParent.id], false, true);
        this.$nextTick(() => {
          const $el = tree.getElementByNode(nodeParent);
          if ($el.length > 0) {
            $el[0].scrollIntoView({
              block: 'center',
              behavior: 'smooth',
            });
          }
        });
      }
    },
    _renderClearSelected() {
      if (!this.selectedCodes || this.selectedCodes.length === 0) return null;
      return <eb-button propsOnPerform={this.onPerformClearSelected}>{this.$text('Clear Selected')}</eb-button>;
    },
    _renderDictTree() {
      return (
        <eb-treeview
          ref="tree"
          auto={false}
          propsOnLoadChildren={this.onLoadChildren}
          onNodeClick={this.onNodeClick}
        ></eb-treeview>
      );
    },
  },
  render() {
    const domClearSelected = this._renderClearSelected();
    const domDictTree = this._renderDictTree();
    return (
      <div>
        {domClearSelected}
        {domDictTree}
      </div>
    );
  },
};

// _createNodeRoot(children) {
//   const checkbox = !this.leafOnly;
//   return [
//     {
//       id: 0,
//       attrs: {
//         label: this.$text('Root'),
//         toggle: true,
//         loadChildren: true,
//         checkbox,
//         checkOnLabel: checkbox,
//         selectable: checkbox,
//         itemToggle: !checkbox,
//         disabled: false,
//       },
//       data: {
//         id: 0,
//         categoryCatalog: 1,
//         children,
//       },
//     },
//   ];
// },
