const db = require('./controller/db.js');

module.exports = app => {
  const controllers = {
    db,
  };
  return controllers;
};
