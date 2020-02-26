<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Comment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!user.anonymous" iconMaterial="add" :eb-href="`comment/item?atomId=${atomId}&commentId=0&replyId=0`"></eb-link>
        <eb-link :iconMaterial="order==='desc'?'arrow_downward':'arrow_upward'" :onPerform="onPerformSort"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="moduleStyle">
      <f7-card class="comment" v-for="item of items" :key="item.id">
        <f7-card-header>
          <div class="title">
            <img class="avatar avatar32" :src="getItemMedia(item)">
            <div class="name">{{item.userName}}</div>
            <div class="date">#{{item.sorting}} · {{$meta.util.formatDateTimeRelative(item.createdAt)}}</div>
          </div>
          <div class="actions">
            <eb-link v-if="item.userId===user.id" class="action" iconMaterial="edit" :eb-href="`comment/item?atomId=${atomId}&commentId=${item.id}&replyId=0`"></eb-link>
            <eb-link v-if="item.userId===user.id" class="action" iconMaterial="delete_forever" :context="item" :onPerform="onPerformDelete"></eb-link>
            <eb-link class="action" :iconMaterial="item.heart?'favorite':'favorite_border'" :context="item" :onPerform="onPerformHeart">{{item.heartCount}}</eb-link>
            <eb-link v-if="!user.anonymous" class="action" iconMaterial="reply" :eb-href="`comment/item?atomId=${atomId}&commentId=0&replyId=${item.id}`"></eb-link>
          </div>
        </f7-card-header>
        <f7-card-content padding class="markdown-body" v-html="item.html"></f7-card-content>
      </f7-card>
    </template>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      order: 'desc',
      items: [],
      moduleStyle: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
    this.$meta.module.use(this.$meta.config.markdown.style.module, module => {
      this.moduleStyle = module;
    });
  },
  mounted() {
    this.$meta.eventHub.$on('comment:action', this.onCommentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('comment:action', this.onCommentChanged);
  },
  methods: {
    onRefresh(done) {
      done();
      this.reload();
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
          ['updatedAt', this.order],
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
    reload() {
      this.$refs.loadMore.reload();
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('comment/delete', {
          key: { atomId: this.atomId },
          data: { commentId: item.id },
        }).then(data => {
          this.$meta.eventHub.$emit('comment:action', data);
          return true;
        });
      });
    },
    onPerformHeart(event, item) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      //
      return this.$api.post('comment/heart', {
        key: { atomId: this.atomId },
        data: { commentId: item.id, heart: item.heart ? 0 : 1 },
      }).then(data => {
        this.$meta.eventHub.$emit('comment:action', data);
      });
    },
    onCommentChanged(data) {
      const action = data.action;
      const atomId = data.atomId;
      const commentId = data.commentId;
      // check
      if (atomId !== this.atomId) return;
      // create
      if (action === 'create') {
        this.reload();
        return;
      }
      // delete
      const index = this.items.findIndex(item => item.id === commentId);
      if (action === 'delete') {
        if (index !== -1) {
          this.items.splice(index, 1);
        }
        return;
      }
      // others
      if (index !== -1) {
        this.$api.post('comment/item', {
          key: { atomId: this.atomId },
          data: { commentId },
        }).then(data => {
          Vue.set(this.items, index, data);
        });
      }
    },
    onPerformSort() {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
      this.reload();
    },
    getItemMedia(item) {
      const media = item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 32);
    },
  },
};

</script>
