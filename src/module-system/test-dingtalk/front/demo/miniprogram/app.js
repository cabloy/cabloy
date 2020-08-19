const Cabloy = require('./cabloy/index.js');

App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');

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
      console.log(err);
    });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
