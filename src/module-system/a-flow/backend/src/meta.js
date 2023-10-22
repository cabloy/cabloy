module.exports = app => {
  const schemas = require('./meta/validation/schemas.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  const socketioWorkflow = require('./meta/socketio/workflow.js')(app);
  const flowBehaviors = require('./meta/flow/behaviors.js')(app);
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
            history: true,
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
      validators: {},
      keywords: {},
      schemas,
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
