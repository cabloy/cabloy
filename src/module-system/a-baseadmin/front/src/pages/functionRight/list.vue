<template>
  <eb-page>
    <eb-navbar :title="$text('Function Right Management')" eb-back-link="Back"></eb-navbar>
    <eb-role-list ref="roleList" :roleIdStart="roleIdStart" @node:click="onNodeClick"></eb-role-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart),
    };
  },
  computed: {
    tree() {
      return this.$refs.roleList.tree;
    },
  },
  methods: {
    onNodeClick(node) {
      this.$view.navigate(`/a/baseadmin/functionRight/edit?roleId=${node.id}&menu=0`);
    },
  },
};

</script>
