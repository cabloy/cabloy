const note = require('./model/note.js');

module.exports = app => {
  const models = {
    note,
  };
  return models;
};
