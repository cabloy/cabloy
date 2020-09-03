const version = require('./controller/version.js');
const monkeyer = require('./controller/monkeyer.js');

module.exports = app => {
  const controllers = {
    version,
    monkeyer,
  };
  return controllers;
};
