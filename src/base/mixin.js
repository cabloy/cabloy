export default function(Vue) {

  // beforeCreates
  const beforeCreates = [];

  // store
  init('store', require('./mixin/store.js'));
  // api
  init('api', require('./mixin/api.js'));
  // config
  init('config', require('./mixin/config.js'));
  // locales
  init('locales', require('./mixin/locales.js'));
  // component
  init(null, require('./mixin/component.js'));

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
    if (key && res[key]) Vue.prototype.$meta[key] = res[key];
    beforeCreates.push(res.beforeCreate);
  }

  function mixinModule(ctx) {
    if (!ctx.$module) {
      const relativeName = ctx.$options.__proto__.__ebModuleRelativeName;
      if (relativeName) {
        ctx.$module = ctx.$meta.module.get(relativeName);
        if (!ctx.$module.adjustHref) {
          ctx.$module.adjustHref = href => {
            if (!href || typeof href !== 'string') return href;
            const first = href.charAt(0);
            if (first === '/' || first === '#') return href;
            return `/${ctx.$module.info.url}/${href}`;
          };
        }
      }
    }
    if (!ctx.$module && ctx.$parent) {
      ctx.$module = ctx.$parent.$module;
    }
  }

}
