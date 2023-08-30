let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    mounted() {
      this.$nextTick(() => {
        this.$emit('componentMounted', this);
      });
    },
  });
}

// export
export default {
  install,
};
