const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    const schemas = require('./config/validation/schemas.js')(app);
    const flowDefinitions = require('./config/flow/definitions.js')(app);
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
        functions: {
          createPurchaseOrder: {
            title: 'Create Purchase Order',
            scene: 'create',
            autoRight: 1,
            atomClassName: 'purchaseOrder',
            action: 'create',
            sorting: 1,
            menu: 1,
          },
          listPurchaseOrder: {
            title: 'Purchase Order List',
            scene: 'list',
            autoRight: 1,
            atomClassName: 'purchaseOrder',
            action: 'read',
            sorting: 1,
            menu: 1,
          },
        },
        statics: {
          'a-flow.flowDef': {
            items: flowDefinitions,
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
