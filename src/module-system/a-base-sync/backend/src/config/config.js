// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    inner: {
      bean: 'inner',
      global: false,
    },
    test: {
      bean: 'test',
      global: false,
    },
    transaction: {
      bean: 'transaction',
      global: false,
    },
    cors: {
      bean: 'cors',
      global: true,
      dependencies: 'instance',
    },
    auth: {
      bean: 'auth',
      global: true,
      dependencies: 'instance',
      ignore: /\/version\/(update|init|test)/,
    },
    right: {
      bean: 'right',
      global: true,
      dependencies: 'auth',
    },
    jsonp: {
      bean: 'jsonp',
      global: false,
      dependencies: 'instance',
    },
    httpLog: {
      bean: 'httpLog',
      global: false,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    registerPassport: {
      bean: 'registerPassport',
    },
    installAuthProviders: {
      bean: 'installAuthProviders',
      instance: true,
    },
    loadSchedules: {
      bean: 'loadSchedules',
      instance: true,
      debounce: true,
    },
    loadAtomStatics: {
      bean: 'loadAtomStatics',
      instance: true,
      debounce: true,
    },
    checkResourceLocales: {
      bean: 'checkResourceLocales',
      instance: true,
      debounce: true,
    },
  };

  // queues
  config.queues = {
    schedule: {
      bean: 'schedule',
    },
    roleBuild: {
      bean: 'roleBuild',
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

  config.cors = {
    whiteList: 'http://localhost',
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
      mobile: 'a-authsms',
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

  // user
  config.user = {
    privacyFields: 'createdAt,updatedAt,realName,locale,email,mobile,activated,emailConfirmed,mobileVerified',
  };

  // configFront
  config.configFront = {
    site: {
      cover: '/api/static/a/base/img/cabloy.png',
    },
  };

  return config;
};
