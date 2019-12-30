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
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});
