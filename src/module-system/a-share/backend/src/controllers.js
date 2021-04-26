const share = require('./controller/share.js');

module.exports = app => {
  const controllers = {
    share,
  };
  return controllers;
};
