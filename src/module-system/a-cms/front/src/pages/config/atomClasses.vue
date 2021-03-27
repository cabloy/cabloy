<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('CMS')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item v-for="item of items" :key="item.key" :title="item.title" :eb-href="`/a/cms/config/list?module=${item.moduleName}&atomClassName=${item.atomClassName}`">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebModules, ebAtomClasses ],
  props: {
    role: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ready() {
      return this.modulesAll && this.atomClassesAll;
    },
    items() {
      const items = [];
      for (const moduleName in this.atomClassesAll) {
        const atomClasses = this.atomClassesAll[moduleName];
        const atomClassesCount = Object.keys(atomClasses).length;
        for (const atomClassName in atomClasses) {
          const atomClass = atomClasses[atomClassName];
          if (!atomClass.cms) continue;
          // key
          const key = `${moduleName}.${atomClassName}`;
          // title
          const module = this.getModule(moduleName);
          let title = module.titleLocale;
          if (moduleName === 'a-cms') {
            title = `${title}:${this.$text('General')}`;
          } else if (atomClassesCount > 1) {
            title = `${title}:${atomClass.titleLocale}`;
          }
          // push
          items.push({
            key,
            moduleName,
            atomClassName,
            title,
          });
        }
      }
      return items;
    },
  },
  methods: {},
};

</script>
