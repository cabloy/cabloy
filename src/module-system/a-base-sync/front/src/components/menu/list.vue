<template>
  <div>
    <f7-list>
      <template v-if="mode==='search'">
        <eb-list-item v-for="item of items" :key="item.id" link="#" :context="item" :onPerform="onItemClick" :title="item.titleLocale" swipeout>
          <f7-icon slot="media" color="orange" :material="item.star?'star':''"></f7-icon>
          <eb-context-menu>
            <div slot="right">
              <div color="orange" :context="item" :onPerform="onStarSwitch">{{item.star?$text('Unstar'):$text('Star')}}</div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </template>
      <template v-else-if="mode==='stars'">
        <eb-list-item v-for="item of items" :key="item.id" link="#" :context="item" :onPerform="onItemClick" :title="item.titleLocale" swipeout>
          <eb-context-menu>
            <div slot="right">
              <div color="orange" :context="item" :onPerform="onStarOff">{{$text('Unstar')}}</div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </template>
      <template v-else>
        <f7-list-group v-for="group of itemGroups" :key="group.id">
          <f7-list-item :title="group.title" group-title></f7-list-item>
          <eb-list-item v-for="item of group.items" :key="item.id" link="#" :context="item" :onPerform="onItemClick" :title="item.titleLocale" swipeout>
            <f7-icon slot="media" color="orange" :material="item.star?'star':''"></f7-icon>
            <eb-context-menu>
              <div slot="right">
                <div color="orange" :context="item" :onPerform="onStarSwitch">{{item.star?$text('Unstar'):$text('Star')}}</div>
              </div>
            </eb-context-menu>
          </eb-list-item>
        </f7-list-group>
      </template>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
import ebModules from '../../common/modules.js';
import ebMenus from '../../common/menus.js';
export default {
  meta: {
    global: false,
  },
  mixins: [ebModules, ebMenus],
  props: {
    mode: {
      type: String,
    },
  },
  data() {
    return {
      items: [],
      query: '',
      functionScenes: null,
    };
  },
  computed: {
    itemGroups() {
      if (this.mode === 'scenes') return this.itemGroupsScenes;
      if (this.mode === 'modules') return this.itemGroupsModules;
    },
    itemGroupsScenes() {
      if (!this.functionScenes) return [];
      const groups = [];
      let group = null;
      for (const item of this.items) {
        if (!group || group.id !== item.sceneId) {
          const scene = this.functionScenes[item.sceneId];
          group = { id: item.sceneId, name: scene.sceneName, title: scene.titleLocale, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups;
    },
    itemGroupsModules() {
      if (!this.modulesAll) return [];
      const groups = [];
      let group = null;
      for (const item of this.items) {
        if (!group || group.id !== item.module) {
          const module = this.modulesAll[item.module];
          group = { id: item.module, title: module.titleLocale, items: [] };
          groups.push(group);
        }
        group.items.push(item);
      }
      return groups;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('menu:star', this.onStarChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('menu:star', this.onStarChanged);
  },
  methods: {
    onSearch(query) {
      this.query = query;
      if (!this.query) {
        this.items = [];
      } else {
        this.reload(true);
      }
    },
    reload(force) {
      // scenes
      if (!this.functionScenes) {
        this.$store.dispatch('a/base/getFunctionScenes', { sceneMenu: 1 }).then(data => {
          this.functionScenes = data;
        });
      }
      // reload
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
      // options
      let options;
      if (this.mode === 'scenes') {
        options = {
          where: { 'a.menu': 1 },
          orders: [
            ['f.sceneSorting', 'asc'],
            ['a.sorting', 'asc'],
          ],
          page: { index },
        };
      } else if (this.mode === 'modules') {
        options = {
          where: { 'a.menu': 1 },
          orders: [
            ['a.module', 'asc'],
            ['f.sceneSorting', 'asc'],
            ['a.sorting', 'asc'],
          ],
          page: { index },
        };
      } else if (this.mode === 'stars') {
        options = {
          where: { 'a.menu': 1 },
          orders: [
            ['d.updatedAt', 'desc'],
          ],
          star: 1,
          page: { index },
        };
      } else if (this.mode === 'search') {
        options = {
          where: { 'a.menu': 1, 'b.titleLocale': { val: this.query, op: 'like' } },
          orders: [
            ['b.titleLocale', 'asc'],
          ],
          page: { index },
        };
      }
      // fetch
      return this.$api.post('function/list', {
        options,
      }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    onStarSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return this.$api.post('function/star', {
        id: item.id,
        star,
      }).then(() => {
        this.$meta.eventHub.$emit('menu:star', { id: item.id, star });
        this.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarOff(event, item) {
      return this.$api.post('function/star', {
        id: item.id,
        star: 0,
      }).then(() => {
        this.$meta.eventHub.$emit('menu:star', { id: item.id, star: 0 });
        this.$meta.util.swipeoutDelete(event.target);
      });
    },
    onStarChanged(data) {
      const index = this.items.findIndex(item => item.id === data.id);
      if (this.mode === 'stars') {
        if (data.star === 0 && index !== -1) {
          this.items.splice(index, 1);
        } else if (data.star === 1 && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].star = data.star;
        }
      }
    },
    onItemClick(event, item) {
      const _menu = this.getMenu(item);
      if (!_menu) return;
      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent,
        };
      }
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
  },
};

</script>
