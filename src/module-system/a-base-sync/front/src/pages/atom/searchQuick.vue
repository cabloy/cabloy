<template>
  <eb-search-page advanced :title="pageTitle" @onSearch="onSearch" @onLoadMore="onLoadMore" @onDisable="onDisable" @onSearchAdvanced="onSearchAdvanced">
    <atoms slot="list" ref="list" :mode="mode" :params="params" :atomClass="atomClass" :where="where"></atoms>
  </eb-search-page>
</template>
<script>
import Vue from 'vue';
import ebAtomClasses from '../../common/atomClasses.js';
import atoms from '../../components/atom/list.vue';
export default {
  mixins: [ebAtomClasses],
  components: {
    atoms,
  },
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const where = (query && query.where) ? JSON.parse(query.where) : null;
    const mode = (query && query.mode) || 'search';
    const selectMode = query && query.selectMode;
    return {
      queries: query,
      atomClass,
      where,
      mode,
      selectMode,
    };
  },
  computed: {
    params() {
      return {
        selectMode: this.selectMode,
      };
    },
    pageTitle() {
      const atomClassTitle = this.atomClassTitle || this.$text('Atom');
      return `${this.$text('Search')} ${atomClassTitle}`;
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.getAtomClass(this.atomClass);
      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    },
  },
  methods: {
    onSearch(query) {
      this.$refs.list.onSearch(query);
    },
    onLoadMore() {
      this.$refs.list.loadMore();
    },
    onDisable() {
      this.$f7router.back();
    },
    onSearchAdvanced() {
      const url = this.$meta.util.combineQueries('/a/base/atom/search', this.queries);
      this.$view.navigate(url, {
        target: '_self',
        //reloadCurrent: true
      });
    }
  }
};

</script>
