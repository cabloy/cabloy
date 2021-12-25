<template>
  <eb-page infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :large="advanced" :inner="false">
      <f7-searchbar
        v-if="disableButton !== null"
        ref="searchbar"
        @searchbar:search="onSearch"
        @searchbar:disable="onDisable"
        @focus="onFocus"
        @blur="onBlur"
        :placeholder="$text(title)"
        :backdrop="false"
        :disable-button="disableButton"
        :clear-button="true"
        :custom-search="true"
      >
      </f7-searchbar>
      <eb-link v-if="advanced" slot="title-large" class="search-advanced" @click="onClickAdvanced">{{
        $text(advancedSearchTitle)
      }}</eb-link>
    </eb-navbar>
    <slot></slot>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  meta: {
    global: true,
  },
  name: 'eb-search-page',
  props: {
    title: {
      type: String,
      default: 'Search',
    },
    advancedSearchTitle: {
      type: String,
      default: 'Advanced Search',
    },
    advanced: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disableButton: null,
      query: '',
    };
  },
  created() {
    this.onSearch = this.$meta.util.debounce((searchbar, query) => {
      this._onSearch(query);
    }, 300);
  },
  mounted() {
    this.disableButton = this.$meta.vueLayout.backLink(this);
    this.$nextTick(() => {
      this.$refs.searchbar.f7Searchbar.enable(true);
    });
  },
  methods: {
    _onSearch(query) {
      this.query = query;
      this.$emit('search', query);
    },
    onDisable() {
      this.$emit('disable');
    },
    onInfinite() {
      this.$emit('loadMore');
    },
    onClickAdvanced() {
      this.$emit('searchAdvanced');
    },
    onFocus() {
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
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
