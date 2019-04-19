const validation = require('./controller/validation.js');
const test = require('./controller/test.js');

module.exports = app => {
  let routes = [
    { method: 'post', path: 'validation/schema', controller: validation },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
      { method: 'post', path: 'test/validate1', controller: test, middlewares: 'test,validate',
        meta: { validate: { validator: 'test' } },
      },
      { method: 'post', path: 'test/validate2', controller: test, middlewares: 'test,validate',
        meta: { validate: { validator: 'test' } },
      },
      { method: 'post', path: 'test/validate3', controller: test, middlewares: 'test,validate',
        meta: { validate: { validator: 'test', schema: 'extra' } },
      },
    ]);
  }
  return routes;
};
