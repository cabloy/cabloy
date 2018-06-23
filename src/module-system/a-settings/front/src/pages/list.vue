<template>
  <f7-page>
    <eb-navbar :title="$text('Settings')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item class="item" v-for="item of items" :key="item.module" :title="getModule(item.module).titleLocale" :eb-href="`${scene}/edit?module=${item.module}`">
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </f7-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-components').options.components.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      scene: this.$f7Route.params.scene,
      items: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  methods: {
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore({ index }) {
      // fetch
      return this.$api.post(`settings/${this.scene}/list`).then(data => {
        this.items = data.list;
        return data;
      });
    },
  },
};

</script>
