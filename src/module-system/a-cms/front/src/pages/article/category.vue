<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="view_headline" :onPerform="onPerformList"></eb-link>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar top tabbar :scrollable="languages && languages.length>2">
          <template v-if="languages">
            <f7-link v-for="(item,index) of languages" :key="item.value" :tab-link="`#${tabIdLanguages}_${item.value}`" :tab-link-active="index===0">{{item.title}}</f7-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs>
      <template v-if="languages">
        <f7-page-content v-for="(item,index) of languages" :key="item.value" :id="`${tabIdLanguages}_${item.value}`" tab :tab-active="index===0">
          <category-list :atomClass="atomClass" :categoryIdStart="0" :language="item.value" @node:click="onNodeClick"></category-list>
        </f7-page-content>
      </template>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebMenus = Vue.prototype.$meta.module.get('a-base').options.mixins.ebMenus;
import categoryList from '../../components/category/list.vue';
import utils from '../../common/utils.js';
export default {
  mixins: [ebAtomClasses, ebMenus],
  components: {
    categoryList,
  },
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      tabIdLanguages: Vue.prototype.$meta.util.nextId('tab'),
    };
  },
  computed: {
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
    pageTitle() {
      const atomClass = this.getAtomClass(this.atomClass);
      if (atomClass) return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
      return this.$text('Atom');
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onPerformList() {
      // atomClass
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return;
      const atomClassNameCapitalize = atomClass.name.replace(/^\S/, function(s) { return s.toUpperCase(); });
      // menu
      const item = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
        name: `list${atomClassNameCapitalize}`,
      };
      let _menu = this.getMenu(item);
      if (!_menu) return;
      _menu = this.$utils.extend(_menu, { navigateOptions: { target: '_self' } });
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformSearch() {
      const url = this.combineAtomClass('/a/base/atom/search');
      this.$view.navigate(url, { target: '_self' });
    },
    onNodeClick(node) {
      if (node.data.catalog) return;
      const url = this.combineAtomClass(`/a/cms/article/list?language=${node.data.language}&categoryId=${node.data.id}&categoryName=${encodeURIComponent(node.data.categoryName)}`);
      this.$view.navigate(url, { target: '_self' });
    },
  },
};

</script>
