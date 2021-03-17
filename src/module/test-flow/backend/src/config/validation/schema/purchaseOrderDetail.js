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
      price: {
        type: 'number',
        ebType: 'currency',
        ebTitle: 'Price',
      },
      quantity: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Quantity',
      },
      amount: {
        type: 'number',
        ebType: 'currency',
        ebTitle: 'Amount',
      },
    },
  };
  return schemas;
};
