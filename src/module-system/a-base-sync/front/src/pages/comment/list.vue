<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('Comment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="insert_comment" :eb-href="`comment/item?atomId=${atomId}&commentId=0&replyId=0`"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-card class="comment" v-for="item of items" :key="item.id">
      <f7-card-header>
        <div class="title">
          <img class="avatar avatar32" :src="$meta.util.combineImageUrl(item.avatar,32)">
          <div class="name">{{item.userName}}</div>
          <div class="date">#{{item.sorting}} · {{$meta.util.formatDateTimeRelative(item.createdAt)}}</div>
        </div>
        <div class="actions">
          <eb-link class="action" iconMaterial="edit" :eb-href="`comment/item?atomId=${atomId}&commentId=${item.id}&replyId=0`"></eb-link>
          <eb-link class="action" iconMaterial="delete_forever" :context="item" :onPerform="onPerformDelete"></eb-link>
          <eb-link class="action" iconMaterial="reply"></eb-link>
        </div>
      </f7-card-header>
      <f7-card-content padding class="markdown-body" v-html="item.html"></f7-card-content>
    </f7-card>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      order: 'desc',
      items: [],
    };
  },
  methods: {
    onRefresh(event, done) { // eslint-disable-line
      done();
      this.$refs.loadMore.reload();
    },
    onInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore({ index }) {
      // options
      const options = {
        orders: [
          [ 'sorting', this.order ],
        ],
        page: { index },
      };
      // fetch
      return this.$api.post('comment/list', {
        key: { atomId: this.atomId },
        options,
      }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('comment/delete', {
          key: { atomId: this.atomId },
          data: { commentId: item.id },
        }).then(action => {
          this.$meta.eventHub.$emit('comment:action', { action });
          return true;
        });
      });
    },
  },
};

</script>
