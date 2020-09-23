module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    flow: {
      nodes: {
        startEventNone: {
          title: 'StartEventNone',
          group: 'startEvent',
          bean: 'startEventNone',
          icon: '/api/static/a/flownode/node/start-event-none',
        },
        endEventNone: {
          title: 'EndEventNone',
          group: 'endEvent',
          bean: 'endEventNone',
          icon: '/api/static/a/flownode/node/start-event-none',
        },
      },
    },
  };
  return meta;
};
