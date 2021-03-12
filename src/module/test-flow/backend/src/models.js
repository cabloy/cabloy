const product = require('./model/product.js');
const purchaseOrder = require('./model/purchaseOrder.js');

module.exports = app => {
  const models = {
    product,
    purchaseOrder,
  };
  return models;
};
