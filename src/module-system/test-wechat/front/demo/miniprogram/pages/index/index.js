// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    user: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: null,
    memberId: null, // for wxwork
    inWxwork: app.cabloy.data.wxwork,
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
    // 判断是否成功取得用户授权
    if (e.detail.errMsg.indexOf(':fail') > -1) return;
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
  getOpenid() {
    app.cabloy.api.post('/test/wechat/test/getOpenidMini', {
      scene: app.cabloy.data.scene,
    }).then(data => {
      this.setData({
        openid: data.openid,
      });
    });
  },
  getMemberId() {
    app.cabloy.api.post('/test/wxwork/test/getMemberId').then(data => {
      this.setData({
        memberId: data.memberId,
      });
    });
  },
});
