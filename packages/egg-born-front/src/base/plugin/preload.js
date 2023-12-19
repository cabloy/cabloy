let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    mounted() {
      const meta = this.$options.meta;
      this.$meta.module.preloadModules(meta && meta.preloads);
    },
  });
}

// export
export default {
  install,
};
