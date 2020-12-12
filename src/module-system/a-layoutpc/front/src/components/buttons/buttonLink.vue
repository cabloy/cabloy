<template>
  <eb-link :class="buttonClass" :iconMaterial="buttonIcon" :text="buttonLabel" :onPerform="onPerform"></eb-link>
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
    computed: {
      buttonConfig() {
        return this.button.options.resourceConfig;
      },
      buttonIcon() {
        return this.buttonConfig.icon && this.buttonConfig.icon.material;
      },
      buttonLabel() {
        if (!this.buttonConfig.showLabel) return null;
        return this.button.options.titleLocale;
      },
      buttonClass() {
        return {
          'header-button-separator': this.buttonConfig.showSeparator,
        };
      },
    },
    methods: {
      onPerform() {
        const action = this.$utils.extend({}, this.buttonConfig, {
          navigateOptions: {
            scene: this.buttonConfig.scene,
            sceneOptions: this.buttonConfig.sceneOptions,
          },
        });
        this.$meta.util.performAction({ ctx: this, action, item: null });
      },
    },
  };
}

</script>
