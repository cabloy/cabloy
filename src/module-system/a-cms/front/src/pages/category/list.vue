<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <eb-tree ref="tree" :options="treeOptions">
      <div class="category-node" slot-scope="{node}">
        <span @click.stop="onNodeClickEdit(node)">{{node.text}}</span>
        <span>
          <span @click.stop="onNodeClickAdd(node)">{{$text('Add')}}</span>
        <span v-if="node.data.id" @click.stop="onNodeClickMove(node)">{{$text('Move')}}</span>
        <span v-if="node.data.id" @click.stop="onNodeClickDelete(node)">{{$text('Delete')}}</span>
        </span>
      </div>
    </eb-tree>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      language: this.$f7route.query.language,
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node);
        },
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
    fetchChildren(node) {
      // root
      if (node.id === 'root') {
        return new Promise(resolve => {
          resolve([{
            id: '_root',
            text: 'Root',
            data: {
              id: 0,
              catalog: 1,
            },
            showChildren: true,
            isBatch: true,
          }]);
        });
      }
      // children
      return this.$api.post('category/children', { language: this.language, categoryId: node.data.id })
        .then(data => {
          const list = data.list.map(item => {
            const node = {
              id: item.id,
              text: item.categoryName || '[New Category]',
              data: item,
              showChildren: item.catalog === 1,
              isBatch: item.catalog === 1,
            };
            return node;
          });
          return list;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
        });
    },
    onNodeClickEdit(node) {
      if (!node.data.id) return;
      this.$view.navigate(`/a/cms/category/edit?categoryId=${node.data.id}`);
    },
    onNodeClickAdd(node) {
      const categoryId = node.data.id;
      this.$view.dialog.prompt(this.$text('Please specify the category name')).then(categoryName => {
        if (!categoryName) return;
        this.$api.post('category/add', {
          data: {
            categoryName,
            language: this.language,
            categoryIdParent: categoryId,
          },
        }).then(() => {
          this.reloadChildren(node);
        });
      });
    },
    onNodeClickDelete(node) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('category/delete', { categoryId: node.data.id }).then(() => {
          this.reloadChildren(node.parent);
        }).catch(err => this.$view.dialog.alert(err.message));
      });
    },
    onNodeClickMove(node) {
      const categoryId = node.data.id;
      this.$view.navigate('/a/cms/category/select', {
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
                    for (const id of [ node.data.categoryIdParent, categoryIdParent ]) {
                      const node = this.findNode(id);
                      this.reloadChildren(node && node[0]);
                    }
                  });
              }
            }
          },
        },
      });
    },
    reloadChildren(node) {
      if (!node) return;
      node.isBatch = true;
      node.collapse().empty().expand();
    },
    findNode(id) {
      return this.$refs.tree.find(node => node.data.id === id);
    },
    onCategorySave(data) {
      const node = this.findNode(data.categoryIdParent);
      this.reloadChildren(node && node[0]);
    },
  },
};

</script>
<style lang="less" scoped>
.category-node {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}

</style>
