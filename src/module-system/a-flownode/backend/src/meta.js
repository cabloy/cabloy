module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const flowNodes = require('./config/flow/nodes.js')(app);
  const flowEdges = require('./config/flow/edges.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      schemas,
    },
    flow: {
      nodes: flowNodes,
      edges: flowEdges,
    },
  };
  return meta;
};
