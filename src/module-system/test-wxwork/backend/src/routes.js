const version = require('./controller/version.js');
const event = require('./controller/event.js');
const test = require('./controller/test.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // event
    { method: 'post', path: 'event/wxworkMessage', controller: event, middlewares: 'inner,wxwork', meta: { auth: { enable: false } } },
    { method: 'post', path: 'event/loginInfo', controller: event, middlewares: 'inner', meta: { auth: { enable: false } } },
    // test
    { method: 'post', path: 'test/getMemberId', controller: test, middlewares: 'inWxwork',
      meta: {
        inWxwork: {
          scene: 'wxwork,wxworkweb,wxworkmini',
        },
      },
    },
  ];
  return routes;
};
