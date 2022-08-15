let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    mounted() {
      // console.log(this.$el);
    },
  });
}

// export
export default {
  install,
};
