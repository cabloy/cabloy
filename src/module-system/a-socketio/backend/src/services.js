const io = require('./service/io.js');
const messageClass = require('./service/messageClass.js');
const message = require('./service/message.js');

module.exports = app => {
  const services = {
    io,
    messageClass,
    message,
  };
  return services;
};
