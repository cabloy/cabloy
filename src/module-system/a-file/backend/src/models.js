const file = require('./model/file.js');

module.exports = app => {
  const models = {
    file,
  };
  return models;
};
