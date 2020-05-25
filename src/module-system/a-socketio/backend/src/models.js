const messageClass = require('./model/messageClass.js');
const message = require('./model/message.js');

module.exports = app => {
  const models = {
    messageClass,
    message,
  };
  return models;
};
