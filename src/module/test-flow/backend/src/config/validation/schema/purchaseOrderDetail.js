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
  const __display = {
    expression: '!!detailCodeId',
    dependencies: ['detailCodeId'],
    // host: {
    //   stage: 'draft', // draft/formal/history
    //   mode: 'edit', // view
    // },
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
        notEmpty: true,
      },
      detailName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Name',
        notEmpty: true,
        ebDisplay: __display,
      },
      price: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Price',
        ebCurrency: true,
        ebDisplay: __display,
      },
      quantity: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Quantity',
        ebDisplay: __display,
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
        ebDisplay: __display,
      },
    },
  };
  return schemas;
};
