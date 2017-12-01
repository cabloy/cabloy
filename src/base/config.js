export default function(Vue, _config) {

  // config
  const config = _config || {};
  config.modules = config.modules || {};

  // mixin
  Vue.mixin({ beforeCreate() {

    const self = this;

    Object.defineProperty(this, '$config', {
      get() {
        const moduleInfo = self.moduleInfo;
        return config.modules[moduleInfo.relativeName];
      },
    });

  } });

  return config;
}
