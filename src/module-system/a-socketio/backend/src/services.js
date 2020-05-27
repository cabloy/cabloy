const version = require('./service/version.js');
const io = require('./service/io.js');
const messageClass = require('./service/messageClass.js');
const offline = require('./service/offline.js');

module.exports = app => {
  const services = {
    version,
    io,
    messageClass,
    offline,
  };
  return services;
};
