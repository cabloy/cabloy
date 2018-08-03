const test = require('./controller/test.js');
const hook = require('./controller/hook.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'hook/installHooks', controller: hook, middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  if (app.meta.isTest) {
    routes = routes.concat([
      { method: 'post', path: 'test/test', controller: test, middlewares: 'test' },
      { method: 'post', path: 'test/hookTestBefore', controller: test, middlewares: 'test' },
      { method: 'post', path: 'test/hookTestAfter', controller: test, middlewares: 'test' },
    ]);
  }
  return routes;
};
