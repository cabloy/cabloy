module.exports = function(cabloy, options) {
  let _instance = null;
  let _user = null;
  let _jwt = null;
  let _locale = null;

  // systemInfo
  const _wxSystemInfo = typeof wx !== 'undefined' && wx.getSystemInfoSync();
  const _ddSysmtemInfo = typeof dd !== 'undefined' && dd.getSystemInfoSync();

  // container
  let _container;
  if (typeof dd !== 'undefined') {
    _container = 'dingtalk';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment !== 'wxwork') {
    _container = 'wechat';
  } else if (typeof wx !== 'undefined' && _wxSystemInfo.environment === 'wxwork') {
    _container = 'wxwork';
  }

  return {
    get systemInfo() {
      return _wxSystemInfo || _ddSysmtemInfo;
    },
    get container() {
      return _container;
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
    get jwt() {
      return _jwt;
    },
    set jwt(value) {
      _jwt = value;
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
    get instance() {
      return _instance;
    },
    set instance(value) {
      _instance = value;
    },
    get locale() {
      // systemInfo
      if (!_locale) {
        _locale = cabloy.util.preferredLocale(this.systemInfo.language);
      }
      // config
      if (!_locale) {
        _locale = cabloy.config.base.locale;
      }
      // default
      if (!_locale) {
        _locale = 'en-us';
      }
      return _locale;
    },
  };
};
