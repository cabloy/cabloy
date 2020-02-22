<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Roles')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren">
    </eb-treeview>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    roleIdStart() {
      return this.contextParams.roleIdStart;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    roleIdDisable() {
      return this.contextParams.roleIdDisable;
    },
    root() {
      return {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: this.multiple,
          checkbox: true,
          checkOnLabel: true,
        }
      };
    }
  },
  methods: {
    onLoadChildren(node) {
      const roleId = node.root ? this.roleIdStart : node.id;
      return this.$api.post('role/children', { roleId, page: { size: 0 } })
        .then(data => {
          let list = data.list.map(item => {
            const node = {
              id: item.id,
              attrs: {
                link: '#',
                label: item.roleName,
                toggle: item.catalog === 1,
                loadChildren: item.catalog === 1,
              },
              data: item,
            };
            return node;
          });
          if (this.catalogOnly) {
            list = list.filter(item => item.data.catalog === 1 && (!this.roleIdDisable || this.roleIdDisable !== item.id));
          }
          return list;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          throw err;
        });
    },
    onDone() {
      const checked = this.$refs.tree.checked();
      if (!checked || checked.length === 0) return;

      this.contextCallback(200, checked);
      this.$f7router.back();
    },
  },
};

</script>
