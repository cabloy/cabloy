const event = require('./controller/event.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'event/installEvents', controller: event, middlewares: 'inner',
      meta: {
        instance: { enable: false },
      },
    },
  ];
  return routes;
};
