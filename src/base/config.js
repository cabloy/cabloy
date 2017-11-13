import util from './util.js';

export default function(Vue, _config) {

  // config
  const config = _config || {};
  config.modules = config.modules || {};

  // mixin
  Vue.mixin({ beforeCreate() {

    const self = this;

    Object.defineProperty(this, '$config', {
      get() {
        const moduleInfo = util.getModuleInfo(self);
        return config.modules[moduleInfo.relativeName];
      },
    });

  } });

  return config;
}
