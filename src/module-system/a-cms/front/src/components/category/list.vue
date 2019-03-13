<template>
  <eb-tree ref="tree" :options="treeOptions">
    <span slot-scope="{node}" @click.stop="onNodeClick(node)">{{node.text}}</span>
  </eb-tree>
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
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node);
        },
      },
    };
  },
  methods: {
    fetchChildren(node) {
      // root
      if (node.id === 'root' && this.categoryIdStart === undefined) {
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
      const categoryId = node.id === 'root' ? this.categoryIdStart : node.data.id;
      return this.$api.post('category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId,
      })
        .then(data => {
          let list = data.list.map(item => {
            const node = {
              id: item.id,
              text: item.categoryName || '[New Category]',
              data: item,
              showChildren: item.catalog === 1,
              isBatch: item.catalog === 1,
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
        });
    },
    onNodeClick(node) {
      this.$emit('node:click', node);
    },
  },
};

</script>
