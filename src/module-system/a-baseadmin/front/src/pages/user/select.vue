<template>
  <eb-search-page :title="$text('Select User')" @search="onSearch" @loadMore="onLoadMore" @disable="onDisable">
    <eb-button v-if="buttonClearUser" :onPerform="onPerformClearUser">{{ this.$text('Clear User') }}</eb-button>
    <users ref="list" :apiFetchUsers="apiFetchUsers" :onFetchUsers="onFetchUsers" :onSelect="onSelect"></users>
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
    apiFetchUsers() {
      return this.contextParams.apiFetchUsers;
    },
    onFetchUsers() {
      return this.contextParams.onFetchUsers;
    },
    buttonClearUser() {
      return this.contextParams.buttonClearUser;
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
    onPerformClearUser(event) {
      const user = {
        id: 0,
        userName: null,
        realName: null,
        avatar: null,
      };
      this.onSelect(event, user);
    },
  },
};
</script>
