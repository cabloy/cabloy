<template>
  <div>
    <f7-list>
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="group.id" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="item.id" :title="item.titleLocale || item.title" swipeout>
          <f7-swipeout-actions right>
            <eb-swipeout-button color="orange" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</eb-swipeout-button>
          </f7-swipeout-actions>
          <eb-popover>
            <f7-list inset>
              <eb-list-item popover-close link="#" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</eb-list-item>
            </f7-list>
          </eb-popover>
        </eb-list-item>
      </f7-list-group>
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
    menu: {
      type: Number,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    itemGroups() {
      if (!this.items) return [];
      const groups = [];
      let group = null;
      for (const item of this.items) {
        const groupName = item.module;
        if (!group || group.id !== groupName) {
          group = { id: groupName, title: groupName, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups;
    },
    apiPath() {
      return this.menu === 1 ? 'menuRight' : 'functionRight';
    },
  },
  mounted() {
    this.$meta.eventHub.$on('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$on('functionRight:delete', this.onFunctionRightDelete);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$off('functionRight:delete', this.onFunctionRightDelete);
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
      return this.$api.post(`${this.apiPath}/rights`, { roleId: this.role.id, page: { index } })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    onPerformAdd() {
      this.$view.navigate(`/a/baseadmin/functionRight/add?roleId=${this.role.id}&menu=${this.menu}`);
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm()
        .then(() => {
          return this.$api.post(`${this.apiPath}/delete`, { id: item.id })
            .then(() => {
              this.$meta.eventHub.$emit('functionRight:delete', { id: item.id, roleId: this.role.id });
              this.$meta.util.swipeoutDelete(event.target);
              return true;
            });
        });
    },
    onFunctionRightAdd(data) {
      this.reload();
    },
    onFunctionRightDelete(data) {
      const index = this.items.findIndex(item => item.id === data.id);
      if (index > -1) this.items.splice(index, 1);
    },
  },
};

</script>
<style scoped>


</style>
