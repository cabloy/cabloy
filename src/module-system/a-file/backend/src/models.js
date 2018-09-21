const file = require('./model/file.js');
const fileView = require('./model/fileView.js');

module.exports = app => {
  const models = {
    file,
    fileView,
  };
  return models;
};
