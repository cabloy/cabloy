const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    const schemas = require('./config/validation/schemas.js')(app);
    const staticFlowDefs = require('./config/static/flowDefs.js')(app);
    const staticResources = require('./config/static/resources.js')(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          purchaseOrder: {
            info: {
              bean: 'purchaseOrder',
              title: 'Purchase Order',
              tableName: 'testFlowPurchaseOrder',
            },
            actions: {
            },
            validator: 'purchaseOrder',
            search: {
              validator: 'purchaseOrderSearch',
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
        },
      },
      validation: {
        validators: {
          purchaseOrder: {
            schemas: 'purchaseOrder',
          },
          purchaseOrderSearch: {
            schemas: 'purchaseOrderSearch',
          },
        },
        keywords: {},
        schemas: {
          purchaseOrder: schemas.purchaseOrder,
          purchaseOrderSearch: schemas.purchaseOrderSearch,
        },
      },
    });
  }
  return meta;
};
