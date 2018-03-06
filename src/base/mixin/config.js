export default function(Vue) {

  // config
  const config = {};

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$config', {
      get() {
        const moduleInfo = ctx.$module.info;
        return config.modules[moduleInfo.relativeName];
      },
    });
  };

  return { config, beforeCreate };
}
