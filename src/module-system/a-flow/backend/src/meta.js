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
            tableNameModes: {
              full: 'aFlowDefViewFull',
            },
          },
          actions: {
            enable: {
              code: 101,
              title: 'Enable',
              actionComponent: 'actionFlowDef',
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'archive',
              icon: { material: 'play_arrow' },
            },
            disable: {
              code: 102,
              title: 'Disable',
              actionComponent: 'actionFlowDef',
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'archive',
              icon: { material: 'stop' },
            },
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
