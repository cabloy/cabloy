const version = require('./controller/version.js');
const db = require('./controller/db.js');
const broadcast = require('./controller/broadcast.js');

module.exports = app => {
  const controllers = {
    version,
    db,
    broadcast,
  };
  return controllers;
};
