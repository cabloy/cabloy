<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="view_headline" :onPerform="onPerformList"></eb-link>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar tabbar :scrollable="languages && languages.length>2">
          <template v-if="languages">
            <f7-link v-for="(item,index) of languages" :key="item" :tab-link="`#${tabIdLanguages}_${item}`" :tab-link-active="index===0">{{item}}</f7-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs>
      <template v-if="languages">
        <f7-page-content v-for="(item,index) of languages" :key="item" :id="`${tabIdLanguages}_${item}`" tab :tab-active="index===0">
          <category-list :categoryIdStart="0" :language="item" @node:click="onNodeClick"></category-list>
        </f7-page-content>
      </template>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import categoryList from '../../components/category/list.vue';
const ebMenus = Vue.prototype.$meta.module.get('a-base').options.components.ebMenus;
export default {
  mixins: [ ebMenus ],
  components: {
    categoryList,
  },
  data() {
    return {
      tabIdLanguages: Vue.prototype.$meta.util.nextId('tab'),
    };
  },
  computed: {
    title() {
      return `${this.$text('Atom')}: ${this.$text('Article')}`;
    },
    languages() {
      return this.$local.getters('languages');
    },
  },
  created() {
    this.$local.dispatch('getLanguages');
  },
  methods: {
    onPerformList() {
      const item = { module: 'a-cms', atomClassName: 'article', name: 'listArticle' };
      let _menu = this.getMenu(item);
      if (!_menu) return;
      _menu = this.$utils.extend(_menu, { navigateOptions: { target: '_self' } });
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformSearch() {
      this.$view.navigate('/a/base/atom/search?module=a-cms&atomClassName=article', { target: '_self' });
    },
    onNodeClick(node) {
      if (node.data.catalog) return;
      this.$view.navigate(`/a/cms/article/list?categoryId=${node.data.id}&categoryName=${encodeURIComponent(node.data.categoryName)}`, { target: '_self' });
    },
  },
};

</script>
