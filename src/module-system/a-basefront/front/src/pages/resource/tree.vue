<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <eb-treeview v-if="ready" ref="tree" :root="root" :onLoadChildren="onLoadChildren" @node:click="onNodeClick">
    </eb-treeview>
  </eb-page>
</template>
<script>
export default {
  data() {
    const query = this.$f7route.query;
    let resourceType = query.resourceType;
    let home = false;
    if (!resourceType) {
      resourceType = 'a-base:menu';
      home = true;
    }
    return {
      ready: false,
      resourceType,
      home,
      treeData: null,
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        },
      },
    };
  },
  computed: {
    pageTitle() {
      if (this.home) {
        const inPanel = this.$view.inPanel();
        return inPanel ? this.$text('Menu') : this.$text('Home');
      }
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return null;
      return resourceTypes[this.resourceType].titleLocale;
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      await this.$store.dispatch('a/base/getResourceTypes');
      this.treeData = await this.$store.dispatch('a/base/getResourceTrees', { resourceType: this.resourceType });
      this.ready = true;
    },
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    async _loadNodeCategories(node) {
      let treeChildren;
      if (node.root) {
        treeChildren = this.treeData;
      } else {
        treeChildren = node.data.children;
      }
      return treeChildren.map(item => {
        const node = {
          id: item.id,
          attrs: {
            link: '#',
            label: item.categoryName,
            toggle: true,
            loadChildren: true,
          },
          data: item,
        };
        return node;
      });
    },
    async _loadNodeResources(node) {

    },
    async onLoadChildren(node) {
      if (node.root || node.data.categoryCatalog === 1) {
        return await this._loadNodeCategories(node);
      }
      return await this._loadNodeResources(node);

      // root
      if (node.root) {
        return [{
          id: 0,
          attrs: {
            link: '#',
            label: this.$text('Root'),
            toggle: true,
            loadChildren: true,
          },
          data: {
            id: 0,
            categoryCatalog: 1,
          },
        }];
      }
      // children
      const data = await this.$api.post('/a/base/category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: node.id,
      });
      const list = data.list.map(item => {
        const node = {
          id: item.id,
          attrs: {
            link: '#',
            label: item.categoryName || `[${this.$text('New Category')}]`,
            toggle: item.categoryCatalog === 1,
            loadChildren: item.categoryCatalog === 1,
          },
          data: item,
        };
        return node;
      });
      return list;
    },
    onNodeClick(e, node) {
      if (!node.id) return;
      const queries = this.combineAtomClassAndLanguage();
      queries.categoryId = node.id;
      const url = this.$meta.util.combineQueries('/a/baseadmin/category/edit', queries);
      this.$view.navigate(url);
    },
    async onPerformAdd(event, node) {
      const categoryId = node.data.id;
      const categoryName = await this.$view.dialog.prompt(this.$text('Please specify the category name'));
      if (!categoryName) return;
      await this.$api.post('/a/base/category/add', {
        atomClass: this.atomClass,
        data: {
          categoryName,
          language: this.language,
          categoryIdParent: categoryId,
        },
      });
      this.reloadNode(node, {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    async onPerformDelete(event, node) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/base/category/delete', {
        categoryId: node.data.id,
      });
      this.reloadNode(node.parent);
    },
    onPerformMove(event, node) {
      const categoryId = node.data.id;
      const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage());
      this.$view.navigate(url, {
        context: {
          params: {
            categoryIdDisable: categoryId,
          },
          callback: (code, data) => {
            if (code === 200) {
              if (!data) return;
              const categoryIdParent = data.id;
              if (node.data.categoryIdParent === categoryIdParent) return;
              this.$api.post('/a/base/category/move', { categoryId, categoryIdParent })
                .then(() => {
                  this.reloadNode(this.findNode(node.data.categoryIdParent));
                  this.reloadNode(this.findNode(categoryIdParent), {
                    attrs: {
                      toggle: true,
                      loadChildren: true,
                    },
                  });
                });
            }
          },
        },
      });
    },
    reloadNode(node, nodeNew) {
      if (!node) return;
      this.$refs.tree.reloadNode(node, nodeNew);
    },
    findNode(id) {
      return this.$refs.tree.find(null, node => node.id === id);
    },
  },
};

</script>
<style lang="less" scoped>
.category-node {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;

  .category-action+.category-action {
    margin-left: 4px;
  }
}

</style>
