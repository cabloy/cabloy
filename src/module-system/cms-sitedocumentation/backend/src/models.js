const document = require('./model/document.js');

module.exports = app => {
  const models = {
    document,
  };
  return models;
};
