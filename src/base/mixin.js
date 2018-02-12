export default function(Vue) {

  // beforeCreates
  const beforeCreates = [];

  // store
  init('store', require('./store.js'));
  // api
  init('api', require('./api.js'));
  // config
  init('config', require('./config.js'));
  // locales
  init('locales', require('./locales.js'));

  // mixin
  Vue.mixin({ beforeCreate() {

    // mixin module
    mixinModule(this);

    // mixins
    for (const _beforeCreate of beforeCreates) {
      _beforeCreate(this);
    }

  } });

  function init(key, instance) {
    const res = instance.default(Vue);
    Vue.prototype.$meta[key] = res[key];
    beforeCreates.push(res.beforeCreate);
  }

  function mixinModule(ctx) {
    if (!ctx.$module) {
      const relativeName = ctx.$options.__proto__.__ebModuleRelativeName;
      if (relativeName)ctx.$module = ctx.$meta.module.get(relativeName);
    }
    if (!ctx.$module && ctx.$parent) {
      ctx.$module = ctx.$parent.$module;
    }
  }

}
