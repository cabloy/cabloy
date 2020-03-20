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
        const button = this.$config.layout.header.button.home;
        if (button) {
          this.$meta.vueLayout.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
        }
      }
    },
  };
}

</script>
