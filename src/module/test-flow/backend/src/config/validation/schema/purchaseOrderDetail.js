module.exports = app => {
  const schemas = {};
  // detail
  const __atomParams = {
    target: '_self',
    atomClass: {
      module: 'test-flow',
      atomClassName: 'product',
    },
    selectOptions: {},
    atomId: 'detailCodeId',
    mapper: {
      detailCodeId: 'atomId',
      detailCode: 'productCode',
      detailName: 'atomName',
      price: 'productPrice',
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
        ebType: 'text',
        ebTitle: 'Product Code',
        ebReadOnly: true,
        notEmpty: true,
      },
      detailName: {
        type: 'string',
        ebType: 'atom',
        ebTitle: 'Product Name',
        ebParams: __atomParams,
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
        ebComputed: {
          expression: 'price * quantity',
          dependencies: 'price,quantity',
        },
        ebReadOnly: true,
        ebTitle: 'Amount',
      },
    },
  };
  return schemas;
};
