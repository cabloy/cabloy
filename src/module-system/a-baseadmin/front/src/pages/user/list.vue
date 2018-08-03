<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('User Management')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" eb-target="_self" eb-href="user/search"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <users ref="users"></users>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import users from '../../components/user/list.vue';
export default {
  components: {
    users,
  },
  data() {
    return {};
  },
  mounted() {
    this.$refs.users.reload(true);
  },
  methods: {
    onRefresh(event, done) { // eslint-disable-line
      done();
      this.$refs.users.reload();
    },
    onInfinite() {
      this.$refs.users.loadMore();
    },
  },
};

</script>
