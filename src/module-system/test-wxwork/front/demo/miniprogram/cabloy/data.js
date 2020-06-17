const configDefault = {
  api: {
    baseURL: 'https://demo.cabloy.com',
  },
};

module.exports = function(cabloy) {
  return {
    get cookies() {
      return cabloy.app.globalData.__cabloy_cookies;
    },
    set cookies(value) {
      cabloy.app.globalData.__cabloy_cookies = cabloy.util.extend({}, cabloy.app.globalData.__cabloy_cookies, value);
    },
    get user() {
      return cabloy.app.globalData.__cabloy_user;
    },
    set user(value) {
      cabloy.app.globalData.__cabloy_user = value;
    },
    get loggedIn() {
      const user = this.user;
      return user && user.agent.anonymous === 0;
    },
    get config() {
      const config = cabloy.app.globalData.__cabloy_config;
      return config || configDefault;
    },
    set config(value) {
      cabloy.app.globalData.__cabloy_config = cabloy.util.extend({}, configDefault, value);
    },
    get instance() {
      return cabloy.app.globalData.__cabloy_instance;
    },
    set instance(value) {
      cabloy.app.globalData.__cabloy_instance = value;
    },
  };
};
