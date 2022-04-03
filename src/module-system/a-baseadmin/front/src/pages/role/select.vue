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
    roleIdsDisable() {
      return this.contextParams.roleIdsDisable;
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
    async _loadNodeRoles(node) {
      try {
        // roleId
        const roleId = node.root ? this.roleIdStart : node.id;
        // promise
        let promise;
        if (this.onFetchChildren) {
          promise = this.onFetchChildren({ roleId });
        } else {
          if (roleId === 0) {
            promise = this.$api.post('/a/baseadmin/role/childrenTop', { page: { size: 0 } });
          } else {
            promise = this.$api.post('/a/baseadmin/role/children', { roleId, page: { size: 0 } });
          }
        }
        // then
        const data = await promise;
        let list = data.list.map(item => {
          const checkbox = !this.leafOnly || item.catalog === 0;
          const disabled = this.roleIdsDisable && this.roleIdsDisable.indexOf(item.id) > -1;
          const node = {
            id: item.id,
            attrs: {
              label: item.atomNameLocale || item.roleName,
              toggle: item.catalog === 1,
              loadChildren: item.catalog === 1,
              iconF7: item._roleTypeCodeOptions.icon.f7,
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
    async onLoadChildren(node) {
      return await this._loadNodeRoles(node);
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
