<template>
  <eb-search-page :title="$text('Search User')" @onSearch="onSearch" @onLoadMore="onLoadMore" @onDisable="onDisable">
    <users slot="list" ref="list"></users>
  </eb-search-page>
</template>
<script>
import users from '../../components/user/list.vue';
export default {
  components: {
    users,
  },
  methods: {
    onSearch(query) {
      this.$refs.list.onSearch(query);
    },
    onLoadMore() {
      this.$refs.list.loadMore();
    },
    onDisable() {
      this.$f7router.back();
    }
  }
};

</script>
