<template>
  <eb-search-page :title="$text('Search Menu')" @search="onSearch" @loadMore="onLoadMore" @disable="onDisable">
    <menus ref="list" mode="search"></menus>
  </eb-search-page>
</template>
<script>
import menus from '../../components/menu/list.vue';
export default {
  components: {
    menus,
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
