<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.roleName" :eb-href="`role/edit?roleId=${item.roleId}`" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onRemove">{{$text('Remove')}}</div>
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
    user: {
      type: Object,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
  },
  methods: {
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
      return this.$api.post('user/roles', { userId: this.user.id, page: { index } })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.$api.post('user/addRole', { userId: this.user.id, roleId: data.id })
                .then(() => {
                  this.$meta.eventHub.$emit('user:addRole', { userId: this.user.id, roleId: data.id });
                  this.reload();
                  this.$view.toast.show({ text: this.$text('Operation succeeded') });
                });
            }
          },
        },
      });
    },
    onRemove(event, item) {
      return this.$view.dialog.confirm()
        .then(() => {
          return this.$api.post('user/removeRole', { id: item.id })
            .then(() => {
              this.onRoleDelete({ roleId: item.roleId });
              this.$meta.eventHub.$emit('user:removeRole', { userId: this.user.id, roleId: item.roleId });
              this.$meta.util.swipeoutDelete(event.target);
              return true;
            });
        });
    },
    onRoleSave(data) {
      const index = this.items.findIndex(item => item.roleId === data.roleId);
      if (index > -1) this.reload();
    },
    onRoleDelete(data) {
      const index = this.items.findIndex(item => item.roleId === data.roleId);
      if (index > -1) this.items.splice(index, 1);
    },
  },
};

</script>
<style scoped>


</style>
