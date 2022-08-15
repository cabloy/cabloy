let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    mounted() {
      if (!this.$el.setAttribute) return;
      const _componentTag = this.$options._componentTag;
      if (_componentTag) {
        this.$el.setAttribute('data-dev-component-tag', _componentTag);
      }
      const relativeName =
        Object.getPrototypeOf(this.$options).__ebModuleRelativeName || this.$options.__ebModuleRelativeName;
      if (relativeName) {
        this.$el.setAttribute('data-dev-component-module', relativeName);
      }
      const fileName = Object.getPrototypeOf(this.$options).__file || this.$options.__file;
      if (fileName) {
        this.$el.setAttribute('data-dev-component-file', fileName);
      }
    },
  });
}

// export
export default {
  install,
};
