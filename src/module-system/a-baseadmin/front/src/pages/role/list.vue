<template>
  <eb-page>
    <eb-navbar :title="$text('Role Management')" eb-back-link="Back"></eb-navbar>
    <eb-role-list ref="roleList" :roleIdStart="roleIdStart" @node:click="onNodeClick"></eb-role-list>
    <f7-fab v-if="roleDirty" color="pink">
      <f7-icon material="add"></f7-icon>
      <f7-icon material="close"></f7-icon>
      <f7-fab-buttons>
        <eb-fab-button color="orange" :onPerform="onPerformBuild">Build</eb-fab-button>
      </f7-fab-buttons>
    </f7-fab>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart),
      roleDirty: false,
    };
  },
  computed: {
    tree() {
      return this.$refs.roleList.tree;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:add', this.onRoleAdd);
    this.$meta.eventHub.$on('role:move', this.onRoleMove);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$on('role:dirty', this.onRoleDirty);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:add', this.onRoleAdd);
    this.$meta.eventHub.$off('role:move', this.onRoleMove);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$off('role:dirty', this.onRoleDirty);
  },
  created() {
    this.checkRoleDirty();
  },
  methods: {
    onNodeClick(node) {
      this.$view.navigate(`/a/baseadmin/role/edit?roleId=${node.id}`);
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
    onRoleAdd(data) {
      const node = this.tree.find(node => node.id === data.roleIdParent);
      this.reloadChildren(node && node[0]);
    },
    onRoleMove(data) {
      for (const roleIdParent of [ 'roleIdFrom', 'roleIdTo' ]) {
        const node = this.tree.find(node => node.id === data[roleIdParent]);
        this.reloadChildren(node && node[0]);
      }
    },
    onRoleDelete(data) {
      const node = this.tree.find(node => node.id === data.roleId);
      if (node) node.remove();
    },
    onRoleDirty(data) {
      this.roleDirty = data.dirty;
    },
    onPerformBuild() {
      return this.$api.post('role/build').then(() => {
        this.roleDirty = false;
        return true;
      });
    },
    checkRoleDirty() {
      this.$api.post('role/dirty').then(dirty => {
        this.roleDirty = dirty;
      });
    },
  },
};

</script>
