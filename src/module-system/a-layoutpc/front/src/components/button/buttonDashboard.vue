<template>
  <eb-link :iconMaterial="iconDashboard()" :onPerform="onPerform"></eb-link>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
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
      iconDashboard() {
        const button = this.getButton();
        return (button && button.iconMaterial) || 'dashboard';
      },
      getButton() {
        return this.$config.layout.header.button.dashboard;
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
