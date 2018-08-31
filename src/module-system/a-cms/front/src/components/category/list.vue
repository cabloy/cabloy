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
    language: {
      type: String,
    },
  },
  data() {
    return {
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node.id);
        },
      },
    };
  },
  computed: {
    tree() {
      return this.$refs.tree;
    },
  },
  methods: {
    fetchChildren(roleId) {
      if (roleId === 'root') roleId = this.roleIdStart;
      return this.$api.post('role/children', { roleId, page: { size: 0 } })
        .then(data => {
          const list = data.list.map(item => {
            const node = {
              id: item.id,
              text: item.roleName || '[New Role]',
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
    onNodeClick(node) {
      this.$emit('node:click', node);
    },
  },
};

</script>
