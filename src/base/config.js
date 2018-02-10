export default function(Vue, _config) {

  // config
  const config = _config || {};
  config.modules = config.modules || {};

  // beforeCreate
  Object.defineProperty(config, '__beforeCreate', {
    enumerable: false,
    get() {
      return function(ctx) {
        return __beforeCreate(ctx);
      };
    },
  });

  function __beforeCreate(ctx) {
    Object.defineProperty(ctx, '$config', {
      get() {
        const moduleInfo = ctx.$module.info;
        return config.modules[moduleInfo.relativeName];
      },
    });
  }

  return config;
}
