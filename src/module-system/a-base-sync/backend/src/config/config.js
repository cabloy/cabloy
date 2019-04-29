// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    base: {
      global: true,
      dependencies: 'instance,event',
    },
    auth: {
      global: true,
      dependencies: 'base,sequence',
      ignore: /\/version\/(update|init|test)/,
    },
    right: {
      global: true,
      dependencies: 'auth,validation',
    },
    jsonp: {
      global: false,
    },
    httpLog: {
      global: false,
      dependencies: 'instance',
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
    registerAuthProvider: {
      path: 'auth/register',
    },
  };

  // pageSize
  config.pageSize = 20;

  // locales
  config.locales = {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  };
  // anonymous
  config.anonymous = {
    maxAge: 365 * 24 * 3600 * 1000, // 365 天
  };
  // authenticated or rememberMe
  config.authenticated = {
    maxAge: 30 * 24 * 3600 * 1000, // 30 天
  };
  // checkUserName
  config.checkUserName = true;
  // account
  config.account = {
    needActivation: true,
    activationWays: 'mobile,email',
    url: {
      emailConfirm: '/a/authsimple/emailConfirm',
      mobileVerify: '',
      passwordChange: '/a/authsimple/passwordChange',
      passwordForgot: '/a/authsimple/passwordForgot',
      passwordReset: '/a/authsimple/passwordReset',
    },
    //  default is 'activated', if need activating by mobile/email, then add to 'registered' first
    activatedRoles: 'activated',
  };

  // public dir
  config.publicDir = '';

  // comment
  config.comment = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
  };

  // httpLog
  config.httpLog = true;

  return config;
};
