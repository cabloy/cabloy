export default function (Vue) {
  // beforeCreates
  const beforeCreates = [];

  // store
  init('store', require('./mixin/store.js'));
  // pinia
  init('pinia', require('./mixin/pinia.js'));
  // api
  init('api', require('./mixin/api.js'));
  // config
  init(null, require('./mixin/config.js'));
  // locales
  init('locales', require('./mixin/locales.js'));
  // component
  init(null, require('./mixin/component.js'));

  // mixin
  Vue.mixin({
    beforeCreate() {
      // mixin module
      mixinModule(this);

      // mixins
      for (const _beforeCreate of beforeCreates) {
        _beforeCreate && _beforeCreate(this);
      }
    },
  });

  function init(key, instance) {
    const res = instance.default(Vue);
    if (key && res[key]) Vue.prototype.$meta[key] = res[key];
    beforeCreates.push(res.beforeCreate);
  }

  function mixinModule(ctx) {
    if (!ctx.$module) {
      const relativeName =
        Object.getPrototypeOf(ctx.$options).__ebModuleRelativeName || ctx.$options.__ebModuleRelativeName;
      if (relativeName) {
        ctx.$module = ctx.$meta.module.get(relativeName);
      }
    }
    if (!ctx.$module && ctx.$parent) {
      ctx.$module = ctx.$parent.$module;
    }
  }
}
