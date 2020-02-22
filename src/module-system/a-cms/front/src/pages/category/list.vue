<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back"></eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren" @node:click="onNodeClick">
      <div class="category-node" slot="root-end" slot-scope="{node}">
        <f7-link class="category-action" @click.stop="onNodeClickAdd(node)">{{$text('Add')}}</f7-link>
        <f7-link class="category-action" v-if="node.id>0" @click.stop="onNodeClickMove(node)">{{$text('Move')}}</f7-link>
        <f7-link class="category-action" v-if="node.id>0" @click.stop="onNodeClickDelete(node)">{{$text('Delete')}}</f7-link>
      </div>
    </eb-treeview>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      language: this.$f7route.query.language,
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        }
      },
    };
  },
  computed: {
    title() {
      const _title = this.$text('Categories');
      return `${_title}: ${this.language}`;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('a-cms:category:save', this.onCategorySave);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('a-cms:category:save', this.onCategorySave);
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onLoadChildren(node) {
      // root
      if (node.root) {
        return new Promise(resolve => {
          resolve([{
            id: 0,
            attrs: {
              link: '#',
              label: this.$text('Root'),
              toggle: true,
              loadChildren: true,
            },
            data: {
              id: 0,
              catalog: 1,
            },
          }]);
        });
      }
      // children
      return this.$api.post('category/children', {
          atomClass: this.atomClass,
          language: this.language,
          categoryId: node.id,
        })
        .then(data => {
          const list = data.list.map(item => {
            const node = {
              id: item.id,
              attrs: {
                link: '#',
                label: item.categoryName || `[${this.$text('New Category')}]`,
                toggle: item.catalog === 1,
                loadChildren: item.catalog === 1,
              },
              data: item,
            };
            return node;
          });
          return list;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          throw err;
        });
    },
    onNodeClick(e, node) {
      if (!node.id) return;
      const url = this.combineAtomClass(`/a/cms/category/edit?categoryId=${node.id}`);
      this.$view.navigate(url);
    },
    onNodeClickAdd(node) {
      const categoryId = node.data.id;
      this.$view.dialog.prompt(this.$text('Please specify the category name')).then(categoryName => {
        if (!categoryName) return;
        this.$api.post('category/add', {
          atomClass: this.atomClass,
          data: {
            categoryName,
            language: this.language,
            categoryIdParent: categoryId,
          },
        }).then(() => {
          this.reloadNode(node, {
            attrs: {
              toggle: true,
              loadChildren: true,
            },
          });
        });
      }).catch(() => {});
    },
    onNodeClickDelete(node) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('category/delete', { categoryId: node.data.id }).then(() => {
          this.reloadNode(node.parent);
        }).catch(err => this.$view.dialog.alert(err.message));
      });
    },
    onNodeClickMove(node) {
      const categoryId = node.data.id;
      const url = this.combineAtomClass('/a/cms/category/select');
      this.$view.navigate(url, {
        context: {
          params: {
            language: this.language,
            categoryIdDisable: categoryId,
          },
          callback: (code, data) => {
            if (code === 200) {
              const categoryIdParent = data.id;
              if (node.data.categoryIdParent !== categoryIdParent) {
                this.$api.post('category/move', { categoryId, categoryIdParent })
                  .then(() => {
                    this.reloadNode(this.findNode(node.data.categoryIdParent));
                    this.reloadNode(this.findNode(categoryIdParent), {
                      attrs: {
                        toggle: true,
                        loadChildren: true,
                      }
                    });
                  });
              }
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
    onCategorySave(data) {
      if (data.atomClass.module !== this.atomClass.module) return;
      const node = this.findNode(data.categoryIdParent);
      this.reloadNode(node);
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
