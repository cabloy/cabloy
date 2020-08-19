// 获取应用实例
const app = getApp();

Page({
  data: {
    user: null,
    memberId: null,
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    if (app.cabloy.data.user) {
      this.setData({
        user: app.cabloy.data.user.op,
      });
    } else {
      app.cabloyLoginReadyCallback = res => {
        app.cabloyLoginReadyCallback = null;
        this.setData({
          user: res.op,
        });
      };
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
  getMemberId() {
    app.cabloy.api.post('/test/dingtalk/test/getMemberId').then(data => {
      this.setData({
        memberId: data.memberId,
      });
    });
  },
});
