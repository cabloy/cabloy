<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Basic Admin')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of functions" :key="item.id" link="#" :eb-href="getFunction(item).actionPath" :title="getFunctionTitle(item)">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
const ebFunctions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebFunctions;
export default {
  mixins: [ebFunctions],
  data() {
    return {
      functions: null,
    };
  },
  created() {
    this.__loadFunctions();
  },
  methods: {
    __loadFunctions() {
      const functions = [
        { module: 'a-baseadmin', name: 'menu' },
      ];
      this.$api.post('/a/base/function/check', { functions }).then(data => {
        this.functions = data.filter(item => item.passed);
      });
    },
  },
};

</script>
