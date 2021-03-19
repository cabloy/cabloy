module.exports = app => {
  const schemas = {};
  // detail
  const __atomParams = {
    atomClass: {
      module: 'test-flow',
      atomClassName: 'product',
    },
    atomId: 'detailCodeId',
    mapper: {
      detailCodeId: 'atomId',
      detailCode: 'productCode',
      detailName: 'atomName',
    },
  };
  schemas.purchaseOrderDetail = {
    type: 'object',
    properties: {
      detailCodeId: {
        type: 'number',
      },
      detailCode: {
        type: 'string',
        ebType: 'atom',
        ebTitle: 'Product Code',
        ebParams: __atomParams,
        ebReadOnly: true,
        notEmpty: true,
      },
      detailName: {
        type: 'string',
        ebType: 'atom',
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
