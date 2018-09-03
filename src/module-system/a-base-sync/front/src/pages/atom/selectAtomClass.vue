<template>
  <eb-page>
    <eb-navbar :title="$text('Select Atom Class')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <f7-list-item v-for="(item,index) of atomClasses" :key="index" radio :checked="module===item.module && atomClassName===item.atomClassName" :title="item.title" @click="onItemClick(item)">
      </f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import ebAtomClasses from '../../common/atomClasses.js';
export default {
  mixins: [ ebPageContext, ebAtomClasses ],
  data() {
    return {};
  },
  computed: {
    module() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.module : null;
    },
    atomClassName() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.atomClassName : null;
    },
    optional() {
      return this.contextParams.optional;
    },
    atomClasses() {
      const atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];

      const atomClasses = [];
      if (this.optional) {
        atomClasses.push({ title: null, module: null, atomClassName: null });
      }
      for (const module in atomClassesAll) {
        for (const atomClassName in atomClassesAll[module]) {
          atomClasses.push({
            title: atomClassesAll[module][atomClassName].titleLocale,
            module,
            atomClassName,
          });
        }
      }
      return atomClasses;
    },
  },
  methods: {
    onItemClick(item) {
      const data = item.module ? {
        module: item.module,
        atomClassName: item.atomClassName,
        title: item.title,
      } : null;
      this.contextCallback(200, data);
      this.$f7router.back();
    },
  },
};

</script>
