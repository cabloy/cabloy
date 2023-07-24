const detail = require('./model/detail.js');
const detailClass = require('./model/detailClass.js');
const detailBase = require('./model/detailBase.js');

module.exports = app => {
  const models = {
    detail,
    detailClass,
    detailBase,
  };
  return models;
};
