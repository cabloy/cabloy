const _sceneAll = 'dingtalk,dingtalkweb,dingtalkadmin,dingtalkmini';

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // test
    { method: 'post', path: 'test/getMemberId', controller: 'test', middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
    { method: 'post', path: 'test/sendAppMessage', controller: 'test', middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
  ];
  return routes;
};
