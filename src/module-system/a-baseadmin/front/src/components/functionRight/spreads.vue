<template>
  <div>
    <f7-list>
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="group.moduleTitle" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="`${item.roleExpandId}:${item.roleFunctionId}`" :title="item.titleLocale || item.title">
          <div slot="after">
            <div>{{$text('from')}}: {{item.roleName}}</div>
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  meta: {
    global: false,
  },
  mixins: [ebModules],
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
      const modulesAll = this.modulesAll;
      if (!modulesAll) return [];

      if (!this.items) return [];

      const groups = [];
      let group = null;
      for (const item of this.items) {
        const groupName = item.module;
        if (!group || group.id !== groupName) {
          const module = this.getModule(item.module);
          group = { id: groupName, moduleTitle: module.titleLocale, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups;
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
        return this.$api.post('functionRight/spreads', {
            roleId: this.role.id,
            menu: this.menu,
            page: { index }
          })
          .then(data => {
            this.items = this.items.concat(data.list);
            return data;
          });
      }
      // user
      return this.$api.post('user/functionRights', {
          userId: this.user.id,
          menu: this.menu,
          page: { index }
        })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });

    },
    onFunctionRightAdd(data) {
      this.reload();
    },
    onFunctionRightDelete(data) {
      this.reload();
    },
  },
};

</script>
<style scoped>
</style>
