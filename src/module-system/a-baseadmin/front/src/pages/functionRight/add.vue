<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
      <f7-list-item smartSelect :title="$text('Module')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="module" v-model="module" :options="modules"></eb-select>
      </f7-list-item>
      <f7-list-item v-if="!!module" :title="buttonTitle" link="#" @click="onSelectFunction">
        <div slot="after">{{func && func.title}}</div>
      </f7-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.components.ebModules;
const ebFunctions = Vue.prototype.$meta.module.get('a-base').options.components.ebFunctions;
const _types = ['Function', 'Menu', 'Panel', 'Widget'];
export default {
  mixins: [ebModules, ebFunctions],
  data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      menu: parseInt(this.$f7route.query.menu),
      module: '',
      func: null,
    };
  },
  computed: {
    modules() {
      const modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      const functionsAll = this.functionsAll;
      if (!functionsAll) return [];

      const options = [{ title: null, value: '' }];
      for (const moduleName in functionsAll) {
        const functions = functionsAll[moduleName];
        if (Object.keys(functions).length > 0) {
          const module = this.getModule(moduleName);
          options.push({ title: module.titleLocale, value: moduleName });
        }
      }
      return options;
    },
    pageTitle() {
      return this.$text(`New ${_types[this.menu]} Right`);
    },
    buttonTitle() {
      return this.$text(_types[this.menu]);
    }
  },
  watch: {
    module(value) {
      this.func = null;
    },
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onSelectFunction() {
      this.$view.navigate('/a/base/menu/selectFunction', {
        target: '_self',
        context: {
          params: {
            module: this.module,
            name: this.func ? this.func.name : null,
            menu: this.menu,
            optional: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.func = data;
            }
          },
        },
      });
    },
    onSave() {
      if (!this.module || !this.func) return;
      return this.$api.post('functionRight/add', {
          roleId: this.roleId,
          menu: this.menu,
          module: this.module,
          name: this.func.name,
        })
        .then(() => {
          this.$meta.eventHub.$emit('functionRight:add', { roleId: this.roleId });
          this.$f7router.back();
        });
    },
  },
};

</script>
<style scoped>
</style>
