module.exports = app => {
  const schemas = {};
  // product
  schemas.product = {
    type: 'object',
    properties: {
      atomId: {
        type: 'number',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Name',
        notEmpty: true,
      },
      productCode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Code',
        notEmpty: true,
        'x-productCode': true,
      },
      productPrice: {
        type: 'number',
        ebType: 'currency',
        ebTitle: 'Product Price',
        // notEmpty: true,
      },
    },
  };
  // product
  schemas.productSearch = {
    type: 'object',
    properties: {
      productCode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Code',
      },
    },
  };
  return schemas;
};
