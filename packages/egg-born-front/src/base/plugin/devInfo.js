let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  function setDevInfo(ctx) {
    const self = ctx;
    if (!self.$el || !self.$el.setAttribute) return;
    const _componentTag = self.$options._componentTag;
    if (_componentTag) {
      self.$el.setAttribute('data-dev-component-tag', _componentTag);
    }
    const relativeName =
      Object.getPrototypeOf(self.$options).__ebModuleRelativeName || self.$options.__ebModuleRelativeName;
    if (relativeName) {
      self.$el.setAttribute('data-dev-component-module', relativeName);
    }
    const fileName = Object.getPrototypeOf(self.$options).__file || self.$options.__file;
    if (fileName) {
      self.$el.setAttribute('data-dev-component-file', fileName);
    }
  }

  Vue.mixin({
    mounted() {
      setDevInfo(this);
    },
  });
}

// export
export default {
  install,
};
