<template>
  <eb-search-page :title="$text('Select User')" @search="onSearch" @loadMore="onLoadMore" @disable="onDisable">
    <users ref="list"></users>
  </eb-search-page>
</template>
<script>
import users from '../../components/user/select.vue';
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
    },
  },
};

</script>
