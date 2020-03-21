<template>
  <eb-link :iconMaterial="isFullscreen?'fullscreen_ex':'fullscreen'" :onPerform="onPerform"></eb-link>
</template>
<script>
import screenfull from 'screenfull';

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
    data() {
      return {
        isFullscreen: false,
      }
    },
    created() {
      if (!screenfull.isEnabled) {
        this.button.hide();
      } else {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen;
        });
      }
    },
    methods: {
      onPerform() {
        screenfull.toggle();
      }
    },
  };
}

</script>
