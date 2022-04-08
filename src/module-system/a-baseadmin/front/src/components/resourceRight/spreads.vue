<template>
  <div>
    <f7-list v-if="ready">
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="`${group.atomClassTitle} [${group.moduleTitle}]`" group-title> </f7-list-item>
        <eb-list-item
          class="item"
          v-for="item of group.items"
          :key="item._key"
          :title="item.atomNameLocale || item.atomName"
        >
          <div slot="root-start" class="header">
            <div></div>
            <div>{{ $text('from') }}: {{ item.roleNameBaseLocale }}</div>
          </div>
          <div slot="after">
            <f7-badge v-if="item.resourceType">{{ getTypeCategory(item) }}</f7-badge>
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
    <eb-load-more
      ref="loadMore"
      :onLoadClear="onLoadClear"
      :onLoadMore="onLoadMore"
      :autoInit="autoInit"
    ></eb-load-more>
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
    user: {
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
    userKey() {
      return { atomId: this.user.atomId, itemId: this.user.atomId };
    },
    itemGroups() {
      if (!this.items) return [];
      const _keys = {};
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
        const _key = `${item.roleExpandId}:${item.resourceRoleId}`;
        if (!_keys[_key]) {
          _keys[_key] = true;
          // push
          group.items.push({
            _key,
            ...item,
          });
        }
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
      if (this.role) {
        // role
        const data = await this.$api.post('resourceRight/spreads', {
          key: this.roleKey,
          page: { index },
        });
        this.items = this.items.concat(data.list);
        return data;
      }
      // user
      const data = await this.$api.post('user/resourceRights', {
        key: this.userKey,
        page: { index },
      });
      this.items = this.items.concat(data.list);
      return data;
    },
    onResourceRightAdd() {
      this.reload();
    },
    onResourceRightDelete() {
      this.reload();
    },
    getTypeCategory(item) {
      return `${item.resourceTypeLocale} / ${item.atomCategoryNameLocale}`;
    },
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
    color: var(--f7-block-header-text-color);
  }
}
</style>
