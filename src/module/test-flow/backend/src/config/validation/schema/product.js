module.exports = app => {
  const schemas = {};
  // product
  schemas.product = {
    type: 'object',
    properties: {
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
      },
      productPrice: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Product Price',
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
