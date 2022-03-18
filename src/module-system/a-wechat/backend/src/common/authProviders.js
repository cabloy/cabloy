const providers = {
  wechat: {
    authProvider: 'wechat',
    title: 'Wechat Public',
    client: 'wechat',
    configKey: 'public',
    scope: 'snsapi_userinfo',
  },
  wechatweb: {
    authProvider: 'wechatweb',
    title: 'Wechat Web',
    client: 'wechatweb',
    configKey: 'web',
    scope: 'snsapi_login',
  },
  wechatmini: {
    authProvider: 'wechatmini',
    title: 'Wechat Miniprogram',
    scope: 'snsapi_userinfo',
  },
};

module.exports = providers;
