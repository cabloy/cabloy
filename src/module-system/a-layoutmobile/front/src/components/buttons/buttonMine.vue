<template>
  <eb-link-color
    :class="buttonClass"
    :iconMaterial="buttonIcon && buttonIcon.material"
    :iconF7="buttonIcon && buttonIcon.f7"
    :text="buttonLabel"
    :onPerform="onPerformClick"
    :stats_params="{ module: 'a-user', name: 'user' }"
  ></eb-link-color>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    mounted() {
      this._checkSpecialPath();
    },
    created() {
      this.$meta.eventHub.$on('appMine:open', this.onAppMineOpen);
    },
    beforeDestroy() {
      this.$meta.eventHub.$off('appMine:open', this.onAppMineOpen);
    },
    methods: {
      onAppMineOpen() {
        this.onPerformClick();
      },
      _checkSpecialPath() {
        const query = this.$utils.parseUrlQuery();
        const path = query && query.__to;
        if (!path) return false;
        if (path === 'mine') {
          this.onPerformClick();
        }
      },
    },
  };
}
</script>
