<template>
  <eb-page :page-content="false">
    <eb-navbar :title="title" eb-back-link="Back">
    </eb-navbar>
    <eb-tab-page-content :tab="false" tab-active>
      <eb-atoms slot="list" mode="search" :atomClass="{module:'a-cms',atomClassName:'article'}" :where="{categoryId}"></eb-atoms>
    </eb-tab-page-content>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebAtoms = Vue.prototype.$meta.module.get('a-base').options.components.ebAtoms;
export default {
  components: {
    ebAtoms,
  },
  data() {
    return {
      categoryId: this.$f7route.query.categoryId,
      categoryName: this.$f7route.query.categoryName,
    };
  },
  computed: {
    title() {
      return `${this.$text('Category')}: ${this.categoryName}`;
    },
  },
  methods: {},
};

</script>
