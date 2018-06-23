<template>
  <div>
    <f7-list>
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="group.id" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="`${item.roleExpandId}:${item.roleFunctionId}`" :title="item.title">
          <div slot="after">
            <div>from: {{item.roleName}}</div>
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  props: {
    role: {
      type: Object,
    },
    user: {
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
      if (this.role) {
        // role
        return this.$api.post(`${this.apiPath}/spreads`, { roleId: this.role.id, menu: this.menu, page: { index } })
          .then(data => {
            this.items = data.list;
            return data;
          });
      } else {
        // user
        return this.$api.post('user/functionRights', { userId: this.user.id, menu: this.menu, page: { index } })
          .then(data => {
            this.items = data.list;
            return data;
          });
      }
    },
    onFunctionRightAdd(data) {
      this.reload();
    },
    onFunctionRightDelete(data) {
      this.reload();
    }
  },
};

</script>
<style scoped>


</style>
