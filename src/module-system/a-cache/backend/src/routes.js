const version = require('./controller/version.js');
const db = require('./controller/db.js');
const broadcast = require('./controller/broadcast.js');

module.exports = app => {
  const routes = [
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'db/set', controller: db, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // broadcast
    { method: 'post', path: 'broadcast/memRemove', controller: broadcast, middlewares: 'inner' },
    { method: 'post', path: 'broadcast/memClear', controller: broadcast, middlewares: 'inner' },
  ];
  return routes;
};
