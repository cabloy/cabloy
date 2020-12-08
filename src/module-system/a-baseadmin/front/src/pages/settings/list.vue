<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Basic Admin')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="functionsAll">
      <eb-list-item v-for="item of functions" :key="item.atomId" link="#" :title="__getFunctionTitle(item)" :context="item" :onPerform="onPerformClick">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      ready: false,
      functionsAll: null,
      functions: null,
    };
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.functionsAll = await this.$store.dispatch('a/base/getResources', { resourceType: 'a-base:function' });
      await this.__loadFunctions();
      this.ready = true;
    },
    __getFunctionTitle(item) {
      const func = this.functionsAll[item.atomStaticKey];
      if (!func) return '';
      return func.atomNameLocale;
    },
    async __loadFunctions() {
      const functions = [
        { module: 'a-baseadmin', name: 'user' },
        { module: 'a-baseadmin', name: 'role' },
        { module: 'a-baseadmin', name: 'atomRight' },
        { module: 'a-baseadmin', name: 'auth' },
        { module: 'a-baseadmin', name: 'category' },
        { module: 'a-baseadmin', name: 'tag' },
      ];
      const atomStaticKeys = functions.map(item => `${item.module}:${item.name}`);
      const data = await this.$api.post('/a/base/resource/check', { atomStaticKeys });
      this.functions = data.filter(item => item.passed);
    },
    onPerformClick(event, item) {
      const func = this.functionsAll[item.atomStaticKey];
      if (!func) {
        this.$view.toast.show({ text: this.$text('Please Reload App') });
        return;
      }
      const resourceConfig = JSON.parse(func.resourceConfig);
      return this.$meta.util.performAction({ ctx: this, action: resourceConfig });
    },
  },
};

</script>
