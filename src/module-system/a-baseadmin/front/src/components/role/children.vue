<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.roleName" link="#" :eb-href="`role/edit?roleId=${item.id}`">
        <f7-badge slot="media">{{item.sorting}}</f7-badge>
        <div slot="after">
          <f7-badge v-if="item.leader">{{$text('Leader')}}</f7-badge>
          <f7-badge v-if="item.catalog">{{$text('Catalog')}}</f7-badge>
          <f7-badge v-if="item.system">{{$text('System')}}</f7-badge>
        </div>
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
    this.$meta.eventHub.$on('role:add', this.onRoleAdd);
    this.$meta.eventHub.$on('role:move', this.onRoleMove);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:add', this.onRoleAdd);
    this.$meta.eventHub.$off('role:move', this.onRoleMove);
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
      return this.$api.post('role/children', { roleId: this.role.id, page: { index } })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    onPerformAdd() {
      return this.addRole({ catalog: 0 });
    },
    onPerformAddCatalog() {
      return this.addRole({ catalog: 1 });
    },
    addRole({ catalog }) {
      return this.$api.post('role/add', { roleIdParent: this.role.id, catalog })
        .then(data => {
          this.$meta.eventHub.$emit('role:add', { roleIdParent: this.role.id, roleId: data });
          this.$meta.eventHub.$emit('role:dirty', { dirty: true });
          this.$view.navigate(`/a/baseadmin/role/edit?roleId=${data}`);
        });
    },
    onRoleSave(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    },
    onRoleAdd(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    },
    onRoleMove(data) {
      if (data.roleIdFrom !== this.role.id && data.roleIdTo !== this.role.id) return;
      this.reload();
    },
    onRoleDelete(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    },
  },
};

</script>
<style scoped>
</style>
