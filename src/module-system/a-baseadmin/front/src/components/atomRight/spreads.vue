<template>
  <div>
    <f7-list v-if="ready">
      <f7-list-group v-for="group of itemGroups" :key="group.id">
        <f7-list-item :title="`${group.atomClassTitle} [${group.moduleTitle}]`" group-title> </f7-list-item>
        <eb-list-item class="item" v-for="item of group.items" :key="item._key" :title="item.titleLocale">
          <div slot="root-start" class="header">
            <div></div>
            <div>{{ $text('from') }}: {{ item.roleNameBaseLocale }}</div>
          </div>
          <div slot="after">
            <f7-badge v-if="item.actionBulk === 0 && item.scope === '0'">{{ $text('Self') }}</f7-badge>
            <template v-if="item.scopeRoles">
              <f7-badge
                v-for="scopeRole of item.scopeRoles"
                :key="scopeRole.id"
                color="teal"
                :tooltip="$text('DataScope')"
              >
                {{ scopeRole.roleNameLocale }}
              </f7-badge>
            </template>
            <template v-if="item.areaScopeInfo">
              <f7-badge :color="item.areaScopeInfo.error ? 'red' : 'blue'" :tooltip="$text('AreaScope')">{{
                item.areaScopeInfo.error || item.areaScopeInfo.titleLocale || item.areaScopeInfo.title
              }}</f7-badge>
            </template>
          </div>
          <div slot="root-end" class="summary-no-media">
            <div v-if="item.actionBulk === 1 && item.actionCode !== 1">
              {{ $text('Bulk') }}
            </div>
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
      return this.modulesAll && this.atomClassesAll && this.actionsAll;
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
        const _key = `${item.roleExpandId}:${item.roleRightId}`;
        if (!_keys[_key]) {
          _keys[_key] = true;
          const action = this.getAction({
            module: item.module,
            atomClassName: item.atomClassName,
            name: item.actionName,
          });
          const _item = {
            _key,
            ...item,
          };
          if (!action) {
            _item.title = item.actionName;
            _item.titleLocale = `${item.actionName} - ${this.$text('ActionObsoletedTitle')}`;
          } else {
            _item.title = action.title;
            _item.titleLocale = action.titleLocale;
          }
          // push
          group.items.push(_item);
        }
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
      if (this.role) {
        // role
        const data = await this.$api.post('atomRight/spreads', {
          key: this.roleKey,
          page: { index },
        });
        this.items = this.items.concat(data.list);
        return data;
      }
      // user
      const data = await this.$api.post('user/atomRights', {
        key: this.userKey,
        page: { index },
      });
      this.items = this.items.concat(data.list);
      return data;
    },
    onAtomRightAdd() {
      this.reload();
    },
    onAtomRightDelete() {
      this.reload();
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
