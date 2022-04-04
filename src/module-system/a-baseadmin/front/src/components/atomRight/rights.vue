<template>
  <div>
    <f7-list v-if="ready">
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="`${group.atomClassTitle} [${group.moduleTitle}]`" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="item.id" :title="item.titleLocale" swipeout>
          <div slot="after">
            <f7-badge v-if="item.actionBulk === 0 && item.scope === '0'">{{ $text('Self') }}</f7-badge>
            <template v-if="item.scopeRoles">
              <f7-badge v-for="scopeRole of item.scopeRoles" :key="scopeRole.id">
                {{ scopeRole.roleNameLocale }}
              </f7-badge>
            </template>
          </div>
          <eb-context-menu>
            <div slot="right">
              <div color="red" :context="item" :onPerform="onPerformDelete">
                {{ $text('Delete') }}
              </div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
    <f7-block></f7-block>
  </div>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ebModules, ebAtomClasses, ebAtomActions],
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
    ready() {
      return this.modulesAll && this.atomClassesAll && this.actionsAll;
    },
    roleKey() {
      return { atomId: this.role.atomId, itemId: this.role.itemId };
    },
    itemGroups() {
      if (!this.items) return [];
      const groups = [];
      let group = null;
      for (const item of this.items) {
        // group
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
        // item
        const action = this.getAction({
          module: item.module,
          atomClassName: item.atomClassName,
          name: item.actionName,
        });
        if (!action) {
          item.title = item.actionName;
          item.titleLocale = `${item.actionName} - ${this.$text('ActionObsoletedTitle')}`;
        } else {
          item.title = action.title;
          item.titleLocale = action.titleLocale;
        }
        // push
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
    async onLoadMore({ index }) {
      const data = await this.$api.post('atomRight/rights', {
        key: this.roleKey,
        page: { index },
      });
      this.items = this.items.concat(data.list);
      return data;
    },
    onPerformAdd() {
      this.$view.navigate(`/a/baseadmin/atomRight/add?roleId=${this.role.id}`);
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('atomRight/delete', { id: item.id }).then(() => {
          this.$meta.eventHub.$emit('atomRight:delete', {
            id: item.id,
            roleId: this.role.id,
          });
          this.$meta.util.swipeoutDelete(event.currentTarget);
          return true;
        });
      });
    },
    onAtomRightAdd() {
      this.reload();
    },
    onAtomRightDelete(data) {
      const index = this.items.findIndex(item => item.id === data.id);
      if (index > -1) this.items.splice(index, 1);
    },
  },
};
</script>
<style scoped></style>
