<template>
  <eb-search-page :title="$text('Select User')" @search="onSearch" @loadMore="onLoadMore" @disable="onDisable">
    <users ref="list" :onFetchUsers="onFetchUsers" :onSelect="onSelect"></users>
  </eb-search-page>
</template>
<script>
import Vue from 'vue';
import users from '../../components/user/select.vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    users,
  },
  computed: {
    onFetchUsers() {
      return this.contextParams.onFetchUsers;
    },
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
    onSelect(event, item) {
      this.contextCallback(200, item);
      this.$f7router.back();
    },
  },
};
</script>
