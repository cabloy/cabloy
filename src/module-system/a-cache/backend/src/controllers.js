const version = require('./controller/version.js');
const db = require('./controller/db.js');

module.exports = app => {
  const controllers = {
    version,
    db,
  };
  return controllers;
};
