<template>
  <eb-link
    :class="buttonClass"
    :iconF7="this.$meta.util.screenfull.isFullscreen ? '::fullscreen-exit' : '::fullscreen'"
    :tooltip="this.$meta.util.screenfull.isFullscreen ? this.$text('Exit Fullscreen') : this.$text('Fullscreen')"
    :onPerform="onPerform"
  ></eb-link>
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
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    created() {
      if (!this.$meta.util.screenfull.isEnabled) {
        this.button.hide();
      }
    },
    methods: {
      onPerform() {
        this.$meta.util.screenfull.toggle();
      },
    },
  };
}
</script>
