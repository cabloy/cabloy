<template>
  <eb-page infinite :infinitePreloader="false" @infinite="onInfinite">
    <f7-searchbar ref="searchbar" @searchbar:search="onSearch" @searchbar:disable="onDisable" :placeholder="title" :backdrop="false" :disable-button="true" :clear-button="true" :custom-search="true">
    </f7-searchbar>
    <slot ref="list" name="list"></slot>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  name: 'eb-search-page',
  props: {
    title: {
      type: String,
      default: 'Search',
    },
  },
  computed: {
    list() {
      return this.$slots.list[0].componentInstance;
    },
  },
  mounted() {
    this.$refs.searchbar.f7Searchbar.enable(true);
  },
  methods: {
    onSearch: Vue.prototype.$meta.util.debounce(function(searchbar, query) {
      this.list.onSearch(query);
    }, 300),
    onDisable() {
      this.$f7router.back();
    },
    onInfinite() {
      this.list.loadMore();
    },
  },
};

</script>
