<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Exports')" eb-back-link="Back"></eb-navbar>
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
        <div slot="after" v-if="item.id === recent">
          <f7-badge>{{ $text('Recent') }}</f7-badge>
        </div>
        <eb-context-menu v-if="item.userId === user.id">
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformRename">{{ $text('Rename') }}</div>
            <div color="red" :context="item" :onPerform="onPerformDelete">{{ $text('Delete') }}</div>
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
      recent: parseInt(this.$f7route.query.recent),
      items: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('export:action', this.onExportChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('export:action', this.onExportChanged);
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
          flag: 'atom-bulk-export',
        },
        orders: [['createdAt', 'desc']],
        page: { index },
      };
      // fetch
      return this.$api
        .post('/a/file/file/list', {
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
    async onPerformRename(event, item) {
      const realName = await this.$view.dialog.prompt(this.$text('Please Specify the Filename'));
      if (!realName) return;
      await this.$api.post('/a/file/file/update', {
        fileId: item.id,
        data: { realName },
      });
      this.$meta.eventHub.$emit('export:action', { action: 'rename', fileId: item.id, data: { realName } });
    },
    async onPerformDelete(event, item) {
      await this.$view.dialog.confirm();
      // delete
      await this.$api.post('/a/file/file/delete', {
        fileId: item.id,
      });
      this.$meta.util.swipeoutClose(event.currentTarget);
      this.$meta.eventHub.$emit('export:action', { action: 'delete', fileId: item.id });
    },
    deleteItem(fileId) {
      const index = this.items.findIndex(item => item.id === fileId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    renameItem(fileId, data) {
      const index = this.items.findIndex(_item => _item.id === fileId);
      if (index !== -1) {
        this.items[index].realName = data.realName;
      }
    },
    onExportChanged(data) {
      const { action, fileId } = data;
      // create
      if (action === 'create') {
        this.reload();
        return;
      }
      // delete
      if (action === 'delete') {
        this.deleteItem(fileId);
        return;
      }
      // rename
      if (action === 'rename') {
        this.renameItem(fileId, data.data);
        return;
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
