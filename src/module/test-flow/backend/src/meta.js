const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    const keywords = require('./config/validation/keywords.js')(app);
    const schemas = require('./config/validation/schemas.js')(app);
    const staticFlowDefs = require('./config/static/flowDefs.js')(app);
    const staticResources = require('./config/static/resources.js')(app);
    const staticProducts = require('./config/static/products.js')(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          purchaseOrder: {
            info: {
              bean: 'purchaseOrder',
              title: 'Purchase Order',
              tableName: 'testFlowPurchaseOrder',
              details: [ 'default' ],
            },
            actions: {
            },
            validator: 'purchaseOrder',
            search: {
              validator: 'purchaseOrderSearch',
            },
          },
          product: {
            info: {
              bean: 'product',
              title: 'Product',
              tableName: 'testFlowProduct',
            },
            actions: {
            },
            validator: 'product',
            search: {
              validator: 'productSearch',
            },
          },
        },
        statics: {
          'a-flow.flowDef': {
            items: staticFlowDefs,
          },
          'a-base.resource': {
            items: staticResources,
          },
          'test-flow.product': {
            items: staticProducts,
          },
        },
      },
      detail: {
        details: {
          default: {
            info: {
              bean: 'purchaseOrder',
              title: 'Details',
              tableName: 'testFlowPurchaseOrderDetail',
            },
            actions: {
            },
            validator: 'purchaseOrderDetail',
          },
        },
      },
      validation: {
        validators: {
          // purchaseOrder
          purchaseOrder: {
            schemas: 'purchaseOrder',
          },
          purchaseOrderSearch: {
            schemas: 'purchaseOrderSearch',
          },
          // product
          product: {
            schemas: 'product',
          },
          productSearch: {
            schemas: 'productSearch',
          },
          // purchaseOrderDetail
          purchaseOrderDetail: {
            schemas: 'purchaseOrderDetail',
          },
        },
        keywords: {
          'x-productCode': keywords.productCode,
        },
        schemas,
      },
      index: {
        indexes: {
          testFlowProduct: 'createdAt,updatedAt,atomId,productCode',
          testFlowPurchaseOrder: 'createdAt,updatedAt,atomId',
          testFlowPurchaseOrderDetail: 'createdAt,updatedAt,atomId,detailId',
        },
      },
    });
  }
  return meta;
};
