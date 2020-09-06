module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // test
    { method: 'post', path: 'test/getOpenid', controller: 'test', middlewares: 'inWechat' },
    { method: 'post', path: 'test/getOpenidMini', controller: 'test', middlewares: 'inWechat',
      meta: {
        inWechat: {
          scene: 'wechatmini',
        },
      },
    },
  ];
  return routes;
};
