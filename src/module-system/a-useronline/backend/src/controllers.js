const userOnline = require('./controller/userOnline.js');

module.exports = app => {
  const controllers = {
    userOnline,
  };
  return controllers;
};
