const monkeyer = require('./controller/monkeyer.js');

module.exports = app => {
  const controllers = {
    monkeyer,
  };
  return controllers;
};
