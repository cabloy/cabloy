export default function(Vue) {

  // config
  const config = {
    modules: {},
    layout: {
      breakpoint: 800,
      items: {
        mobile: {
          module: 'a-layoutmobile',
          component: 'layout',
        },
        // pc: {
        //   module: 'a-layoutmobile',
        //   login: '/a/login/login',
        //   loginOnStart: false,
        // },
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
