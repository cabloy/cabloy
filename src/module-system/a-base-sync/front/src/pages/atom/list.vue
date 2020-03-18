<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <f7-link v-if="showPopover" iconMaterial="add" :popover-open="`#${popoverId}`"></f7-link>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
        <eb-link iconMaterial="sort" :onPerform="onPerformAtomOrders"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar top tabbar :scrollable="labels && Object.keys(labels).length>1">
          <f7-link :tab-link="`#${tabIdList}`" tab-link-active>{{$text('List')}}</f7-link>
          <f7-link :tab-link="`#${tabIdDrafts}`">{{$text('Drafts')}}</f7-link>
          <f7-link :tab-link="`#${tabIdStars}`">{{$text('Stars')}}</f7-link>
          <template v-if="labels">
            <f7-link v-for="key of Object.keys(labels)" :key="key" :tab-link="`#${tabIdLabels}_${key}`">{{labels[key].text}}</f7-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabIdList" tab-active data-ref="list">
        <atoms ref="list" slot="list" mode="list" :atomClass="atomClass" :where="whereForList"></atoms>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdDrafts" data-ref="drafts">
        <atoms ref="drafts" slot="list" mode="drafts" :atomClass="atomClass" :where="where"></atoms>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdStars" data-ref="stars">
        <atoms ref="stars" slot="list" mode="stars" :atomClass="atomClass" :where="where"></atoms>
      </eb-tab-page-content>
      <template v-if="labels">
        <eb-tab-page-content v-for="key of Object.keys(labels)" :key="key" :id="`${tabIdLabels}_${key}`" :data-ref="`labels-${key}`">
          <atoms :ref="`labels-${key}`" slot="list" :mode="`labels-${key}`" :atomClass="atomClass" :where="where"></atoms>
        </eb-tab-page-content>
      </template>
    </f7-tabs>
    <f7-popover :id="popoverId">
      <f7-list v-if="showPopover" inset>
        <eb-list-button v-for="action of actions" :key="action.id" popover-close :context="action" :onPerform="onAction">{{action.titleLocale}}</eb-list-button>
      </f7-list>
    </f7-popover>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import atoms from '../../components/atom/list.vue';
import ebAtomClasses from '../../common/atomClasses.js';
import ebAtomActions from '../../common/atomActions.js';
import ebMenus from '../../common/menus.js';
export default {
  mixins: [ebAtomClasses, ebAtomActions, ebMenus],
  components: {
    atoms,
  },
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const where = (query && query.where) ? JSON.parse(query.where) : null;
    const scene = query && query.scene;
    return {
      atomClass,
      where,
      scene,
      tabIdList: Vue.prototype.$meta.util.nextId('tab'),
      tabIdDrafts: Vue.prototype.$meta.util.nextId('tab'),
      tabIdStars: Vue.prototype.$meta.util.nextId('tab'),
      tabIdLabels: Vue.prototype.$meta.util.nextId('tab'),
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
      actions: null,
    };
  },
  computed: {
    labels() {
      return this.$local.getters('userLabels');
    },
    pageTitle() {
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
    },
    showPopover() {
      return this.actions && this.actions.length > 0;
    },
    whereForList() {
      // others
      if (this.scene !== 'mine') return this.where;
      // mine
      const where = this.where || {};
      const user = this.$store.state.auth.user.op;
      where['a.userIdCreated'] = user.id;
      return where;
    },
  },
  created() {
    // labels
    this.$local.dispatch('getLabels');
    // functionList
    const options = {
      where: { menu: 1, sceneName: 'create' },
      orders: [
        ['sorting', 'asc'],
      ],
    };
    if (this.atomClass) {
      options.where['e.module'] = this.atomClass.module;
      options.where['e.atomClassName'] = this.atomClass.atomClassName;
    }
    this.$api.post('function/list', {
      options,
    }).then(data => {
      this.actions = data.list;
    });
  },
  methods: {
    onPerformSearch() {
      const queries = {};
      const atomClass = this.atomClass;
      if (atomClass) {
        queries.module = atomClass.module;
        queries.atomClassName = atomClass.atomClassName;
      }
      if (this.where) {
        queries.where = JSON.stringify(this.where);
      }
      const url = this.$meta.util.combineQueries('/a/base/atom/searchQuick', queries);
      this.$view.navigate(url, { target: '_self' });
    },
    onAction(event, item) {
      let _menu = this.getMenu(item);
      if (!_menu) return;
      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent,
        };
        _menu = this.$utils.extend({}, _menu, { targetEl: event.target });
      }
      this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformAtomOrders(event) {
      const tab = this.$$(this.$refs.tabs.$el).find('.tab-active');
      let tabRef = this.$refs[tab.data('ref')];
      if (Array.isArray(tabRef)) tabRef = tabRef[0];
      tabRef.openPopoverForAtomOrders(event.currentTarget);
    },
  },
};

</script>
