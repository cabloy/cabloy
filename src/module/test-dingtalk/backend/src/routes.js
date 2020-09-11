const _sceneAll = 'dingtalk,dingtalkweb,dingtalkadmin,dingtalkmini';

module.exports = app => {
  const routes = [
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
