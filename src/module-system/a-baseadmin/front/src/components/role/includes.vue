<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.roleName" :eb-href="`role/edit?roleId=${item.roleIdInc}`" swipeout>
        <f7-swipeout-actions right>
          <eb-swipeout-button color="orange" :context="item" :onPerform="onRemove">{{$text('Remove')}}</eb-swipeout-button>
        </f7-swipeout-actions>
        <eb-popover>
          <f7-list inset>
            <eb-list-item popover-close link="#" :context="item" :onPerform="onRemove">{{$text('Remove')}}</eb-list-item>
          </f7-list>
        </eb-popover>
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
    role: {
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
      return this.$api.post('role/includes', { roleId: this.role.id, page: { index } })
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
              this.$api.post('role/addRoleInc', { roleId: this.role.id, roleIdInc: data.id })
                .then(data => {
                  this.$meta.eventHub.$emit('role:dirty', { dirty: true });
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
          return this.$api.post('role/removeRoleInc', { id: item.id })
            .then(() => {
              this.onRoleDelete({ roleId: item.roleIdInc });
              this.$meta.eventHub.$emit('role:dirty', { dirty: true });
              this.$meta.util.swipeoutDelete(event.target);
              return true;
            });
        });
    },
    onRoleSave(data) {
      const index = this.items.findIndex(item => item.roleIdInc === data.roleId);
      if (index > -1) this.reload();
    },
    onRoleDelete(data) {
      const index = this.items.findIndex(item => item.roleIdInc === data.roleId);
      if (index > -1) this.items.splice(index, 1);
    },
  },
};

</script>
<style scoped>


</style>
