module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const socketioWorkflow = require('./config/socketio/workflow.js')(app);
  const flowBehaviors = require('./config/flow/behaviors.js')(app);
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
            inner: true,
            resource: true,
            category: true,
            tag: true,
            comment: false,
            attachment: false,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'flowDef',
          search: {
            validator: 'flowDefSearch',
          },
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
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
    stats: {
      providers: {
        flowInitiateds: {
          user: true,
          bean: 'flowInitiateds',
        },
      },
    },
    socketio: {
      messages: {
        workflow: socketioWorkflow,
      },
    },
    flow: {
      behaviors: flowBehaviors,
    },
  };
  return meta;
};
