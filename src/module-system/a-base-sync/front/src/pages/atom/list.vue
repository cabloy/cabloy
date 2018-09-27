<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <template v-if="atomClass">
          <eb-link v-if="showAdd" iconMaterial="add" :onPerform="onPerformAdd"></eb-link>
        </template>
        <template v-else>
          <f7-link v-if="showPopover" iconMaterial="add" :popover-open="`#${popoverId}`"></f7-link>
        </template>
        <eb-link iconMaterial="search" @click.prevent="onSearch"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar tabbar :scrollable="labels && Object.keys(labels).length>1">
          <f7-link :tab-link="`#${tabIdList}`" tab-link-active>{{$text('List')}}</f7-link>
          <f7-link :tab-link="`#${tabIdDrafts}`">{{$text('Drafts')}}</f7-link>
          <f7-link :tab-link="`#${tabIdStars}`">{{$text('Stars')}}</f7-link>
          <template v-if="labels">
            <f7-link v-for="key of Object.keys(labels)" :key="key" :tab-link="`#${tabIdLabels}_${key}`">{{labels[key].text}}</f7-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs>
      <eb-tab-page-content :id="tabIdList" tab-active>
        <atoms slot="list" mode="list" :atomClass="atomClass" :where="where"></atoms>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdDrafts">
        <atoms slot="list" mode="drafts" :atomClass="atomClass" :where="where"></atoms>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdStars">
        <atoms slot="list" mode="stars" :atomClass="atomClass" :where="where"></atoms>
      </eb-tab-page-content>
      <template v-if="labels">
        <eb-tab-page-content v-for="key of Object.keys(labels)" :key="key" :id="`${tabIdLabels}_${key}`">
          <atoms slot="list" :mode="`labels-${key}`" :atomClass="atomClass" :where="where"></atoms>
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
import ebActions from '../../common/actions.js';
import ebMenus from '../../common/menus.js';
export default {
  mixins: [ ebAtomClasses, ebActions, ebMenus ],
  components: {
    atoms,
  },
  data() {
    return {
      module: this.$f7route.query.module,
      atomClassName: this.$f7route.query.atomClassName,
      where: this.$f7route.query.where ? JSON.parse(this.$f7route.query.where) : null,
      tabIdList: Vue.prototype.$meta.util.nextId('tab'),
      tabIdDrafts: Vue.prototype.$meta.util.nextId('tab'),
      tabIdStars: Vue.prototype.$meta.util.nextId('tab'),
      tabIdLabels: Vue.prototype.$meta.util.nextId('tab'),
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
      showAdd: false,
      actions: null,
    };
  },
  computed: {
    labels() {
      return this.$local.state.labels;
    },
    atomClass() {
      if (!this.module || !this.atomClassName) return null;
      return {
        module: this.module,
        atomClassName: this.atomClassName,
      };
    },
    title() {
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
    },
    showPopover() {
      return this.actions && this.actions.length > 0;
    },
  },
  created() {
    // labels
    this.$local.dispatch('getLabels');
    // checkRightCreate or functionList
    if (this.atomClass) {
      this.$api.post('atomClass/checkRightCreate', {
        atomClass: this.atomClass,
      }).then(data => {
        this.showAdd = !!data;
      });
    } else {
      const options = {
        where: { menu: 1, scene: 1 },
        orders: [
          [ 'sorting', 'asc' ],
        ],
      };
      this.$api.post('function/list', {
        options,
      }).then(data => {
        this.actions = data.list;
      });
    }
  },
  methods: {
    onSearch() {
      const atomClass = this.atomClass;
      let url = '/a/base/atom/search';
      if (atomClass) {
        url = `${url}?module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
      }
      this.$view.navigate(url, { target: '_self' });
    },
    onAction(event, item) {
      const _menu = this.getMenu(item);
      if (!_menu) return;
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformAdd(event) {
      return this.onAction(event, {
        module: this.module,
        atomClassName: this.atomClassName,
        action: 'create',
      });
    },
  },
};

</script>
