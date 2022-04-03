<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Roles')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren"> </eb-treeview>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
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
    leafOnly() {
      return this.contextParams.leafOnly;
    },
    roleIdDisable() {
      return this.contextParams.roleIdDisable;
    },
    resourceAtomId() {
      return this.contextParams.resourceAtomId;
    },
    onFetchChildren() {
      return this.contextParams.onFetchChildren;
    },
    root() {
      return {
        attrs: {
          itemToggle: false,
          selectable: true,
          multiple: this.multiple,
          checkbox: true,
          checkOnLabel: true,
        },
      };
    },
  },
  methods: {
    async onLoadChildren(node) {
      try {
        // roleId
        const roleId = node.root ? this.roleIdStart : node.id;
        // promise
        let promise;
        if (this.onFetchChildren) {
          promise = this.onFetchChildren({ roleId });
        } else {
          promise = this.$api.post('role/children', {
            roleId,
            page: { size: 0 },
            key: { atomId: this.resourceAtomId },
          });
        }
        // then
        const data = await promise;
        let list = data.list.map(item => {
          const checkbox = !this.leafOnly || item.catalog === 0;
          const disabled = this.roleIdDisable && this.roleIdDisable === item.id;
          const node = {
            id: item.id,
            attrs: {
              label: item.roleName,
              toggle: item.catalog === 1,
              loadChildren: item.catalog === 1,
              checkbox,
              checkOnLabel: checkbox,
              selectable: checkbox,
              itemToggle: !checkbox,
              disabled,
            },
            data: item,
          };
          return node;
        });
        // filter
        if (this.catalogOnly) {
          list = list.filter(item => item.data.catalog === 1);
        }
        // ok
        return list;
      } catch (err) {
        this.$view.toast.show({ text: err.message });
        throw err;
      }
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
