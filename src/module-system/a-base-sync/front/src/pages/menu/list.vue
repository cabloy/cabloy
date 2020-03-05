<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" eb-target="_self" eb-href="menu/search"></eb-link>
      </f7-nav-right>
      <f7-subnavbar v-if="tabActive">
        <f7-toolbar top tabbar>
          <f7-link v-for="tab of tabs" :key="tab.id" :tabLink="`#${tab.id}`" :tabLinkActive="tabActive===tab.mode">{{$text(tab.title)}}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="tabActive">
      <eb-tab-page-content v-for="tab of tabs" :key="tab.id" :id="tab.id" :tabActive="tabActive===tab.mode" @tab:show="onTabShow(tab.mode)">
        <menus slot="list" :mode="tab.mode"></menus>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import menus from '../../components/menu/list.vue';
export default {
  meta: {
    size: 'medium',
  },
  components: {
    menus,
  },
  data() {
    const tabs = [
      { id: Vue.prototype.$meta.util.nextId('tab'), mode: 'scenes', title: 'Scenes' },
      { id: Vue.prototype.$meta.util.nextId('tab'), mode: 'modules', title: 'Modules' },
      { id: Vue.prototype.$meta.util.nextId('tab'), mode: 'stars', title: 'Stars' },
    ];
    return {
      pageTitle: null,
      tabs,
      tabActive: '',
    };
  },
  created() {
    // tab active
    this.__initTabActive();
  },
  mounted() {
    // title
    this.__initPageTitle();
  },
  methods: {
    __initPageTitle() {
      const $el = this.$$(this.$el);
      const $view = $el.parents('.eb-layout-view');
      if ($view.is('.eb-layout-panel-view')) {
        this.pageTitle = this.$text('Menu');
      } else {
        this.pageTitle = this.$text('Home');
      }
    },
    __initTabActive() {
      // layoutConfig
      this.$store.dispatch('a/base/getLayoutConfig', 'a-base').then(layoutConfig => {
        this.tabActive = layoutConfig.menuTabActive || this.tabs[0].mode;
      });
    },
    onTabShow(tabMode) {
      if (this.tabActive !== tabMode) {
        this.tabActive = tabMode;
        // save
        this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-base', key: 'menuTabActive', value: this.tabActive });
      }
    },
  },
};

</script>
