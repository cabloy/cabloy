import util from './util.js';

export default function(Vue, _config) {

  // config
  const config = _config || {};
  config.module = config.module || {};

  // mixin
  Vue.mixin({ beforeCreate() {

    const self = this;

    Object.defineProperty(this, '$config', {
      get() {
        const moduleInfo = util.getModuleInfo(self);
        return config.module[moduleInfo.relativeName];
      },
    });

  } });

  return config;
}
