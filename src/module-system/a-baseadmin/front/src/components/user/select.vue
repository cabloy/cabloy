<template>
  <div>
    <f7-list>
      <eb-list-item
        class="item"
        v-for="item of items"
        :key="item.id"
        :title="item.userName"
        link="#"
        :context="item"
        :onPerform="onPerformItem"
      >
        <div slot="media">
          <img class="avatar avatar32" :src="getItemMedia(item)" />
        </div>
        <div slot="after">
          <f7-badge v-if="item.realName && item.realName !== item.userName">{{ item.realName }}</f7-badge>
          <f7-badge v-if="item.mobile">{{ item.mobile }}</f7-badge>
        </div>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    apiFetchUsers: {
      type: String,
    },
    onFetchUsers: {
      type: Function,
    },
    onSelect: {
      type: Function,
    },
  },
  data() {
    return {
      items: [],
      query: '',
    };
  },
  methods: {
    onSearch(query) {
      this.query = query;
      this.reload(true);
      // if (!this.query) {
      //   this.items = [];
      // } else {
      //   this.reload(true);
      // }
    },
    reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    async onLoadMore({ index }) {
      // params
      const params = {
        query: this.query,
        page: { index },
      };
      // promise
      let promise;
      if (this.onFetchUsers) {
        promise = this.onFetchUsers(params);
      } else {
        const url = this.apiFetchUsers || '/a/baseadmin/user/select';
        promise = this.$api.post(url, params);
      }
      // then
      const data = await promise;
      this.items = this.items.concat(data.list);
      return data;
    },
    onPerformItem(event, item) {
      return this.onSelect(event, item);
    },
    getItemMedia(item) {
      return this.$meta.util.combineAvatarUrl(item.avatar, 32);
    },
  },
};
</script>
<style scoped></style>
