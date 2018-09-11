export default function(Vue) {

  // config
  const config = {
    modules: {},
    layout: {
      color: '',
      breakpoint: 800,
      items: {
        mobile: {
          module: 'a-layoutmobile',
          component: 'layout',
        },
        pc: {
          module: 'a-layoutpc',
          component: 'layout',
        },
      },
    },
  };

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
