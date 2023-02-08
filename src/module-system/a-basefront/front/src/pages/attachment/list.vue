<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Attachment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!!actionWrite" iconF7="::add" :onPerform="onPerformAdd"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item
        class="item"
        v-for="item of items"
        :key="item.id"
        :title="item.realName"
        link="#"
        :context="item"
        :onPerform="onItemClick"
        :swipeout="item.userId === user.id"
      >
        <div slot="media">
          <img class="avatar avatar32" :src="getItemMedia(item)" />
        </div>
        <div slot="root-start" class="header">
          <div class="userName">
            <span>{{ item.userName }}</span>
          </div>
          <div class="date">{{ $meta.util.formatDateTimeRelative(item.createdAt) }}</div>
        </div>
        <eb-context-menu v-if="!!actionWrite">
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformDelete">{{ $text('Delete') }}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      items: [],
      actionWrite: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
    this.checkActionWrite();
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
        where: {
          mode: 2,
          attachment: 1,
        },
        orders: [['createdAt', 'asc']],
        page: { index },
      };
      // fetch
      return this.$api
        .post('/a/file/file/list', {
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
    async checkActionWrite() {
      const data = await this.$api.post('/a/base/atom/checkRightAction', {
        key: { atomId: this.atomId },
        action: 3,
        // stage: 'draft', // support formal
        checkFlow: true,
      });
      if (data && data.atomClosed === 0) {
        this.actionWrite = data;
      }
    },
    onPerformAdd() {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 2,
              atomId: this.atomId,
              attachment: 1,
            },
            callback: code => {
              if (code === 200) {
                this.$meta.eventHub.$emit('attachment:action', { action: 'create', atomId: this.atomId });
                this.reload();
                resolve();
              }
              if (code === false) {
                reject(new Error(''));
              }
            },
          },
        });
      });
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        return this.$api
          .post('/a/file/file/delete', {
            fileId: item.id,
          })
          .then(() => {
            this.$meta.util.swipeoutClose(event.currentTarget);
            this.$meta.eventHub.$emit('attachment:action', { action: 'delete', atomId: this.atomId, fileId: item.id });
            this.deleteItem(item.id);
          });
      });
    },
    deleteItem(fileId) {
      const index = this.items.findIndex(item => item.id === fileId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    onItemClick(event, item) {
      if (this.$meta.config.base.jwt) {
        this.$api.post('/a/base/jwt/create').then(res => {
          this._openUrl(item, res.jwt);
        });
      } else {
        this._openUrl(item, null);
      }
    },
    _openUrl(item, jwt) {
      if (jwt) {
        window.open(this.$meta.util.combineQueries(item.downloadUrl, { 'eb-jwt': jwt }));
      } else {
        window.open(item.downloadUrl);
      }
    },
    getItemMedia(item) {
      return this.$meta.util.combineAvatarUrl(item.avatar, 32);
    },
  },
};
</script>
