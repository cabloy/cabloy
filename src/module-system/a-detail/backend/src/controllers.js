const detail = require('./controller/detail.js');

module.exports = app => {
  const controllers = {
    detail,
  };
  return controllers;
};
