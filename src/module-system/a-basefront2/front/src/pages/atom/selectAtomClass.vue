<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Atom Class')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="ready">
      <f7-list-item
        v-for="(item, index) of atomClasses"
        :key="index"
        radio
        :checked="module === item.module && atomClassName === item.atomClassName"
        :title="item.title"
        @click="onItemClick(item)"
      >
        <div slot="after">{{ item.after }}</div>
      </f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebModules, ebPageContext, ebAtomClasses],
  data() {
    return {};
  },
  computed: {
    ready() {
      return this.modulesAll && this.atomClassesAll;
    },
    module() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.module : null;
    },
    atomClassName() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.atomClassName : null;
    },
    optional() {
      return this.contextParams.optional;
    },
    simple() {
      return this.contextParams.simple;
    },
    resource() {
      return this.contextParams.resource;
    },
    inner() {
      return this.contextParams.inner;
    },
    inner2() {
      if (this.inner === undefined) return false;
      return this.inner; // null/true/false
    },
    user() {
      return this.contextParams.user;
    },
    atomClasses_modeUser() {
      return this.user;
    },
    atomClasses() {
      const atomClasses = [];
      if (this.optional) {
        atomClasses.push({ title: null, module: null, atomClassName: null });
      }
      for (const moduleName in this.atomClassesAll) {
        const module = this.modulesAll[moduleName];
        const atomClassesModule = this.atomClassesAll[moduleName];
        for (const atomClassName in atomClassesModule) {
          const atomClass = atomClassesModule[atomClassName];
          // check inner
          if (this.inner2 !== null && Boolean(this.inner2) !== Boolean(atomClass.inner)) continue;
          // check resource
          if (this.resource) {
            if (!atomClass.resource) continue;
            if (moduleName === 'a-base' && atomClassName === 'role') continue;
          }
          // check simple
          if (this.simple === 0 && atomClass.simple) continue;
          if (this.simple === 1 && !atomClass.simple) continue;
          // show
          const title = atomClass.titleLocale;
          const after = module.titleLocale;
          atomClasses.push({
            title,
            module: moduleName,
            atomClassName,
            after,
          });
        }
      }
      return atomClasses;
    },
  },
  methods: {
    onItemClick(item) {
      let data = null;
      if (item.module) {
        data = {
          module: item.module,
          atomClassName: item.atomClassName,
          title: item.title,
        };
      }
      this.contextCallback(200, data);
      this.$f7router.back();
    },
  },
};
</script>
