module.exports = function(cabloy) {
  return {
    login() {
      return new Promise((resolve, reject) => {
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
                    success: userInfo => {
                      // 后台登录
                      this.__login({ code, userInfo }).then(resolve).catch(reject);
                    },
                  });
                } else {
                  // 虽然没有userInfo，但有openid，仍然可以进行后台登录
                  this.__login({ code, userInfo: null }).then(resolve).catch(reject);
                }
              },
            });
          },
        });
      });
    },
    __login() {
      // 后台登录
      return cabloy.api.post('/a/base/auth/echo').then(data => {
        // user
        cabloy.data.user = data.user;
        // config
        cabloy.data.config = data.config;
        // instance
        cabloy.data.instance = data.instance;
        // ok
        return data;
      }).catch(err => {
        console.log(err);
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
