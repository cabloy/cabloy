<template>
  <div>
    <f7-list>
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="group.id" group-title></f7-list-item>
        <eb-list-item class="item" v-for="item of group.items" :key="`${item.roleExpandId}:${item.roleRightId}`" :title="item.actionName">
          <div slot="root-start" class="header">
            <div></div>
            <div>from: {{item.roleName}}</div>
          </div>
          <div slot="after">
            <f7-badge v-if="item.actionCode!==1 && item.scope==='0'">Self</f7-badge>
            <template v-if="item.scopeRoles">
              <f7-badge v-for="scopeRole of item.scopeRoles" :key="scopeRole.id">{{scopeRole.roleName}}</f7-badge>
            </template>
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
        const groupName = `${item.module}.${item.atomClassName}`;
        if (!group || group.id !== groupName) {
          group = { id: groupName, title: groupName, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$on('atomRight:delete', this.onAtomRightDelete);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$off('atomRight:delete', this.onAtomRightDelete);
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
        return this.$api.post('atomRight/spreads', { roleId: this.role.id, page: { index } })
          .then(data => {
            this.items = data.list;
            return data;
          });
      } else {
        // user
        return this.$api.post('user/atomRights', { userId: this.user.id, page: { index } })
          .then(data => {
            this.items = data.list;
            return data;
          });
      }
    },
    onAtomRightAdd(data) {
      this.reload();
    },
    onAtomRightDelete(data) {
      this.reload();
    }
  },
};

</script>
<style lang="less" scoped>
.item {
  .header {
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2px 8px -8px 16px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
}

</style>
