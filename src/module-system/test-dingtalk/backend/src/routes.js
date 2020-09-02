const version = require('./controller/version.js');
const event = require('./controller/event.js');
const test = require('./controller/test.js');

const _sceneAll = 'dingtalk,dingtalkweb,dingtalkadmin,dingtalkmini';

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // event
    { method: 'post', path: 'event/dingtalkCallback', controller: event, middlewares: 'inner,dingtalk', meta: { auth: { enable: false } } },
    // test
    { method: 'post', path: 'test/getMemberId', controller: test, middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
    { method: 'post', path: 'test/sendAppMessage', controller: test, middlewares: 'inDingtalk',
      meta: {
        inDingtalk: {
          scene: _sceneAll,
        },
      },
    },
  ];
  return routes;
};
