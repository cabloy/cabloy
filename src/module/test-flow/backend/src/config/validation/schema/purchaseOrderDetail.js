module.exports = app => {
  const schemas = {};
  // detail
  schemas.purchaseOrderDetail = {
    type: 'object',
    properties: {
      detailCodeId: {
        type: 'number',
      },
      detailCode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Code',
        notEmpty: true,
      },
      detailName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Name',
        notEmpty: true,
      },
      productPrice: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Price',
      },
      productQuantity: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Quantity',
      },
      productAmount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Amount',
      },
    },
  };
  return schemas;
};
