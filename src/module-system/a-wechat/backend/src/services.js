const version = require('./service/version.js');
const message = require('./service/message.js');
const event = require('./service/event.js');
const jsapi = require('./service/jsapi.js');

module.exports = app => {
  const services = {
    version,
    message,
    event,
    jsapi,
  };
  return services;
};
