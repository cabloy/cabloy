const messageClass = require('./model/messageClass.js');
const message = require('./model/message.js');
const messageSync = require('./model/messageSync.js');

module.exports = app => {
  const models = {
    messageClass,
    message,
    messageSync,
  };
  return models;
};
