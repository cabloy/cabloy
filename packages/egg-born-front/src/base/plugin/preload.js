let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    mounted() {
      console.log('meta: ', this.$options.meta);
    },
  });
}

// export
export default {
  install,
};
