<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Roles')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!immediate" iconF7="::done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-button v-if="buttonClearRole" :onPerform="onPerformClearRole">{{ this.$text('Clear Role') }}</eb-button>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren" @nodeChange="onNodeChange">
      <template slot="label-start" slot-scope="{ node }">
        {{ node.data.atomNameLocale || node.data.roleName }}
      </template>
    </eb-treeview>
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
      return this.contextParams.roleIdStart || 0;
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
    buttonClearRole() {
      return this.contextParams.buttonClearRole;
    },
    immediate() {
      return this.contextParams.immediate;
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
    maxLevelAutoOpened() {
      return this.$meta.config.modules['a-baseadmin'].role.select.maxLevelAutoOpened;
    },
  },
  methods: {
    async _loadNodeRoles(node, treeviewData) {
      try {
        //
        const levelCurrent = node.__level || 0;
        const level = levelCurrent + 1;
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
        let list = [];
        for (const item of data.list) {
          const checkbox = !this.leafOnly || item.catalog === 0;
          const disabled = this.roleIdsDisable && this.roleIdsDisable.indexOf(item.id) > -1;
          const nodeChild = {
            id: item.id,
            attrs: {
              id: treeviewData._calcNodeAttrId(node, item),
              // label: item.atomNameLocale || item.roleName,
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
            __level: level,
          };
          if (item.catalog === 1 && (level <= this.maxLevelAutoOpened || this.maxLevelAutoOpened === -1)) {
            await treeviewData._preloadChildren(nodeChild);
          }
          list.push(nodeChild);
        }
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
    async onLoadChildren(node, treeviewData) {
      return await this._loadNodeRoles(node, treeviewData);
    },
    onNodeChange(/* node*/) {
      if (!this.immediate) return;
      this.onPerformDone(null);
    },
    onPerformDone(event) {
      const checked = this.$refs.tree.checked();
      if (!checked || checked.length === 0) return;
      // res
      let res;
      if (Array.isArray(checked)) {
        res = checked.map(item => item.data);
      } else {
        res = checked.data;
      }
      // onSelect
      this.onSelect(event, res);
    },
    onSelect(event, res) {
      this.contextCallback(200, res);
      if (!this.immediate) {
        this.$f7router.back();
      }
    },
    onPerformClearRole(event) {
      // uncheck
      if (this.immediate) {
        let checked = this.$refs.tree.checked();
        if (checked) {
          if (!Array.isArray(checked)) checked = [checked];
          const nodeIds = checked.map(item => item.id);
          this.$refs.tree.uncheckNodes(nodeIds, false);
        }
      }
      // select 0
      const role = {
        id: 0,
        atomId: 0,
        itemId: 0,
        atomName: null,
        atomNameLocale: null,
        roleName: null,
      };
      this.onSelect(event, role);
    },
  },
};
</script>
