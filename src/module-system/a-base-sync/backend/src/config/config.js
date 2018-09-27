// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    base: {
      global: true,
      dependencies: 'instance',
    },
    auth: {
      global: true,
      dependencies: 'base,sequence',
      ignore: /\/version\/(start|check|update|init)/,
    },
    right: {
      global: true,
      dependencies: 'auth,validation',
    },
  };

  // startups
  config.startups = {
    installAuthProviders: {
      type: 'all',
      path: 'auth/installAuthProviders',
    },
    clearFunctionLocales: {
      type: 'worker',
      path: 'function/clearLocales',
    },
  };

  // queues
  config.queues = {
    checkFunctionLocale: {
      path: 'function/checkLocale',
    },
    registerFunction: {
      path: 'function/register',
    },
    registerAtomAction: {
      path: 'atomAction/register',
    },
    registerAtomClass: {
      path: 'atomClass/register',
    },
  };

  // locales
  config.locales = {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  };
  // anonymous
  config.anonymous = {
    maxAge: 365 * 24 * 3600 * 1000, // 365 天
  };
  // registered or rememberMe
  config.registered = {
    maxAge: 30 * 24 * 3600 * 1000, // 30 天
  };
  // checkUserName
  config.checkUserName = false;
  // signupRoleName
  config.signupRoleName = 'registered';

  // comment
  config.comment = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
  };

  return config;
};
