export default function(Vue) {

  // config
  const config = {
    base: {
      locale: 'en-us',
      jwt: false,
    },
    api: {
      baseURL: '',
    },
    layout: {
      breakpoint: 600,
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
    markdown: {
      style: {
        module: 'a-markdownstyle',
      },
    },
    theme: {
      type: 'builtIn',
      builtIn: {
        layout: 'light',
        bars: 'empty',
        color: 'blue',
        customColor: null,
      },
      thirdParty: null,
    },
    locales: {
      'en-us': 'English',
      'zh-cn': 'Chinese',
    },
    modules: {},
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
