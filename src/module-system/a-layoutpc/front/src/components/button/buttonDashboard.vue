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
  //const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  import ebLayoutButtonBase from '../../common/buttonBase.js';
  return {
    mixins: [ebLayoutButtonBase],
    methods: {
      onPerform() {
        const button = this.$meta.config.module('a-layoutpc').layout.header.button.home;
        if (button) {
          this.$meta.vueLayout.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
        }
      }
    },
  };
}

</script>
