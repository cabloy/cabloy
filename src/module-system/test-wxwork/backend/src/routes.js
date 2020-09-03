const _sceneAll = 'wxwork,wxworkweb,wxworkmini';

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // test
    { method: 'post', path: 'test/getMemberId', controller: 'test', middlewares: 'inWxwork',
      meta: {
        inWxwork: {
          scene: _sceneAll,
        },
      },
    },
    { method: 'post', path: 'test/sendAppMessage', controller: 'test', middlewares: 'inWxwork',
      meta: {
        inWxwork: {
          scene: _sceneAll,
        },
      },
    },
  ];
  return routes;
};
