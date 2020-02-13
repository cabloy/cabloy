<template>
  <eb-page ptr ptrMousewheel @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Attachment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="findAction('write')" iconMaterial="add" :onPerform="onPerformAdd"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.realName" link="#" :context="item" :onPerform="onItemClick" :swipeout="item.userId===user.id">
        <div slot="media">
          <img class="avatar avatar32" :src="$meta.util.combineImageUrl(item.avatar,32)">
        </div>
        <div slot="root-start" class="header">
          <div class="userName">
            <span>{{item.userName}}</span>
          </div>
          <div class="date">{{$meta.util.formatDateTimeRelative(item.createdAt)}}</div>
        </div>
        <eb-context-menu v-if="item.userId===user.id">
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      actions: null,
      items: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
    this.fetchActions();
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
        orders: [
          ['createdAt', 'asc'],
        ],
        page: { index },
      };
      // fetch
      return this.$api.post('/a/file/file/list', {
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
    fetchActions() {
      this.$api.post('atom/actions', {
        key: { atomId: this.atomId },
      }).then(data => {
        this.actions = data;
      });
    },
    findAction(actionName) {
      if (!this.actions) return null;
      return this.actions.find(item => item.name === actionName);
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
            callback: (code, data) => {
              if (code === 200) {
                this.$meta.eventHub.$emit('attachment:action', { action: 'create', atomId: this.atomId });
                this.reload();
                resolve();
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('/a/file/file/delete', {
          key: { atomId: this.atomId },
          data: { fileId: item.id },
        }).then(() => {
          this.$meta.util.swipeoutClose(event.target);
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
      window.open(item.downloadUrl);
    },
  },
};

</script>
