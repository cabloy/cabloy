<template>
  <eb-page>
    <eb-navbar :title="$text('Menu Right Management')" eb-back-link="Back"></eb-navbar>
    <role-list ref="roleList" :roleIdStart="roleIdStart" @node:click="onNodeClick"></role-list>
  </eb-page>
</template>
<script>
import roleList from '../../components/role/list.vue';
export default {
  components: {
    roleList,
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
      this.$view.navigate(`/a/baseadmin/functionRight/edit?roleId=${node.id}&menu=1`);
    },
  },
};

</script>
