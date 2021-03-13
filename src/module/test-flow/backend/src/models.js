const product = require('./model/product.js');
const purchaseOrder = require('./model/purchaseOrder.js');
const purchaseOrderDetail = require('./model/purchaseOrderDetail.js');

module.exports = app => {
  const models = {
    product,
    purchaseOrder,
    purchaseOrderDetail,
  };
  return models;
};
