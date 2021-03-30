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
        ebReadOnly: false,
        ebDisabled: true,
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
        ebType: 'text',
        ebTitle: 'Price',
        ebCurrency: true,
      },
      quantity: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Quantity',
      },
      amount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Amount',
        ebComputed: {
          expression: 'price * quantity',
          dependencies: 'price,quantity',
        },
        ebCurrency: true,
        ebReadOnly: true,
      },
    },
  };
  return schemas;
};
