/** @module egg-born-front/base/config */

/** front base config
 * @todo welcome to pr
 * @name config
 * @property {object} base
 * @property {string} base.locale='en-us'
 * @property {boolean} base.jwt=false
 * @property {object} nprogress
 * @property {number} nprogress.debounce=500
 * @property {object} api
 * @property {string} api.baseURL=''
 * @property {boolean} api.debounce=200
 */

export default function (Vue) {
  // config
  const config = {
    base: {
      locale: 'en-us',
      jwt: false,
    },
    nprogress: {
      debounce: 500,
    },
    api: {
      baseURL: '',
      debounce: 200,
    },
    preload: {
      delay: 500,
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
      notification: {
        closeTimeout: -1,
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
  const beforeCreate = function (ctx) {
    Object.defineProperty(ctx, '$config', {
      get() {
        const moduleInfo = ctx.$module.info;
        return Vue.prototype.$meta.config.modules[moduleInfo.relativeName];
      },
    });
  };

  return { config, beforeCreate };
}
