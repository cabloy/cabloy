const configDefault = {
  container: null,
  scene: 'default',
  api: {
    baseURL: 'https://demo.cabloy.com',
  },
};

module.exports = function (cabloy, options) {
  let _instance = null;
  let _user = null;
  let _cookies = null;

  // config
  let _config = cabloy.util.extend({}, configDefault, options);

  // systemInfo 
  let _wxSystemInfo = typeof wx !== 'undefined' && wx.getSystemInfoSync();

  // container
  let _container;
  if (typeof dd !== 'undefined') {
    _container = 'dingtalk';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment !== 'wxwork') {
    _container = 'wechat';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment === 'wxwork') {
    _container = 'wxwork';
  }
  _config.container = _container;

  return {
    get wxSystemInfo() {
      return _wxSystemInfo;
    },
    get dingtalk() {
      return _container === 'dingtalk';
    },
    get wechat() {
      return _container === 'wechat';
    },
    get wxwork() {
      return _container === 'wxwork';
    },
    get cookies() {
      return _cookies;
    },
    set cookies(value) {
      _cookies = cabloy.util.extend({}, _cookies, value);
    },
    get user() {
      return _user;
    },
    set user(value) {
      _user = value;
    },
    get loggedIn() {
      const user = this.user;
      return user && user.agent.anonymous === 0;
    },
    get config() {
      return _config;
    },
    set config(value) {
      _config = cabloy.util.extend({}, _config, value);
    },
    get instance() {
      return _instance;
    },
    set instance(value) {
      _instance = value;
    },
  };
};
