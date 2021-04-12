module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const flowNodes = require('./config/flow/nodes.js')(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
        // startEventAtom
        startEventAtom: {
          schemas: 'startEventAtom,activityUserTask',
        },
        // activityUserTask
        activityUserTask: {
          schemas: 'activityUserTask',
        },
      },
      keywords: {},
      schemas,
    },
    flow: {
      nodes: flowNodes,
    },
    stats: {
      providers: {
        taskClaimings: {
          user: true,
          bean: 'taskClaimings',
        },
        taskHandlings: {
          user: true,
          bean: 'taskHandlings',
        },
        taskClaimingsHandlings: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: [
            'a-flowtask:taskClaimings',
            'a-flowtask:taskHandlings',
          ],
        },
      },
    },
  };
  return meta;
};
