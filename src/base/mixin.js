import mparse from 'egg-born-mparse';

export default function(Vue, options) {
  // meta
  const meta = Vue.prototype.$meta;

  // config
  meta.config = require('./config.js').default(Vue, options.config);
  // locales
  meta.locales = require('./locales.js').default(Vue, options.locales);

  // mixin
  Vue.mixin({ beforeCreate() {

    // cache route path
    if (this.$parent && this.$parent.__ebRoutePath) {
      this.__ebRoutePath = this.$parent.__ebRoutePath;
    } else if (this.$route) {
      this.__ebRoutePath = this.$route.path;
    }

    // module
    if (this.__ebRoutePath) {
      const moduleInfo = mparse.parseInfo(this.__ebRoutePath);
      this.$module = meta.module.get(moduleInfo.relativeName);
    }

    // mixin store
    meta.store.__beforeCreate(this);
    // mixin api
    meta.api.__beforeCreate(this);
    // mixin config
    meta.config.__beforeCreate(this);
    // mixin locales
    meta.locales.__beforeCreate(this);

  } });

}
