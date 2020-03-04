<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <f7-list-item v-for="(item,index) of functions" :key="index" radio :checked="name===item.name" :title="item.title" @click="onItemClick(item)">
      </f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
const _types = ['Function', 'Menu', 'Panel', 'Widget'];
export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    pageTitle() {
      return this.$text(`Select ${_types[this.menu]}`);
    },
    module() {
      return this.contextParams.module;
    },
    name() {
      return this.contextParams.name;
    },
    menu() {
      return this.contextParams.menu;
    },
    optional() {
      return this.contextParams.optional;
    },
    functions() {
      const functionsAll = this.$local.state.functions;
      if (!functionsAll) return [];

      const functions = [];
      if (this.optional) {
        functions.push({ title: null, name: null });
      }
      for (const name in functionsAll[this.module]) {
        const func = functionsAll[this.module][name];
        if (func.menu === this.menu) {
          functions.push({
            title: func.titleLocale,
            name,
          });
        }
      }
      return functions;
    },
  },
  created() {
    this.$local.dispatch('getFunctions');
  },
  methods: {
    onItemClick(item) {
      const data = item.name ? {
        module: this.module,
        name: item.name,
        title: item.title,
      } : null;
      this.contextCallback(200, data);
      this.$f7router.back();
    },
  },
};

</script>
