<template>
  <eb-link iconMaterial="dashboard" :onPerform="onPerform"></eb-link>
</template>
<script>
// export
export default {
  install,
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    methods: {
      onPerform() {
        const url = '/a/dashboard/dashboard';
        const scene = 'dashboard';
        const sceneOptions = { name: 'home' };
        this.$vueLayout.navigate(url, { scene, sceneOptions });
      }
    },
  };
}

</script>
