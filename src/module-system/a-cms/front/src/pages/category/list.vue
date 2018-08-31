<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <tree ref="tree" :options="treeOptions">
      <div class="category-node" slot-scope="{node}">
        <span @click.stop="onNodeClickEdit(node)">{{node.text}}</span>
        <span>
          <span @click.stop="onNodeClickAdd(node)">{{$text('Add')}}</span>
        <span v-if="node.id!=='_root'" @click.stop="onNodeClickDelete(node)">{{$text('Delete')}}</span>
        </span>
      </div>
    </tree>
  </eb-page>
</template>
<script>
import LiquorTree from '@zhennann/liquor-tree';
export default {
  components: {
    [LiquorTree.name]: LiquorTree,
  },
  data() {
    return {
      language: this.$f7route.query.language,
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node.id);
        },
      },
    };
  },
  computed: {
    title() {
      const _title = this.$text('Categories');
      return `${_title}: ${this.language}`;
    },
    tree() {
      return this.$refs.categoryList.tree;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
  },
  methods: {
    fetchChildren(categoryId) {
      console.log(categoryId);
      // root
      if (categoryId === 'root') {
        return new Promise(resolve => {
          resolve([{
            id: '_root',
            text: 'Root',
            data: null,
            showChildren: true,
            isBatch: true,
          }]);
        });
      }
      if (categoryId === '_root') categoryId = 0;
      // children
      return this.$api.post('category/children', { language: this.language, categoryId })
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
      if (node.id === 0) return;
      this.$view.navigate(`/a/cms/category/edit?categoryId=${node.id}`);
    },
    onNodeClickAdd(node) {
      const categoryId = node.id === '_root' ? 0 : node.id;
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
        return this.$api.post('category/delete', { categoryId: node.id }).then(() => {
          this.reloadChildren(node.parent);
        });
      });
    },
    reloadChildren(node) {
      if (!node) return;
      node.isBatch = true;
      node.collapse().empty().expand();
    },
    onRoleSave(data) {
      const node = this.tree.find(node => node.id === data.roleIdParent);
      this.reloadChildren(node && node[0]);
    },
    // onRoleAdd(data) {
    //   const node = this.tree.find(node => node.id === data.roleIdParent);
    //   this.reloadChildren(node && node[0]);
    // },
    // onRoleMove(data) {
    //   for (const roleIdParent of [ 'roleIdFrom', 'roleIdTo' ]) {
    //     const node = this.tree.find(node => node.id === data[roleIdParent]);
    //     this.reloadChildren(node && node[0]);
    //   }
    // },
    // onRoleDelete(data) {
    //   const node = this.tree.find(node => node.id === data.roleId);
    //   if (node) node.remove();
    // },
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
