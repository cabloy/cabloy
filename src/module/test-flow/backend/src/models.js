const purchaseOrder = require('./model/purchaseOrder.js');

module.exports = app => {
  const models = {
    purchaseOrder,
  };
  return models;
};
