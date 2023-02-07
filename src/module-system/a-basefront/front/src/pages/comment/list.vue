<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('Comment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link
          v-if="!user.anonymous"
          iconF7="::add"
          :eb-href="`/a/basefront/comment/item?atomId=${atomId}&commentId=0&replyId=0`"
        ></eb-link>
        <eb-link :iconF7="order === 'desc' ? '::arrow-down' : '::arrow-up'" :onPerform="onPerformSort"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <div></div>
        <eb-link v-if="atom" :onPerform="onPerformViewAtom"
          ><span class="eb-text-overflow-ellipsis">{{ atom.atomName }}</span></eb-link
        >
      </f7-subnavbar>
    </eb-navbar>
    <template v-if="moduleMarkdownRender && atom">
      <f7-card class="comment" v-for="item of items" :key="item.id">
        <f7-card-header>
          <div class="title">
            <img class="avatar avatar32" :src="getItemMedia(item)" />
            <div class="name">{{ item.userName }}</div>
            <div class="date">#{{ item.sorting }} · {{ $meta.util.formatDateTimeRelative(item.createdAt) }}</div>
          </div>
          <div class="actions">
            <eb-link
              v-if="item.userId === user.id"
              class="action"
              iconF7="::edit"
              iconSize="18"
              :eb-href="`/a/basefront/comment/item?atomId=${atomId}&commentId=${item.id}&replyId=0`"
            ></eb-link>
            <eb-link
              v-if="item.userId === user.id"
              class="action"
              iconF7="::delete-forever"
              iconSize="18"
              :context="item"
              :onPerform="onPerformDelete"
            ></eb-link>
            <eb-link
              class="action"
              :iconF7="item.heart ? '::heart' : ':outline:heart-outline'"
              iconSize="18"
              :iconBadge="item.heartCount"
              badgeColor="orange"
              :context="item"
              :onPerform="onPerformHeart"
            ></eb-link>
            <eb-link
              v-if="!user.anonymous"
              class="action"
              iconF7="::reply"
              iconSize="18"
              :eb-href="`/a/basefront/comment/item?atomId=${atomId}&commentId=0&replyId=${item.id}`"
            ></eb-link>
          </div>
        </f7-card-header>
        <f7-card-content padding>
          <eb-markdown-render :host="markdownHost" :html="item.html"></eb-markdown-render>
        </f7-card-content>
      </f7-card>
    </template>
    <eb-load-more
      :class="showSingle ? 'display-none' : ''"
      ref="loadMore"
      :onLoadClear="onLoadClear"
      :onLoadMore="onLoadMore"
      :autoInit="true"
    ></eb-load-more>
    <eb-button v-if="showSingle" :onPerform="onPerformShowAllComments">{{ $text('ShowAllComments') }}</eb-button>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebAtomActions, ebPageContext],
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      commentId: parseInt(this.$f7route.query.commentId || 0),
      order: 'desc',
      items: [],
      moduleMarkdownRender: null,
      single: true,
      atom: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
    showSingle() {
      return this.commentId > 0 && this.single;
    },
    markdownHost() {
      return {
        atomId: this.atom.atomId,
        atom: this.atom,
      };
    },
  },
  created() {
    this.$meta.module.use('a-markdownrender', module => {
      this.moduleMarkdownRender = module;
    });
    this._loadAtom();
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
      // where
      const where = {};
      if (this.showSingle) {
        where.id = this.commentId;
      }
      // options
      const options = {
        where,
        orders: [['updatedAt', this.order]],
        page: { index },
      };
      // fetch
      return this.$api
        .post('/a/base/comment/list', {
          key: { atomId: this.atomId },
          options,
        })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    reload() {
      this.$refs.loadMore.reload();
    },
    async _loadAtom() {
      if (this.contextParams && this.contextParams.atom) {
        this.atom = this.contextParams.atom;
      } else {
        this.atom = await this.$api.post('/a/base/atom/read', {
          key: { atomId: this.atomId },
        });
      }
    },
    async onPerformViewAtom() {
      if (!this.atom) return;
      const _action = this.getAction({
        module: this.atom.module,
        atomClassName: this.atom.atomClassName,
        name: 'read',
      });
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.atom });
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        return this.$api
          .post('/a/base/comment/delete', {
            key: { atomId: this.atomId },
            data: { commentId: item.id },
          })
          .then(data => {
            this.$meta.eventHub.$emit('comment:action', data);
            return true;
          });
      });
    },
    onPerformHeart(event, item) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      //
      return this.$api
        .post('/a/base/comment/heart', {
          key: { atomId: this.atomId },
          data: { commentId: item.id, heart: item.heart ? 0 : 1 },
        })
        .then(data => {
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
        this.$api
          .post('/a/base/comment/item', {
            key: { atomId: this.atomId },
            data: { commentId },
          })
          .then(data => {
            Vue.set(this.items, index, data);
          });
      }
    },
    onPerformSort() {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
      this.reload();
    },
    getItemMedia(item) {
      return this.$meta.util.combineAvatarUrl(item.avatar, 32);
    },
    onPerformShowAllComments() {
      this.single = false;
      this.reload();
    },
  },
};
</script>
