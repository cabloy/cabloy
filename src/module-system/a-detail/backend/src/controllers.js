const base = require('./controller/base.js');
const detail = require('./controller/detail.js');

module.exports = app => {
  const controllers = {
    base,
    detail,
  };
  return controllers;
};
