<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.userName" :eb-href="`user/view?userId=${item.id}`" swipeout>
        <div slot="after">
          <f7-badge v-if="item.realName && item.realName!==item.userName">{{item.realName}}</f7-badge>
          <f7-badge v-if="item.mobile">{{item.mobile}}</f7-badge>
          <f7-badge v-if="item.disabled===1">{{$text('Disabled')}}</f7-badge>
        </div>
        <eb-context-menu>
          <div slot="right">
            <div v-if="item.disabled===0" color="orange" :context="item" :onPerform="onPerformDisable">{{$text('Disable')}}</div>
            <div v-if="item.disabled===1" color="orange" :context="item" :onPerform="onPerformEnable">{{$text('Enable')}}</div>
            <div color="yellow" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    roleId: {
      type: Number,
    },
  },
  data() {
    return {
      items: [],
      query: '',
    };
  },
  mounted() {
    this.$meta.eventHub.$on('user:disable', this.onUserDisable);
    this.$meta.eventHub.$on('user:delete', this.onUserDelete);
    this.$meta.eventHub.$on('user:addRole', this.onUserAddRole);
    this.$meta.eventHub.$on('user:removeRole', this.onUserRemoveRole);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('user:disable', this.onUserDisable);
    this.$meta.eventHub.$off('user:delete', this.onUserDelete);
    this.$meta.eventHub.$off('user:addRole', this.onUserAddRole);
    this.$meta.eventHub.$off('user:removeRole', this.onUserRemoveRole);
  },
  methods: {
    onSearch(query) {
      this.query = query;
      if (!this.query) {
        this.items = [];
      } else {
        this.reload(true);
      }
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
    onLoadMore({ index }) {
      const params = {
        roleId: this.roleId,
        query: this.query,
        page: { index },
      };
      if (!this.roleId) params.anonymous = 0;
      return this.$api.post('user/list', params)
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    onPerformDisable(event, item) {
      return this.disableUser(event, item, 1);
    },
    onPerformEnable(event, item) {
      return this.disableUser(event, item, 0);
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('user/delete', {
          userId: item.id,
        })
          .then(() => {
            this.$meta.eventHub.$emit('user:delete', { userId: item.id });
            this.$meta.util.swipeoutDelete(event.target);
            return true;
          });
      });
    },
    disableUser(event, item, disabled) {
      return this.$api.post('user/disable', {
        userId: item.id,
        disabled,
      })
        .then(() => {
          this.$meta.eventHub.$emit('user:disable', { userId: item.id, disabled });
          this.$meta.util.swipeoutClose(event.target);
          return true;
        });
    },
    onUserDisable(data) {
      const item = this.items.find(item => item.id === data.userId);
      if (item) item.disabled = data.disabled;
    },
    onUserDelete(data) {
      const index = this.items.findIndex(item => item.id === data.userId);
      if (index > -1) this.items.splice(index, 1);
    },
    onUserAddRole(data) {
      if (data.roleId === this.roleId) this.reload();
    },
    onUserRemoveRole(data) {
      if (data.roleId === this.roleId) {
        const index = this.items.findIndex(item => item.id === data.userId);
        if (index > -1) this.items.splice(index, 1);
      }
    },
  },
};

</script>
<style scoped>


</style>
