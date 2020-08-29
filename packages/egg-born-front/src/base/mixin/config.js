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

  Vue.prototype.$meta._configOriginal = config;
  Object.defineProperty(Vue.prototype.$meta, 'config', {
    get() {
      const loginInfo = Vue.prototype.$meta.store.getState('auth/loginInfo');
      const loginConfig = loginInfo && loginInfo.config;
      if (!loginConfig) return config;
      return Vue.prototype.$utils.extend({}, config, loginConfig);
    },
  });

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$config', {
      get() {
        const moduleInfo = ctx.$module.info;
        return Vue.prototype.$meta.config.modules[moduleInfo.relativeName];
      },
    });
  };

  return { config, beforeCreate };
}
