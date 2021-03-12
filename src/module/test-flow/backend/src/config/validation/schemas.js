const product = require('./schema/product.js');
const purchaseOrder = require('./schema/purchaseOrder.js');
const purchaseOrderDetail = require('./schema/purchaseOrderDetail.js');

module.exports = app => {
  const schemas = {};
  // product
  Object.assign(schemas, product(app));
  // purchase order
  Object.assign(schemas, purchaseOrder(app));
  // purchase order detail
  Object.assign(schemas, purchaseOrderDetail(app));
  // ok
  return schemas;
};
