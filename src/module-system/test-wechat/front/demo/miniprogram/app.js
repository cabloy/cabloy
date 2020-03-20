// app.js

const Cabloy = require('./cabloy/index.js');

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 初始化cabloy
    this.cabloy = Cabloy(this);
    // 登录
    this.cabloy.util.login().then(res => {
      // 由于 login 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.cabloyLoginReadyCallback) {
        this.cabloyLoginReadyCallback(res);
      }
    }).catch(err => {
      console.error(err);
    });
  },
  globalData: {
  },
});
