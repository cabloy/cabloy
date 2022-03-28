export default {
  meta: {
    global: false,
  },
  props: {
    roleIdStart: {
      type: Number,
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
  computed: {
    tree() {
      return this.$refs.tree;
    },
  },
  methods: {
    async onLoadChildren(node) {
      try {
        let data;
        const roleId = node.root ? this.roleIdStart : node.id;
        if (roleId === 0) {
          data = await this.$api.post('role/childrenTop', { page: { size: 0 } });
        } else {
          data = await this.$api.post('role/children', { roleId, page: { size: 0 } });
        }
        const list = data.list.map(item => {
          const node = {
            id: item.id,
            attrs: {
              label: item.roleName || `[${this.$text('New Role')}]`,
              toggle: item.catalog === 1,
              loadChildren: item.catalog === 1,
            },
            data: item,
          };
          return node;
        });
        return list;
      } catch (err) {
        this.$view.toast.show({ text: err.message });
        throw err;
      }
    },
    onNodeClick(node) {
      this.$emit('node:click', node);
      this.$emit('nodeClick', node);
    },
  },
  render() {
    return (
      <eb-treeview
        ref="tree"
        root={this.root}
        propsOnLoadChildren={this.onLoadChildren}
        onNodeClick={this.onNodeClick}
      ></eb-treeview>
    );
  },
};
