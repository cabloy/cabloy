const version = require('./controller/version.js');
const db = require('./controller/db.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'db/set', controller: db, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
  ];
  return routes;
};
