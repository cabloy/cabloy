export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        },
      },
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    async _loadNodeCategories(node) {
      const levelCurrent = (node.data && node.data.__level) || 0;
      const level = levelCurrent + 1;
      let treeChildren;
      if (node.root) {
        treeChildren = this.layoutManager.base.treeData;
      } else {
        treeChildren = node.data.children;
      }
      const list = [];
      for (const item of treeChildren) {
        const node = {
          id: item.id,
          attrs: {
            // link: '#',
            label: item.categoryNameLocale,
            toggle: true,
            itemToggle: true,
            loadChildren: true,
          },
          data: {
            ...item,
            __level: level,
          },
        };
        if (
          level <= this.layoutManager.container.maxLevelAutoOpened ||
          this.layoutManager.container.maxLevelAutoOpened === -1
        ) {
          const children = await this.onLoadChildren(node);
          this.$refs.tree.childrenLoaded(node, children);
          node.attrs.loadChildren = false;
          node.attrs.opened = true;
        }
        list.push(node);
      }
      return list;
    },
    async _loadNodeResources(node) {
      const resources = this.layoutManager.base.resourcesArrayAll.filter(item => item.atomCategoryId === node.id);
      return resources.map(item => {
        const node = {
          id: item.atomId,
          attrs: {
            link: '#',
            label: item.atomNameLocale,
            toggle: false,
            loadChildren: false,
          },
          data: item,
        };
        return node;
      });
    },
    async onLoadChildren(node) {
      if (node.root || node.data.categoryCatalog === 1) {
        return await this._loadNodeCategories(node);
      }
      return await this._loadNodeResources(node);
    },
    onNodePerformClick(event, context, node) {
      return this.layoutManager.base_onPerformResource(event, node.data);
    },
    _renderTree() {
      if (!this.layoutManager.base_ready) return;
      return (
        <eb-treeview
          ref="tree"
          root={this.root}
          propsOnLoadChildren={this.onLoadChildren}
          propsOnNodePerform={this.onNodePerformClick}
        ></eb-treeview>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderTree()}
        <f7-block></f7-block>
      </div>
    );
  },
};
