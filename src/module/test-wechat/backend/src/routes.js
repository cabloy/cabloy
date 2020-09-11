module.exports = app => {
  const routes = [
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
