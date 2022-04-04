<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Resource Right Management')" eb-back-link="Back"></eb-navbar>
    <role-list ref="roleList" :roleIdStart="roleIdStart" @node:click="onNodeClick"></role-list>
  </eb-page>
</template>
<script>
// import roleList from '../../components/role/list.jsx';
export default {
  components: {
    // roleList,
  },
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
      this.$view.navigate(`/a/baseadmin/resourceRight/edit?roleId=${node.id}`);
    },
  },
};
</script>
