module.exports = app => {
  const schemas = {};
  // purchase order
  schemas.purchaseOrder = {
    type: 'object',
    meta: {
      custom: {
        // component: 'purchaseOrderItem',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      flowDefKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Flow Definition',
      },
    },
  };
  // purchase order search
  schemas.purchaseOrderSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
