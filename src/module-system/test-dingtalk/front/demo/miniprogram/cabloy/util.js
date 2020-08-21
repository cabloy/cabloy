module.exports = function(cabloy) {
  return {
    preferredLocale(locale) {
      locale = locale.toLowerCase().replace(/_/g, '-');
      const locales = cabloy.config.locales;
      // match exactly
      if (locales[locale]) return locale;
      // match fuzzy
      const localeShort = locale.split('-')[0];
      return Object.keys(locales).find(item => item.indexOf(localeShort) === 0);
    },

    login(options) {
      if (cabloy.data.dingtalk) {
        return this.__login_dingtalk(options);
      } else if (cabloy.data.wechat) {
        return this.__login_wechat(options);
      } else if (cabloy.data.wxwork) {
        return this.__login_wxwork(options);
      }
    },

    __login_wechat(options) {
      return new Promise((resolve, reject) => {
        const scene = cabloy.config.base.scene;
        if (options && options.detail) {
          // 直接进行后台登录
          this.__login({ scene, code: null, detail: options.detail }).then(resolve).catch(reject);
        } else {
          // 小程序登录
          wx.login({
            success: res => {
              const code = res.code;
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: detail => {
                        // 后台登录
                        this.__login({ scene, code, detail }).then(resolve).catch(reject);
                      },
                    });
                  } else {
                    // 虽然没有userInfo，但有openid，仍然可以进行后台登录
                    this.__login({ scene, code, detail: null }).then(resolve).catch(reject);
                  }
                },
              });
            },
          });
        }
      });
    },

    __login_wxwork(options) {
      return new Promise((resolve, reject) => {
        // 小程序登录
        wx.qy.login({
          success: res => {
            const scene = cabloy.config.base.scene;
            const code = res.code;
            this.__login({ scene, code }).then(resolve).catch(reject);
          },
        });
      });
    },

    __login_dingtalk(options) {
      return new Promise((resolve, reject) => {
        // 小程序登录
        dd.getAuthCode({
          success: res => {
            const scene = cabloy.config.base.scene;
            const code = res.authCode;
            this.__login({ scene, code }).then(resolve).catch(reject);
          },
        });
      });
    },

    __login({ scene, code, detail }) {
      // 后台登录
      const url = `/a/${cabloy.data.container}/authMini/login?locale=${cabloy.data.locale}`;
      return cabloy.api.post(url, { scene, code, detail }).then(data => {
        // user
        cabloy.data.user = data.user;
        // instance
        cabloy.data.instance = data.instance;
        // config
        cabloy.config = data.config;
        // ok
        return data.user;
      });
    },

    isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },

    extend(...args) {
      let deep = true;
      let to;
      let from;
      if (typeof args[0] === 'boolean') {
        deep = args[0];
        to = args[1];
        args.splice(0, 2);
        from = args;
      } else {
        to = args[0];
        args.splice(0, 1);
        from = args;
      }
      for (let i = 0; i < from.length; i += 1) {
        const nextSource = args[i];
        if (nextSource !== undefined && nextSource !== null) {
          const keysArray = Object.keys(Object(nextSource));
          for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            const nextKey = keysArray[nextIndex];
            const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              if (!deep) {
                to[nextKey] = nextSource[nextKey];
              } else if (this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                this.extend(to[nextKey], nextSource[nextKey]);
              } else if (!this.isObject(to[nextKey]) && this.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                this.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }
      return to;
    },
  };
};
