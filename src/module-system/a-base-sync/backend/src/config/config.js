// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    cors: {
      global: true,
      dependencies: 'instance',
    },
    auth: {
      global: true,
      dependencies: 'instance',
      ignore: /\/version\/(update|init|test)/,
    },
    right: {
      global: true,
      dependencies: 'auth',
    },
    jsonp: {
      global: false,
      dependencies: 'instance',
    },
    httpLog: {
      global: false,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    loadSchedules: {
      bean: 'loadSchedules',
      debounce: true,
    },
    installAuthProviders: {
      bean: 'installAuthProviders',
    },
    setFunctionLocales: {
      bean: 'setFunctionLocales',
      instance: true,
      debounce: true,
    },
  };

  // queues
  config.queues = {
    registerFunction: {
      bean: 'registerFunction',
    },
    registerAtomAction: {
      bean: 'registerAtomAction',
    },
    registerAtomClass: {
      bean: 'registerAtomClass',
    },
    registerAuthProvider: {
      bean: 'registerAuthProvider',
    },
    schedule: {
      bean: 'schedule',
    },
    startup: {
      bean: 'startup',
      // concurrency: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    authProviderChanged: {
      bean: 'authProviderChanged',
    },
  };

  // pageSize
  config.pageSize = 20;

  // locales
  config.locales = {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  };

  // function
  config.function = {
    scenes: {
      1: 'demonstration,create,list,tools', // menu
    },
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
    activationProviders: {
      mobile: '', // a-authsms recommended
      email: 'a-authsimple',
    },
    url: {
      // url is specified by activation provider
      //   emailConfirm: '/a/authsimple/emailConfirm',
      //   mobileVerify: '',
      //   passwordChange: '/a/authsimple/passwordChange',
      //   passwordForgot: '/a/authsimple/passwordForgot',
      //   passwordReset: '/a/authsimple/passwordReset',
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

  // auth
  config.auth = {
    avatar: {
      timeout: 5000,
      default: 'https://cabloy.com/plugins/cms-pluginbase/assets/images/avatar_user.png',
    },
  };

  return config;
};
