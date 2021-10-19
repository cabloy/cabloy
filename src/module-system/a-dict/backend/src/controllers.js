const dict = require('./controller/dict.js');

module.exports = app => {
  const controllers = {
    dict,
  };
  return controllers;
};
