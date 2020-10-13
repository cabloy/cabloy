module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        flowDef: {
          info: {
            bean: 'flowDef',
            title: 'FlowDefinition',
            tableName: 'aFlowDef',
            tableNameFull: 'aFlowDefViewFull',
          },
          validator: 'flowDef',
          search: {
            validator: 'flowDefSearch',
          },
        },
      },
      functions: {
        createFlowDef: {
          title: 'Create FlowDefinition',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'flowDef',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listFlowDef: {
          title: 'FlowDefinition List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'flowDef',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
      },
    },
    validation: {
      validators: {
        flowDef: {
          schemas: 'flowDef',
        },
        flowDefSearch: {
          schemas: 'flowDefSearch',
        },
      },
      keywords: {},
      schemas: {
        flowDef: schemas.flowDef,
        flowDefSearch: schemas.flowDefSearch,
      },
    },
  };
  return meta;
};
