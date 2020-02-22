<template>
  <eb-treeview :root="root" :onLoadChildren="onLoadChildren" @node:click="onNodeClick">
  </eb-treeview>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    atomClass: {
      type: Object,
    },
    categoryIdStart: {
      type: Number,
    },
    language: {
      type: String,
    },
    catalogOnly: {
      type: Boolean,
    },
    categoryIdDisable: {
      type: Boolean,
    },
  },
  data() {
    return {
      root: {
        attrs: {
          itemToggle: false,
          selectable: true,
        }
      },
    };
  },
  methods: {
    onLoadChildren(node) {
      // root
      if (node.root && this.categoryIdStart === undefined) {
        return new Promise(resolve => {
          resolve([{
            id: 0,
            attrs: {
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
      const categoryId = node.root ? this.categoryIdStart : node.id;
      return this.$api.post('category/children', {
          atomClass: this.atomClass,
          language: this.language,
          categoryId,
        })
        .then(data => {
          let list = data.list.map(item => {
            const node = {
              id: item.id,
              attrs: {
                label: item.categoryName || `[${this.$text('New Category')}]`,
                toggle: item.catalog === 1,
                loadChildren: item.catalog === 1,
              },
              data: item,
            };
            return node;
          });
          list = list.filter(item => {
            return (!this.catalogOnly || item.data.catalog === 1) &&
              (!this.categoryIdDisable || this.categoryIdDisable !== item.id);
          });
          return list;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          throw err;
        });
    },
    onNodeClick(e, node) {
      this.$emit('node:click', node);
    },
  },
};

</script>
