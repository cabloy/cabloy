<template>
  <eb-link iconMaterial="home" :onPerform="onPerform"></eb-link>
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
    mixins: [ ebLayoutButtonBase ],
    created() {
      const button = this.getButton();
      if (!button) {
        this.button.hide();
      }
    },
    methods: {
      getButton() {
        return this.$config.layout.header.button.home;
      },
      onPerform() {
        const button = this.getButton();
        if (button) {
          this.$meta.vueLayout.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
        }
      },
    },
  };
}

</script>
