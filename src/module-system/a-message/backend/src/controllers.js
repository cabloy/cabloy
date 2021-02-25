const message = require('./controller/message.js');

module.exports = app => {
  const controllers = {
    message,
  };
  return controllers;
};
