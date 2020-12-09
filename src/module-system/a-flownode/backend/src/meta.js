const flowNodes = require('./config/flow/nodes.js');
const flowEdges = require('./config/flow/edges.js');

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
      edges: flowEdges,
    },
  };
  return meta;
};
