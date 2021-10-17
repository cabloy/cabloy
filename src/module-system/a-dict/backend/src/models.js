const dict = require('./model/dict.js');
const dictContent = require('./model/dictContent.js');

module.exports = app => {
  const models = {
    dict,
    dictContent,
  };
  return models;
};
