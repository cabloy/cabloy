<template>
  <div>
    <f7-list v-if="ready">
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="`${group.atomClassTitle} [${group.moduleTitle}]`" group-title></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="item.id" :title="item.atomNameLocale || item.atomName" swipeout>
          <div slot="after">
            <f7-badge v-if="item.resourceType">{{ getTypeCategory(item) }}</f7-badge>
          </div>
          <eb-context-menu>
            <div slot="right">
              <div color="red" :context="item" :onPerform="onPerformDelete">{{ $text('Delete') }}</div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more
      ref="loadMore"
      :onLoadClear="onLoadClear"
      :onLoadMore="onLoadMore"
      :autoInit="autoInit"
    ></eb-load-more>
    <f7-block></f7-block>
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
    autoInit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.atomClassesAll;
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
        // push
        group.items.push(item);
      }
      return groups;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('resourceRight:add', this.onResourceRightAdd);
    this.$meta.eventHub.$on('resourceRight:delete', this.onResourceRightDelete);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('resourceRight:add', this.onResourceRightAdd);
    this.$meta.eventHub.$off('resourceRight:delete', this.onResourceRightDelete);
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
      const data = await this.$api.post('resourceRight/rights', {
        key: this.roleKey,
        page: { index },
      });
      this.items = this.items.concat(data.list);
      return data;
    },
    onPerformAdd() {
      const url = `/a/baseadmin/resourceRight/add?roleAtomId=${this.roleKey.atomId}&roleId=${this.roleKey.itemId}`;
      this.$view.navigate(url);
    },
    async onPerformDelete(event, item) {
      await this.$view.dialog.confirm();
      await this.$api.post('resourceRight/delete', { key: this.roleKey, atomId: item.atomId });
      this.$meta.eventHub.$emit('resourceRight:delete', { id: item.id, roleId: this.role.id });
      this.$meta.util.swipeoutDelete(event.currentTarget);
      return true;
    },
    onResourceRightAdd() {
      this.reload();
    },
    onResourceRightDelete(data) {
      const index = this.items.findIndex(item => item.id === data.id);
      if (index > -1) this.items.splice(index, 1);
    },
    getTypeCategory(item) {
      return `${item.resourceTypeLocale} / ${item.atomCategoryNameLocale}`;
    },
  },
};
</script>
<style scoped></style>
