module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        flowDefinition: {
          info: {
            bean: 'flowDefinition',
            title: 'FlowDefinition',
            tableName: 'aFlowDefinition',
          },
          actions: {
          },
          flags: {
          },
          validator: 'flowDefinition',
          search: {
            validator: 'flowDefinitionSearch',
          },
        },
      },
      functions: {
        createFlowDefinition: {
          title: 'Create FlowDefinition',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'flowDefinition',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listFlowDefinition: {
          title: 'FlowDefinition List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'flowDefinition',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
      },
    },
    validation: {
      validators: {
        flowDefinition: {
          schemas: 'flowDefinition',
        },
        flowDefinitionSearch: {
          schemas: 'flowDefinitionSearch',
        },
      },
      keywords: {},
      schemas: {
        flowDefinition: schemas.flowDefinition,
        flowDefinitionSearch: schemas.flowDefinitionSearch,
      },
    },
  };
  return meta;
};
