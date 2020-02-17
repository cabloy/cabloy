<template>
  <eb-page infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :large="advanced" :inner="false">
      <f7-searchbar ref="searchbar" @searchbar:search="onSearch" @searchbar:disable="onDisable" :placeholder="title" :backdrop="false" :disable-button="true" :clear-button="true" :custom-search="true">
      </f7-searchbar>
      <eb-link v-if="advanced" slot="title-large" class="search-advanced" @click="onClickAdvanced">{{$text('Advanced Search')}}</eb-link>
    </eb-navbar>
    <slot name="list"></slot>
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
    advanced: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    this.$refs.searchbar.f7Searchbar.enable(true);
  },
  methods: {
    onSearch: Vue.prototype.$meta.util.debounce(function(searchbar, query) {
      this.$emit('onSearch', query);
    }, 300),
    onDisable() {
      this.$emit('onDisable');
    },
    onInfinite() {
      this.$emit('onLoadMore');
    },
    onClickAdvanced() {
      this.$emit('onSearchAdvanced');
    }
  },
};

</script>
<style lang="less" scoped>
.search-advanced {
  float: right;
  font-size: var(--f7-toolbar-font-size);
  top: 6px;
}

</style>
