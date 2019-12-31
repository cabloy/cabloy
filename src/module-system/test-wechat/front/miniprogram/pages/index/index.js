// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    user: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad() {
    if (app.cabloy.data.user) {
      this.setData({
        user: app.cabloy.data.user.op,
        hasUserInfo: !!app.cabloy.data.user.op.userName,
      });
    } else {
      app.cabloyLoginReadyCallback = res => {
        this.setData({
          user: res.op,
          hasUserInfo: !!res.op.userName,
        });
      };
    }
  },
  getUserInfo(e) {
    // 登录
    app.cabloy.util.login({ detail: e.detail }).then(res => {
      this.setData({
        user: res.op,
        hasUserInfo: !!res.op.userName,
      });
    }).catch(err => {
      console.log(err);
    });
  },
});
