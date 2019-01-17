const test = require('./controller/test.js');
const event = require('./controller/event.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'event/installEvents', controller: event, middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  if (app.meta.isTest) {
    routes = routes.concat([
      { method: 'post', path: 'test/test', controller: test, middlewares: 'test' },
      { method: 'post', path: 'test/eventTest', controller: test, middlewares: 'test', meta: { auth: { enable: false } } },
    ]);
  }
  return routes;
};
