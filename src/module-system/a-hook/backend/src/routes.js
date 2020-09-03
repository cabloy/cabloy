const hook = require('./controller/hook.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'hook/installHooks', controller: 'hook', middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  return routes;
};
