<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Tags')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
        <eb-link ref="buttonSubmit" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
      <f7-searchbar
        ref="searchbar"
        expandable
        @searchbar:search="onSearch"
        @searchbar:disable="onDisable"
        :backdrop="false"
        :disable-button="true"
        :clear-button="true"
        :custom-search="true"
      >
      </f7-searchbar>
    </eb-navbar>
    <tagSelect
      ref="tagSelect"
      :atomClass="atomClass"
      :language="language"
      :multiple="multiple"
      :searchQuery="searchQuery"
      :selectedTags="selectedTags"
      :showBlockCurrent="showBlockCurrent"
    ></tagSelect>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import tagSelect from '../../components/tag/tagSelect.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    tagSelect,
  },
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    return {
      atomClass,
      language,
      searchQuery: null,
    };
  },
  computed: {
    selectedTags() {
      return this.contextParams.selectedTags;
    },
    multiple() {
      return this.contextParams.multiple !== false;
    },
    showBlockCurrent() {
      return this.contextParams.showBlockCurrent !== false;
    },
  },
  methods: {
    onPerformDone() {
      const checked = this.$refs.tagSelect.checked();
      this.contextCallback(200, checked);
      this.$f7router.back();
    },
    onPerformSearch() {
      this.$refs.searchbar.f7Searchbar.enable();
    },
    onSearch: Vue.prototype.$meta.util.debounce(function (searchbar, query) {
      this.searchQuery = query;
    }, 200),
    onDisable() {
      this.searchQuery = null;
    },
  },
};
</script>
