const detail = require('./model/detail.js');
const detailClass = require('./model/detailClass.js');

module.exports = app => {
  const models = {
    detail,
    detailClass,
  };
  return models;
};
