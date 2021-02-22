const flowNodes = require('./config/flow/nodes.js');

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
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
