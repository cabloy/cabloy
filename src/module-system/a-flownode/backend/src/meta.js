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
          icon: '/api/static/a/flownode/bpmn/events/start-event-none.svg',
        },
        endEventNone: {
          title: 'EndEventNone',
          group: 'endEvent',
          bean: 'endEventNone',
          icon: '/api/static/a/flownode/bpmn/events/end-event-none.svg',
        },
      },
    },
  };
  return meta;
};
