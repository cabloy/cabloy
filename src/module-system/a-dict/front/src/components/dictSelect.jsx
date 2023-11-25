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
    multiple: {},
    maxLevelAutoOpened: {
      default: 0,
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
          multiple: this.multiple,
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
    async _createNodeChildren(children, nodeParent, treeviewData) {
      if (!children) return [];
      // level
      const levelCurrent = nodeParent.__level || 0;
      const level = levelCurrent + 1;
      // nodes
      const nodes = [];
      for (const item of children) {
        const isCatalog = !!item.children;
        const checkbox = !this.leafOnly || !isCatalog;
        const checkboxShow = this.checkbox && checkbox;
        const folder = !checkbox && isCatalog;
        let nodeId = item.code;
        if (!nodeParent.root) {
          nodeId = `${nodeParent.id}_${nodeId}`;
        }
        const disabled = this.disabledCodes && this.disabledCodes.indexOf(this._getCodeFromNodeId(nodeId)) > -1;
        const node = {
          id: nodeId,
          attrs: {
            id: treeviewData._calcNodeAttrId(nodeParent, item),
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
          __level: level,
        };
        if (isCatalog && (level <= this.maxLevelAutoOpened || this.maxLevelAutoOpened === -1)) {
          await treeviewData._preloadChildren(node);
        }
        nodes.push(node);
      }
      return nodes;
    },
    _getCodeFromNodeId(nodeId) {
      return String(nodeId).replace(/_/g, '/');
    },
    async onLoadChildren(node, treeviewData) {
      if (node.root) {
        return await this._createNodeChildren(this.dict._dictItems, node, treeviewData);
      }
      // children
      return await this._createNodeChildren(node.data.children, node, treeviewData);
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
