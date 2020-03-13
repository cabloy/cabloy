<template>
  <div>
    <f7-list>
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="`${group.atomClassTitle} [${group.moduleTitle}]`" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="item.id" :title="item.actionName" swipeout>
          <div slot="after">
            <f7-badge v-if="item.action!==1 && item.scope==='0'">Self</f7-badge>
            <template v-if="item.scopeRoles">
              <f7-badge v-for="scopeRole of item.scopeRoles" :key="scopeRole.id">{{scopeRole.roleName}}</f7-badge>
            </template>
          </div>
          <eb-context-menu>
            <div slot="right">
              <div color="red" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  meta: {
    global: false,
  },
  mixins: [ebModules, ebAtomClasses],
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
  computed: {
    itemGroups() {
      const modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      const atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];

      if (!this.items) return [];

      const groups = [];
      let group = null;
      for (const item of this.items) {
        const groupName = `${item.module}.${item.atomClassName}`;
        if (!group || group.id !== groupName) {
          const module = this.getModule(item.module);
          const atomClass = this.getAtomClass(item);
          group = {
            id: groupName,
            atomClassTitle: atomClass.titleLocale,
            moduleTitle: module.titleLocale,
            items: [],
          };
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
      return this.$api.post('atomRight/rights', { roleId: this.role.id, page: { index } })
        .then(data => {
          this.items = this.items.concat(data.list);
          return data;
        });
    },
    onPerformAdd() {
      this.$view.navigate(`/a/baseadmin/atomRight/add?roleId=${this.role.id}`);
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm()
        .then(() => {
          return this.$api.post('atomRight/delete', { id: item.id })
            .then(() => {
              this.$meta.eventHub.$emit('atomRight:delete', { id: item.id, roleId: this.role.id });
              this.$meta.util.swipeoutDelete(event.target);
              return true;
            });
        });
    },
    onAtomRightAdd(data) {
      this.reload();
    },
    onAtomRightDelete(data) {
      const index = this.items.findIndex(item => item.id === data.id);
      if (index > -1) this.items.splice(index, 1);
    },
  },
};

</script>
<style scoped>
</style>
